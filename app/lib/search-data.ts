import { Locale } from '@/app/lib/i18n/types'

export interface SearchDocument {
  type: 'manual' | 'tie' | 'qa'
  id: string
  title: string
  content: string
  section?: string
  symptom?: string
  solution?: string
  bestAnswer?: string
  vehicleModel: string
  modelYear: number | 'all'
}

const searchDocumentsJa: SearchDocument[] = [
  {
    type: 'manual',
    id: 'manual-456',
    title: 'O2センサー点検・交換手順',
    content:
      'リアO2センサーの点検および交換方法を説明します。必要工具: トルクレンチ、マルチメーター。手順: 1. エンジンを冷却、2. コネクタを外す、3. 配線の目視点検、4. 抵抗値測定（正常値: 4-14Ω）、5. データモニターで電圧波形確認、6. センサー取り外し（締付けトルク: 55Nm）、7. 新品取り付けと動作確認',
    section: '電装 / センサー',
    vehicleModel: 'all',
    modelYear: 'all',
  },
  {
    type: 'manual',
    id: 'manual-b-o2',
    title: 'Model B サービスマニュアル: O2センサー点検',
    content:
      'Model B 2022年式のO2センサー点検手順。フロント/リアO2センサーの配線コネクタ確認、センサー抵抗値測定、DGSデータモニターでの電圧応答確認。Model BはリアO2センサーコネクタに水が入りやすいため、内部の腐食も点検すること。',
    section: 'Model B / 排気系統',
    vehicleModel: 'Model B',
    modelYear: 2022,
  },
  {
    type: 'manual',
    id: 'manual-123',
    title: 'サービスマニュアル: P0420 - 触媒効率低下',
    content:
      'DTC P0420は触媒システムの効率低下を示します。リアO2センサーの出力電圧がフロントO2センサーと類似している場合に検出されます。診断手順: 1. O2センサーの配線を確認、2. センサーの抵抗値を測定（正常値: 4-14Ω）、3. 触媒前後の温度差を確認（正常値: 50℃以上）',
    section: 'エンジン / 排気系統',
    vehicleModel: 'all',
    modelYear: 'all',
  },
  {
    type: 'tie',
    id: 'tie-b-2022',
    title: 'Model B 2022年 O2センサー交換事例',
    content:
      'Model B 2022年式、走行距離28,500km。DTC P0420発生。O2センサー前後の電圧波形が同期気味。リアO2センサーの応答が遅いため交換。部品番号22690-BB456、作業時間1.5時間、費用約3万円。交換後DTC再発なし。',
    symptom: '触媒効率警告灯点灯',
    solution: 'リアO2センサー交換で解決',
    vehicleModel: 'Model B',
    modelYear: 2022,
  },
  {
    type: 'tie',
    id: 'tie-456',
    title: 'P0420対応事例',
    content:
      'お客様からの申告: エンジンチェックランプが点灯。O2センサー前後の電圧波形がほぼ同期。触媒前後の温度差が20℃と小さい。リアO2センサー交換で解決。作業時間: 1.5時間、費用: 約3万円',
    symptom: '触媒効率警告灯点灯',
    solution: 'O2センサー交換で解決',
    vehicleModel: 'Model A',
    modelYear: 2024,
  },
  {
    type: 'tie',
    id: 'tie-789',
    title: '触媒交換事例',
    content:
      '走行距離12万kmの車両で、O2センサー交換後もP0420が再発。触媒前後の温度差が10℃しかなく、触媒本体を交換して解決。作業時間: 3時間、費用: 約15万円',
    symptom: 'センサー交換後もDTC再発',
    solution: '触媒本体交換',
    vehicleModel: 'Model A',
    modelYear: 2023,
  },
  {
    type: 'qa',
    id: 'qa-o2-inspection',
    title: 'O2センサーの点検方法を教えてください',
    content:
      'O2センサー点検の基本手順: 1. 配線・コネクタの目視点検、2. 抵抗値測定（4-14Ω）、3. DGSでアイドリング時の電圧波形確認、4. 2500rpm時の応答速度確認。フロントO2センサーと比較してリアの応答が遅い場合は劣化の可能性が高い。',
    bestAnswer: '配線確認→抵抗値測定→電圧波形確認の順で点検',
    vehicleModel: 'all',
    modelYear: 'all',
  },
  {
    type: 'qa',
    id: 'qa-789',
    title: 'P0420のよくある原因は？',
    content:
      'P0420の原因として最も多いのはO2センサーの劣化です（約70%）。データモニターで電圧波形を確認し、フロントO2センサーと比較して応答が遅い場合はセンサー劣化。触媒前後の温度差が50℃未満の場合は触媒劣化の可能性が高い。',
    bestAnswer: 'O2センサーの劣化が最も多い原因です',
    vehicleModel: 'all',
    modelYear: 'all',
  },
]

