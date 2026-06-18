import { Manual, QAQuestion, TIE } from '@/app/lib/mock-data'

export interface ManualDetail extends Manual {
  contentType: 'diagnosis' | 'repair' | 'calibration' | 'inspection' | 'report'
  body: string
}

export interface SessionContext {
  vehicleModel: string
  modelYear: number | string
  dtc?: string
}

function vehicleLabel(ctx: SessionContext) {
  return `${ctx.vehicleModel} ${ctx.modelYear}年`
}

function dtcLabel(ctx: SessionContext) {
  return ctx.dtc || 'P0420'
}

const manualTemplates: Record<string, Omit<ManualDetail, 'id' | 'title' | 'url'> & { title: (ctx: SessionContext) => string }> = {
  'manual-diag-1': {
    title: (ctx) => `診断マニュアル: ${dtcLabel(ctx)} - 診断フローチャート`,
    section: '故障診断 / DTC診断手順',
    contentType: 'diagnosis',
    relevanceScore: 0.98,
    body: 'DTC診断の基本フロー。スキャンツール接続→フリーズフレーム確認→O2センサー波形測定→触媒前後出力比較の順で実施します。',
  },
  'manual-diag-2': {
    title: (ctx) => `${vehicleLabel(ctx)} O2センサー診断手順`,
    section: '故障診断 / センサー診断',
    contentType: 'diagnosis',
    relevanceScore: 0.92,
    body: '配線・コネクタの目視点検、抵抗値測定（4-14Ω）、DGSデータモニターでの電圧波形確認を実施します。',
  },
  'manual-repair-1': {
    title: () => '整備マニュアル: O2センサー交換手順',
    section: '整備手順 / センサー交換',
    contentType: 'repair',
    relevanceScore: 0.97,
    body: 'O2センサーの脱着手順。締付トルク55Nm、アンチシーズ塗布、コネクタ確実接続を遵守してください。',
  },
  'manual-repair-2': {
    title: (ctx) => `${vehicleLabel(ctx)} 部品交換トルク値一覧`,
    section: '整備手順 / 締付トルク',
    contentType: 'repair',
    relevanceScore: 0.93,
    body: 'O2センサー: 55Nm、排気マニホールド: 25Nm、触媒: 40Nm。作業前に必ず最新の整備情報を確認してください。',
  },
  'manual-cal-1': {
    title: () => '校正マニュアル: O2センサー学習手順',
    section: '電子制御 / センサー学習',
    contentType: 'calibration',
    relevanceScore: 0.96,
    body: 'スキャンツールで学習値リセット→アイドル10分→試運転で学習完了を確認します。',
  },
  'manual-inspect-1': {
    title: () => '検査マニュアル: 完了検査チェックリスト',
    section: '完了検査 / 検査項目',
    contentType: 'inspection',
    relevanceScore: 0.94,
    body: 'DTC再発確認、O2センサー出力確認、試運転、作業記録の4項目を必ず実施してください。',
  },
  'manual-report-1': {
    title: () => '顧客説明マニュアル: 説明テンプレート集',
    section: '顧客対応 / 説明資料',
    contentType: 'report',
    relevanceScore: 0.92,
    body: '交換理由・作業内容・今後の注意点を写真付きで説明するテンプレート集です。',
  },
}

