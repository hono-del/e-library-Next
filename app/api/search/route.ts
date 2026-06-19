import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import {
  buildFallbackSummary,
  getMockDatabase,
  getSearchDocuments,
  localSearch,
  SearchResultItem,
} from '@/app/lib/search-data'
import { Locale } from '@/app/lib/i18n/types'

const MODEL_FALLBACKS = [
  'claude-sonnet-4-6',
  'claude-sonnet-4-20250514',
  'claude-3-5-sonnet-20240620',
  'claude-3-haiku-20240307',
]

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

async function createClaudeMessage(params: {
  max_tokens: number
  messages: Anthropic.MessageCreateParams['messages']
}) {
  const preferred = process.env.ANTHROPIC_MODEL ? [process.env.ANTHROPIC_MODEL] : []
  const models = [...new Set([...preferred, ...MODEL_FALLBACKS])]

  let lastError: unknown
  for (const model of models) {
    try {
      return await anthropic.messages.create({ ...params, model })
    } catch (error) {
      lastError = error
      const status = (error as { status?: number }).status
      if (status !== 404) throw error
    }
  }
  throw lastError
}

function parseJsonFromClaude(text: string): unknown {
  let jsonText = text.trim()
  const fence = '```'
  if (jsonText.startsWith(fence)) {
    jsonText = jsonText
      .replace(/^```json?\s*/i, '')
      .replace(/```\s*$/, '')
      .trim()
  }
  return JSON.parse(jsonText)
}

function parseLocale(value: unknown): Locale {
  return value === 'en' ? 'en' : 'ja'
}

function enrichResult(result: SearchResultItem, locale: Locale): SearchResultItem {
  const baseResult: SearchResultItem = {
    ...result,
    url:
      result.url ??
      (result.type === 'manual'
        ? `/manuals/${result.id}`
        : result.type === 'tie'
        ? `/ties/${result.id}`
        : `/qa-questions/${result.id}`),
  }

  const dbItem = getSearchDocuments(locale).find((d) => d.id === result.id)
  if (dbItem) {
    baseResult.title = dbItem.title
    baseResult.snippet =
      dbItem.content.slice(0, 150) + (dbItem.content.length > 150 ? '...' : '')
    if (dbItem.section) baseResult.section = dbItem.section
    if (dbItem.symptom) baseResult.symptom = dbItem.symptom
    if (dbItem.solution) baseResult.solution = dbItem.solution
    if (dbItem.bestAnswer) baseResult.bestAnswer = dbItem.bestAnswer
    baseResult.vehicleModel = dbItem.vehicleModel
    baseResult.modelYear = dbItem.modelYear
  }

  return baseResult
}

function mergeResults(
  claudeResults: SearchResultItem[],
  localResults: SearchResultItem[],
  locale: Locale
) {
  const merged = new Map<string, SearchResultItem>()

  for (const result of localResults) {
    merged.set(String(result.id), enrichResult(result, locale))
  }

  for (const result of claudeResults) {
    const existing = merged.get(String(result.id))
    merged.set(
      String(result.id),
      enrichResult(
        {
          ...existing,
          ...result,
          relevanceScore: Math.max(
            existing?.relevanceScore ?? 0,
            result.relevanceScore ?? 0
          ),
        },
        locale
      )
    )
  }

  return Array.from(merged.values())
    .sort((a, b) => (b.relevanceScore ?? 0) - (a.relevanceScore ?? 0))
    .slice(0, 5)
}

function buildSearchPrompt(
  query: string,
  vehicleModel: string | undefined,
  modelYear: string | number | undefined,
  locale: Locale
) {
  const mockDatabase = getMockDatabase(locale)
  const yearLabel = locale === 'en' ? '' : '年式'
  const vehicleLine = `${vehicleModel || (locale === 'en' ? 'Not specified' : '指定なし')} ${modelYear || ''}${modelYear ? yearLabel : ''}`.trim()
  const langNote =
    locale === 'en'
      ? 'All titles and snippets in the JSON output MUST be in English.'
      : 'JSON内のtitleとsnippetはすべて日本語で出力してください。'

  if (locale === 'en') {
    return `You are an automotive service information search assistant. Respond in English.

User search query: "${query}"
Target vehicle: ${vehicleLine}

Select the most relevant items from the database below and assign relevance scores (0.0-1.0).

【Database】
${JSON.stringify(mockDatabase, null, 2)}

【Requirements】
- Understand search intent and select semantically related information
- Prioritize information for the specified vehicle when provided
- Items with vehicleModel "all" apply to all models and may be included
- For O2 sensor / inspection / replacement queries, prioritize manual-456, manual-b-o2, qa-o2-inspection
- Return at least 3 results (up to 5 if relevant)
- Assign a relevance score (0.0-1.0) to each result
- ${langNote}

【Output format】
Return JSON only:
{
  "results": [
    {
      "type": "manual" | "tie" | "qa",
      "id": "string",
      "title": "string",
      "snippet": "string (summary within 150 characters)",
      "relevanceScore": number,
      "vehicleModel": "string",
      "modelYear": number | "all"
    }
  ]
}`
  }

  return `あなたは自動車整備情報の検索アシスタントです。日本語で回答してください。

ユーザーの検索クエリ: "${query}"
対象車両: ${vehicleLine}

以下のデータベースから、検索クエリに関連性の高い情報を選択し、関連度スコア（0.0-1.0）を付けてください。

【データベース】
${JSON.stringify(mockDatabase, null, 2)}

【要件】
- 検索クエリの意図を理解し、セマンティックに関連する情報を選択
- 車両情報が指定されている場合は、その車両に関連する情報を優先
- vehicleModelが"all"の情報は全車種共通として必ず関連クエリに含めてよい
- O2センサー・点検・交換に関するクエリでは manual-456, manual-b-o2, qa-o2-inspection を優先
- 最低3件は返す（関連するものがあれば最大5件）
- 各結果に関連度スコア（0.0-1.0）を付与
- ${langNote}

【出力形式】
JSONのみを返してください。形式：
{
  "results": [
    {
      "type": "manual" | "tie" | "qa",
      "id": "string",
      "title": "string",
      "snippet": "string (150文字以内の要約)",
      "relevanceScore": number,
      "vehicleModel": "string",
      "modelYear": number | "all"
    }
  ]
}`
}