const searchDocumentsEn: SearchDocument[] = [
  {
    type: 'manual',
    id: 'manual-456',
    title: 'O2 Sensor Inspection & Replacement Procedure',
    content:
      'Describes rear O2 sensor inspection and replacement. Required tools: torque wrench, multimeter. Steps: 1. Cool engine, 2. Disconnect connector, 3. Visual wiring inspection, 4. Resistance measurement (normal: 4-14Ω), 5. Voltage waveform via data monitor, 6. Remove sensor (torque: 55Nm), 7. Install new sensor and verify operation',
    section: 'Electrical / Sensors',
    vehicleModel: 'all',
    modelYear: 'all',
  },
  {
    type: 'manual',
    id: 'manual-b-o2',
    title: 'Model B Service Manual: O2 Sensor Inspection',
    content:
      'O2 sensor inspection for Model B 2022. Check front/rear O2 sensor wiring connectors, measure sensor resistance, verify voltage response via DGS data monitor. Model B rear O2 sensor connectors are prone to water intrusion—also inspect for internal corrosion.',
    section: 'Model B / Exhaust System',
    vehicleModel: 'Model B',
    modelYear: 2022,
  },
  {
    type: 'manual',
    id: 'manual-123',
    title: 'Service Manual: P0420 - Catalyst Efficiency Below Threshold',
    content:
      'DTC P0420 indicates catalyst system efficiency below threshold. Detected when rear O2 sensor output voltage is similar to front O2 sensor. Diagnosis: 1. Check O2 sensor wiring, 2. Measure resistance (normal: 4-14Ω), 3. Verify pre/post catalyst temperature difference (normal: 50°C or more)',
    section: 'Engine / Exhaust System',
    vehicleModel: 'all',
    modelYear: 'all',
  },
  {
    type: 'tie',
    id: 'tie-b-2022',
    title: 'Model B 2022 O2 Sensor Replacement Case',
    content:
      'Model B 2022, 28,500 km. DTC P0420 set. Front/rear O2 voltage waveforms nearly synchronized. Rear O2 sensor response slow—replaced. Part no. 22690-BB456, 1.5 hr labor, approx. ¥30,000. No DTC recurrence after replacement.',
    symptom: 'Catalyst efficiency warning lamp on',
    solution: 'Resolved by rear O2 sensor replacement',
    vehicleModel: 'Model B',
    modelYear: 2022,
  },
  {
    type: 'tie',
    id: 'tie-456',
    title: 'P0420 Repair Case',
    content:
      'Customer report: engine check lamp on. Front/rear O2 voltage waveforms nearly synchronized. Pre/post catalyst temperature difference only 20°C. Resolved by rear O2 sensor replacement. Labor: 1.5 hr, cost: approx. ¥30,000',
    symptom: 'Catalyst efficiency warning lamp on',
    solution: 'Resolved by O2 sensor replacement',
    vehicleModel: 'Model A',
    modelYear: 2024,
  },
  {
    type: 'tie',
    id: 'tie-789',
    title: 'Catalyst Replacement Case',
    content:
      'Vehicle with 120,000 km; P0420 recurred after O2 sensor replacement. Pre/post catalyst temperature difference only 10°C—resolved by catalyst replacement. Labor: 3 hr, cost: approx. ¥150,000',
    symptom: 'DTC recurred after sensor replacement',
    solution: 'Catalyst replacement',
    vehicleModel: 'Model A',
    modelYear: 2023,
  },
  {
    type: 'qa',
    id: 'qa-o2-inspection',
    title: 'How do I inspect the O2 sensor?',
    content:
      'Basic O2 sensor inspection: 1. Visual wiring/connector check, 2. Resistance measurement (4-14Ω), 3. Idle voltage waveform via DGS, 4. Response speed at 2500 rpm. If rear response is slower than front, degradation is likely.',
    bestAnswer: 'Inspect in order: wiring → resistance → voltage waveform',
    vehicleModel: 'all',
    modelYear: 'all',
  },
  {
    type: 'qa',
    id: 'qa-789',
    title: 'What are common causes of P0420?',
    content:
      'Most common cause of P0420 is O2 sensor degradation (~70%). Check voltage waveform on data monitor; if rear response is slower than front, sensor is degraded. If pre/post catalyst temperature difference is under 50°C, catalyst degradation is likely.',
    bestAnswer: 'O2 sensor degradation is the most common cause',
    vehicleModel: 'all',
    modelYear: 'all',
  },
]

/** @deprecated Use getSearchDocuments(locale) instead */
export const searchDocuments = searchDocumentsJa

export function getSearchDocuments(locale: Locale = 'ja'): SearchDocument[] {
  return locale === 'en' ? searchDocumentsEn : searchDocumentsJa
}

export function getMockDatabase(locale: Locale = 'ja') {
  const docs = getSearchDocuments(locale)
  return {
    manuals: docs.filter((d) => d.type === 'manual'),
    ties: docs.filter((d) => d.type === 'tie'),
    qaQuestions: docs.filter((d) => d.type === 'qa'),
  }
}

/** @deprecated Use getMockDatabase(locale) instead */
export const mockDatabase = getMockDatabase('ja')

const KEYWORDS: Record<Locale, string[]> = {
  ja: ['o2', 'センサ', '点検', '交換', 'p0420', '触媒', '電圧', '抵抗'],
  en: ['o2', 'sensor', 'inspect', 'inspection', 'replace', 'p0420', 'catalyst', 'voltage', 'resistance'],
}