const tieTemplates: Record<string, Omit<TIE, 'id' | 'title' | 'url'> & { title: (ctx: SessionContext) => string }> = {
  'tie-diag-1': {
    title: (ctx) => `${vehicleLabel(ctx)} ${dtcLabel(ctx)}診断事例`,
    symptom: '触媒効率警告灯点灯、診断で原因特定',
    solution: 'O2センサー波形測定で異常を確認、センサー不良と判断',
    relevanceScore: 0.9,
  },
  'tie-repair-1': {
    title: (ctx) => `${vehicleLabel(ctx)} O2センサー交換事例`,
    symptom: 'O2センサー不良による触媒効率低下',
    solution: 'O2センサーを交換、正常に復旧',
    relevanceScore: 0.91,
  },
  'tie-cal-1': {
    title: (ctx) => `${vehicleLabel(ctx)} O2センサー学習事例`,
    symptom: 'センサー交換後も警告灯が消えない',
    solution: '学習を実施して正常化',
    relevanceScore: 0.87,
  },
  'tie-inspect-1': {
    title: (ctx) => `${vehicleLabel(ctx)} 作業後検査事例`,
    symptom: '検査漏れによる再入庫',
    solution: '完了検査を徹底することで再発防止',
    relevanceScore: 0.83,
  },
  'tie-report-1': {
    title: () => '顧客説明の好事例',
    symptom: '顧客満足度向上の取り組み',
    solution: '写真付き説明資料で理解度向上',
    relevanceScore: 0.8,
  },
}

const qaTemplates: Record<string, Omit<QAQuestion, 'id' | 'title' | 'url'> & { title: (ctx: SessionContext) => string }> = {
  'qa-diag-1': {
    title: (ctx) => `${dtcLabel(ctx)}の診断方法を教えてください`,
    bestAnswer: 'まずスキャンツールでフリーズフレームを確認し、O2センサーの電圧波形を測定します',
    relevanceScore: 0.88,
  },
  'qa-repair-1': {
    title: () => 'O2センサー交換時の注意点は？',
    bestAnswer: '締付トルクを厳守し、センサーネジ部にアンチシーズを塗布してください',
    relevanceScore: 0.89,
  },
  'qa-cal-1': {
    title: () => 'O2センサー学習の方法は？',
    bestAnswer: 'スキャンツールから学習値リセット後、アイドル10分で学習完了します',
    relevanceScore: 0.85,
  },
  'qa-inspect-1': {
    title: () => '完了検査で確認すべき項目は？',
    bestAnswer: 'DTC再発確認、センサー出力確認、試運転の3つは必須です',
    relevanceScore: 0.81,
  },
  'qa-report-1': {
    title: () => '顧客への説明で注意すべきことは？',
    bestAnswer: '専門用語を避け、写真を使って分かりやすく説明することが重要です',
    relevanceScore: 0.78,
  },
}

export function getWorkflowManual(id: string, ctx: SessionContext): ManualDetail | null {
  const template = manualTemplates[id]
  if (!template) return null
  return {
    id,
    title: template.title(ctx),
    section: template.section,
    contentType: template.contentType,
    relevanceScore: template.relevanceScore,
    url: `/manuals/${id}`,
    body: template.body,
  }
}

export function getWorkflowTie(id: string, ctx: SessionContext): TIE | null {
  const template = tieTemplates[id]
  if (!template) return null
  return {
    id,
    title: template.title(ctx),
    symptom: template.symptom,
    solution: template.solution,
    relevanceScore: template.relevanceScore,
    url: `/ties/${id}`,
  }
}

export function getWorkflowQA(id: string, ctx: SessionContext): QAQuestion | null {
  const template = qaTemplates[id]
  if (!template) return null
  return {
    id,
    title: template.title(ctx),
    bestAnswer: template.bestAnswer,
    relevanceScore: template.relevanceScore,
    url: `/qa-questions/${id}`,
  }
}

export function getSessionContextFromStorage(): SessionContext {
  if (typeof window === 'undefined') {
    return { vehicleModel: 'Model A', modelYear: 2024, dtc: 'P0420' }
  }
  const savedSession = sessionStorage.getItem('currentWorkSession')
  if (!savedSession) {
    return { vehicleModel: 'Model A', modelYear: 2024, dtc: 'P0420' }
  }
  try {
    const session = JSON.parse(savedSession)
    return {
      vehicleModel: session.vehicleModel || 'Model A',
      modelYear: session.modelYear || 2024,
      dtc: session.dtc?.[0] || 'P0420',
    }
  } catch {
    return { vehicleModel: 'Model A', modelYear: 2024, dtc: 'P0420' }
  }
}