function buildSummaryPrompt(
  query: string,
  vehicleModel: string | undefined,
  modelYear: string | number | undefined,
  enrichedResults: SearchResultItem[],
  locale: Locale
) {
  const vehicleLabel =
    locale === 'en'
      ? vehicleModel && modelYear
        ? `${vehicleModel} ${modelYear}`
        : 'target vehicle'
      : vehicleModel && modelYear
      ? `${vehicleModel} ${modelYear}年式`
      : '対象車両'

  if (locale === 'en') {
    return `You are an automotive service expert. Write the summary in English.

Search query: "${query}"
Target vehicle: ${vehicleLabel}

Analyze the search results below and create a helpful summary for technicians.

【Search Results】
${JSON.stringify(enrichedResults, null, 2)}

【Requirements】
- Summarize key points in 3-4 bullet points
- Include specific O2 sensor inspection steps (wiring check, resistance, voltage waveform)
- Note any Model B 2022 specific cautions if applicable
- Keep it concise and practical

【Output format】
For search keyword "${query}", I found information related to ${vehicleLabel}. Main points:

• **Inspection Procedure**: ...
• **Key Checks**: ...
• **Repair Cases**: ...
• **Cautions**: ...`
  }

  return `あなたは自動車整備のエキスパートです。要約は日本語で作成してください。

検索クエリ: "${query}"
対象車両: ${vehicleLabel}

以下の検索結果を分析し、整備士にとって有益な要約を作成してください。

【検索結果】
${JSON.stringify(enrichedResults, null, 2)}

【要件】
- 検索結果の主要なポイントを3-4つの箇条書きでまとめる
- O2センサー点検の具体的な手順（配線確認、抵抗値、電圧波形など）を含める
- ${vehicleModel || '対象車両'} ${modelYear || ''}年式向けの注意点があれば記載
- 簡潔で実用的な情報にする

【出力形式】
検索キーワード「${query}」について、${vehicleLabel}に関連する情報を見つけました。主な内容は以下の通りです：

• **点検手順**: ...
• **確認ポイント**: ...
• **修理事例**: ...
• **注意点**: ...`
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY が設定されていません' },
        { status: 500 }
      )
    }

    const { query, vehicleModel, modelYear, locale: rawLocale } = await request.json()
    const locale = parseLocale(rawLocale)

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ error: 'クエリが空です' }, { status: 400 })
    }

    const localResults = localSearch(query, vehicleModel, modelYear, 5, locale)
    const searchPrompt = buildSearchPrompt(query, vehicleModel, modelYear, locale)

    let claudeResults: SearchResultItem[] = []
    try {
      const searchResponse = await createClaudeMessage({
        max_tokens: 2000,
        messages: [{ role: 'user', content: searchPrompt }],
      })

      const searchContent = searchResponse.content[0]
      if (searchContent.type === 'text') {
        const parsed = parseJsonFromClaude(searchContent.text) as {
          results?: SearchResultItem[]
        }
        claudeResults = parsed.results ?? []
      }
    } catch (error) {
      console.warn('Claude search ranking failed, using local search only:', error)
    }

    const enrichedResults = mergeResults(claudeResults, localResults, locale)
    const summaryPrompt = buildSummaryPrompt(
      query,
      vehicleModel,
      modelYear,
      enrichedResults,
      locale
    )

    let aiSummary = ''
    try {
      const summaryResponse = await createClaudeMessage({
        max_tokens: 1000,
        messages: [{ role: 'user', content: summaryPrompt }],
      })
      const summaryContent = summaryResponse.content[0]
      aiSummary = summaryContent.type === 'text' ? summaryContent.text : ''
    } catch (error) {
      console.warn('Claude summary failed, using fallback summary:', error)
      aiSummary = buildFallbackSummary(query, vehicleModel, modelYear, enrichedResults, locale)
    }

    if (!aiSummary && enrichedResults.length > 0) {
      aiSummary = buildFallbackSummary(query, vehicleModel, modelYear, enrichedResults, locale)
    }

    return NextResponse.json({
      results: enrichedResults,
      aiSummary,
      totalCount: enrichedResults.length,
    })
  } catch (error) {
    console.error('Search API Error:', error)
    return NextResponse.json({ error: '検索中にエラーが発生しました' }, { status: 500 })
  }
}