export function normalizeQuery(query: string): string {
  return query
    .toLowerCase()
    .replace(/センサー/g, 'センサ')
    .replace(/\s+/g, '')
}

function matchesVehicle(
  doc: SearchDocument,
  vehicleModel?: string,
  modelYear?: string | number
): boolean {
  if (!vehicleModel && !modelYear) return true
  const yearStr = modelYear?.toString()
  const modelMatch = doc.vehicleModel === 'all' || !vehicleModel || doc.vehicleModel === vehicleModel
  const yearMatch = doc.modelYear === 'all' || !yearStr || doc.modelYear.toString() === yearStr
  return modelMatch && yearMatch
}

export function scoreDocument(
  doc: SearchDocument,
  query: string,
  vehicleModel?: string,
  modelYear?: string | number,
  locale: Locale = 'ja'
): number {
  const normalizedQuery = normalizeQuery(query)
  const haystack = normalizeQuery(`${doc.title} ${doc.content} ${doc.section ?? ''} ${doc.symptom ?? ''}`)
  const keywords = KEYWORDS[locale]

  let score = 0

  if (haystack.includes(normalizedQuery)) score += 0.5
  for (const keyword of keywords) {
    if (normalizedQuery.includes(keyword) && haystack.includes(keyword)) {
      score += 0.12
    }
  }

  if (vehicleModel && doc.vehicleModel === vehicleModel) score += 0.25
  if (modelYear && doc.modelYear.toString() === modelYear.toString()) score += 0.15
  if (doc.vehicleModel === 'all') score += 0.05

  return Math.min(score, 0.99)
}

export interface SearchResultItem {
  type: 'manual' | 'tie' | 'qa'
  id: string
  title: string
  snippet: string
  relevanceScore: number
  url: string
  vehicleModel?: string
  modelYear?: string | number
  section?: string
  symptom?: string
  solution?: string
  bestAnswer?: string
}

export function localSearch(
  query: string,
  vehicleModel?: string,
  modelYear?: string | number,
  limit = 5,
  locale: Locale = 'ja'
): SearchResultItem[] {
  return getSearchDocuments(locale)
    .filter((doc) => matchesVehicle(doc, vehicleModel, modelYear))
    .map((doc) => ({
      type: doc.type,
      id: doc.id,
      title: doc.title,
      snippet: doc.content.slice(0, 150) + (doc.content.length > 150 ? '...' : ''),
      relevanceScore: scoreDocument(doc, query, vehicleModel, modelYear, locale),
      url:
        doc.type === 'manual'
          ? `/manuals/${doc.id}`
          : doc.type === 'tie'
          ? `/ties/${doc.id}`
          : `/qa-questions/${doc.id}`,
      vehicleModel: doc.vehicleModel,
      modelYear: doc.modelYear,
      section: doc.section,
      symptom: doc.symptom,
      solution: doc.solution,
      bestAnswer: doc.bestAnswer,
    }))
    .filter((item) => item.relevanceScore > 0.1)
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, limit)
}

export function buildFallbackSummary(
  query: string,
  vehicleModel: string | undefined,
  modelYear: string | number | undefined,
  results: SearchResultItem[],
  locale: Locale = 'ja'
) {
  if (locale === 'en') {
    const vehicleLabel =
      vehicleModel && modelYear ? `${vehicleModel} ${modelYear}` : 'target vehicle'
    const titles = results.map((r) => `• ${r.title}`).join('\n')

    return `For search keyword "${query}", I found ${results.length} result(s) related to ${vehicleLabel}.

• **Inspection Procedure**: Visual wiring/connector check → resistance measurement (4-14Ω) → voltage waveform via DGS
• **Key Checks**: Compare front vs rear O2 sensor response speed
• **Related Information**:
${titles}
• **Caution**: Torque 55Nm when replacing sensor; ignition OFF before work`
  }

  const vehicleLabel = vehicleModel && modelYear ? `${vehicleModel} ${modelYear}年式` : '対象車両'
  const titles = results.map((r) => `・${r.title}`).join('\n')

  return `検索キーワード「${query}」について、${vehicleLabel}に関連する情報を${results.length}件見つけました。

• **点検手順**: 配線・コネクタ確認 → 抵抗値測定（4-14Ω）→ DGSで電圧波形確認
• **確認ポイント**: フロントO2センサーとリアO2センサーの応答速度を比較
• **関連情報**:
${titles}
• **注意点**: センサー交換時はトルク55Nm、作業前にイグニッションOFF`
}

export function matchesFilter(
  result: { vehicleModel?: string; modelYear?: string | number },
  filterModel: string,
  filterYear: string
): boolean {
  const modelMatch =
    filterModel === 'all' ||
    result.vehicleModel === 'all' ||
    result.vehicleModel === filterModel
  const yearMatch =
    filterYear === 'all' ||
    result.modelYear === 'all' ||
    result.modelYear?.toString() === filterYear
  return modelMatch && yearMatch
}
