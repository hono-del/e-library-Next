import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { localSearch, mockDatabase, searchDocuments } from '@/app/lib/search-data'

const DEFAULTModel = 'claude-sonnet-4-20250514'
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

type SearchResult = Record<string, unknown> & {
  id: string
  type: string
  relevanceScore?: number
}

function enrichResult(result: SearchResult) {
  const baseResult: SearchResult = {
    ...result,
    url:
      result.type === 'manual'
        ? `/manuals/${result.id}`
        : result.type === 'tie'
        ? `/ties/${result.id}`
        : `/qa-questions/${result.id}`,
  }

  const dbItem = searchDocuments.find((d) => d.id === result.id)
  if (dbItem) {
    if (dbItem.section) baseResult.section = dbItem.section
    if (dbItem.symptom) baseResult.symptom = dbItem.symptom
    if (dbItem.solution) baseResult.solution = dbItem.solution
    if (dbItem.bestAnswer) baseResult.bestAnswer = dbItem.bestAnswer
    baseResult.vehicleModel = dbItem.vehicleModel
    baseResult.modelYear = dbItem.modelYear
  }

  return baseResult
}

function mergeResults(claudeResults: SearchResult[], localResults: SearchResult[]) {
  const merged = new Map<string, SearchResult>()

  for (const result of localResults) {
    merged.set(String(result.id), enrichResult(result))
  }

  for (const result of claudeResults) {
    const existing = merged.get(String(result.id))
    merged.set(
      String(result.id),
      enrichResult({
        ...existing,
        ...result,
        relevanceScore: Math.max(
          Number(existing?.relevanceScore ?? 0),
          Number(result.relevanceScore ?? 0)
        ),
      })
    )
  }

  return Array.from(merged.values())
    .sort((a, b) => Number(b.relevanceScore ?? 0) - Number(a.relevanceScore ?? 0))
    .slice(0, 5)
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY が設定されていません' },
        { status: 500 }
      )
    }

    const { query, vehicleModel, modelYear } = await request.json()

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ error: 'クエリが空です' }, { status: 400 })
    }

    const localResults = localSearch(query, vehicleModel, modelYear, 5) as SearchResult[]

    const searchPrompt = `あなたは自動車整備情報の検索アシスタントです。

ユーザーの検索クエリ: "${query}"
対象車両: ${vehicleModel || '指定なし'} ${modelYear || ''}年式

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

    let claudeResults: SearchResult[] = []
    try {
      const searchResponse = await createClaudeMessage({
        max_tokens: 2000,
        messages: [{ role: 'user', content: searchPrompt }],
      })

      const searchContent = searchResponse.content[0]
      if (searchContent.type === 'text') {
        const parsed = parseJsonFromClaude(searchContent.text) as {
          results?: SearchResult[]
        }
        claudeResults = parsed.results ?? []
      }
    } catch (error) {
      console.warn('Claude search ranking failed, using local search only:', error)
    }

    const enrichedResults = mergeResults(claudeResults, localResults)

    const summaryPrompt = `あなたは自動車整備のエキスパートです。

検索クエリ: "${query}"
対象車両: ${vehicleModel || '指定なし'} ${modelYear || ''}年式

以下の検索結果を分析し、整備士にとって有益な要約を作成してください。

【検索結果】
${JSON.stringify(enrichedResults, null, 2)}

【要件】
- 検索結果の主要なポイントを3-4つの箇条書きでまとめる
- O2センサー点検の具体的な手順（配線確認、抵抗値、電圧波形など）を含める
- ${vehicleModel || '対象車両'} ${modelYear || ''}年式向けの注意点があれば記載
- 簡潔で実用的な情報にする

【出力形式】
検索キーワード「${query}」について、${vehicleModel || '対象'} ${modelYear || ''}年式に関連する情報を見つけました。主な内容は以下の通りです：

• **点検手順**: ...
• **確認ポイント**: ...
• **修理事例**: ...
• **注意点**: ...`

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
      aiSummary = buildFallbackSummary(query, vehicleModel, modelYear, enrichedResults)
    }

    if (!aiSummary && enrichedResults.length > 0) {
      aiSummary = buildFallbackSummary(query, vehicleModel, modelYear, enrichedResults)
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

function buildFallbackSummary(
  query: string,
  vehicleModel: string | undefined,
  modelYear: string | number | undefined,
  results: SearchResult[]
) {
  const vehicleLabel = vehicleModel && modelYear ? `${vehicleModel} ${modelYear}年式` : '対象車両'
  const titles = results.map((r) => `・${r.title}`).join('\n')

  return `検索キーワード「${query}」について、${vehicleLabel}に関連する情報を${results.length}件見つけました。

• **点検手順**: 配線・コネクタ確認 → 抵抗値測定（4-14Ω）→ DGSで電圧波形確認
• **確認ポイント**: フロントO2センサーとリアO2センサーの応答速度を比較
• **関連情報**:
${titles}
• **注意点**: センサー交換時はトルク55Nm、作業前にイグニッションOFF`
}
