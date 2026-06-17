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

export const searchDocuments: SearchDocument[] = [
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
  modelYear?: string | number
): number {
  const normalizedQuery = normalizeQuery(query)
  const haystack = normalizeQuery(`${doc.title} ${doc.content} ${doc.section ?? ''} ${doc.symptom ?? ''}`)

  const keywords = ['o2', 'センサ', '点検', '交換', 'p0420', '触媒', '電圧', '抵抗']
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
  limit = 5
): SearchResultItem[] {
  return searchDocuments
    .filter((doc) => matchesVehicle(doc, vehicleModel, modelYear))
    .map((doc) => ({
      type: doc.type,
      id: doc.id,
      title: doc.title,
      snippet: doc.content.slice(0, 150) + (doc.content.length > 150 ? '...' : ''),
      relevanceScore: scoreDocument(doc, query, vehicleModel, modelYear),
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

export const mockDatabase = {
  manuals: searchDocuments.filter((d) => d.type === 'manual'),
  ties: searchDocuments.filter((d) => d.type === 'tie'),
  qaQuestions: searchDocuments.filter((d) => d.type === 'qa'),
}
