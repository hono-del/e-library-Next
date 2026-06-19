import { Manual, QAQuestion, TIE } from '@/app/lib/mock-data'
import { Locale } from '@/app/lib/i18n/types'

export interface ManualDetail extends Manual {
  contentType: 'diagnosis' | 'repair' | 'calibration' | 'inspection' | 'report'
  body: string
}

export interface SessionContext {
  vehicleModel: string
  modelYear: number | string
  dtc?: string
}

function vehicleLabel(ctx: SessionContext, locale: Locale = 'ja') {
  const yearSuffix = locale === 'ja' ? '年' : ''
  return `${ctx.vehicleModel} ${ctx.modelYear}${yearSuffix}`
}

function dtcLabel(ctx: SessionContext) {
  return ctx.dtc || 'P0420'
}

type ManualTemplate = Omit<ManualDetail, 'id' | 'title' | 'url'> & {
  title: (ctx: SessionContext, locale: Locale) => string
}
type TieTemplate = Omit<TIE, 'id' | 'title' | 'url'> & {
  title: (ctx: SessionContext, locale: Locale) => string
}
type QATemplate = Omit<QAQuestion, 'id' | 'title' | 'url'> & {
  title: (ctx: SessionContext, locale: Locale) => string
}

const manualTemplates: Record<Locale, Record<string, ManualTemplate>> = {
  ja: {
    'manual-diag-1': {
      title: (ctx) => `診断マニュアル: ${dtcLabel(ctx)} - 診断フローチャート`,
      section: '故障診断 / DTC診断手順',
      contentType: 'diagnosis',
      relevanceScore: 0.98,
      body: 'DTC診断の基本フロー。スキャンツール接続→フリーズフレーム確認→O2センサー波形測定→触媒前後出力比較の順で実施します。',
    },
    'manual-diag-2': {
      title: (ctx, locale) => `${vehicleLabel(ctx, locale)} O2センサー診断手順`,
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
      title: (ctx, locale) => `${vehicleLabel(ctx, locale)} 部品交換トルク値一覧`,
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
  },
  en: {
    'manual-diag-1': {
      title: (ctx) => `Diagnostic Manual: ${dtcLabel(ctx)} - Diagnostic Flowchart`,
      section: 'Fault Diagnosis / DTC Procedures',
      contentType: 'diagnosis',
      relevanceScore: 0.98,
      body: 'Basic DTC diagnosis flow: connect scan tool → check freeze frame → measure O2 sensor waveform → compare pre/post catalyst output.',
    },
    'manual-diag-2': {
      title: (ctx, locale) => `${vehicleLabel(ctx, locale)} O2 Sensor Diagnostic Procedure`,
      section: 'Fault Diagnosis / Sensor Diagnosis',
      contentType: 'diagnosis',
      relevanceScore: 0.92,
      body: 'Visual inspection of wiring/connectors, resistance measurement (4-14Ω), voltage waveform check via data monitor.',
    },
    'manual-repair-1': {
      title: () => 'Service Manual: O2 Sensor Replacement',
      section: 'Service Procedure / Sensor Replacement',
      contentType: 'repair',
      relevanceScore: 0.97,
      body: 'O2 sensor removal/installation. Torque 55Nm, apply anti-seize, ensure connector is fully seated.',
    },
    'manual-repair-2': {
      title: (ctx, locale) => `${vehicleLabel(ctx, locale)} Torque Specifications`,
      section: 'Service Procedure / Torque Values',
      contentType: 'repair',
      relevanceScore: 0.93,
      body: 'O2 sensor: 55Nm, exhaust manifold: 25Nm, catalyst: 40Nm. Always verify latest service information before work.',
    },
    'manual-cal-1': {
      title: () => 'Calibration Manual: O2 Sensor Learning',
      section: 'Electronic Control / Sensor Learning',
      contentType: 'calibration',
      relevanceScore: 0.96,
      body: 'Reset learning values via scan tool → idle 10 min → confirm completion with test drive.',
    },
    'manual-inspect-1': {
      title: () => 'Inspection Manual: Final Inspection Checklist',
      section: 'Final Inspection / Check Items',
      contentType: 'inspection',
      relevanceScore: 0.94,
      body: 'Required: DTC re-check, O2 sensor output verification, test drive, work record.',
    },
    'manual-report-1': {
      title: () => 'Customer Explanation Manual: Template Collection',
      section: 'Customer Service / Explanation Materials',
      contentType: 'report',
      relevanceScore: 0.92,
      body: 'Templates for explaining replacement reason, work performed, and future precautions with photos.',
    },
  },
}

const tieTemplates: Record<Locale, Record<string, TieTemplate>> = {
  ja: {
    'tie-diag-1': {
      title: (ctx, locale) => `${vehicleLabel(ctx, locale)} ${dtcLabel(ctx)}診断事例`,
      symptom: '触媒効率警告灯点灯、診断で原因特定',
      solution: 'O2センサー波形測定で異常を確認、センサー不良と判断',
      relevanceScore: 0.9,
    },
    'tie-repair-1': {
      title: (ctx, locale) => `${vehicleLabel(ctx, locale)} O2センサー交換事例`,
      symptom: 'O2センサー不良による触媒効率低下',
      solution: 'O2センサーを交換、正常に復旧',
      relevanceScore: 0.91,
    },
    'tie-cal-1': {
      title: (ctx, locale) => `${vehicleLabel(ctx, locale)} O2センサー学習事例`,
      symptom: 'センサー交換後も警告灯が消えない',
      solution: '学習を実施して正常化',
      relevanceScore: 0.87,
    },
    'tie-inspect-1': {
      title: (ctx, locale) => `${vehicleLabel(ctx, locale)} 作業後検査事例`,
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
  },
  en: {
    'tie-diag-1': {
      title: (ctx, locale) => `${vehicleLabel(ctx, locale)} ${dtcLabel(ctx)} Diagnosis Case`,
      symptom: 'Catalyst efficiency warning lamp on, cause identified via diagnosis',
      solution: 'Abnormal O2 sensor waveform confirmed; sensor failure diagnosed',
      relevanceScore: 0.9,
    },
    'tie-repair-1': {
      title: (ctx, locale) => `${vehicleLabel(ctx, locale)} O2 Sensor Replacement Case`,
      symptom: 'Catalyst efficiency drop due to faulty O2 sensor',
      solution: 'Replaced O2 sensor; restored to normal',
      relevanceScore: 0.91,
    },
    'tie-cal-1': {
      title: (ctx, locale) => `${vehicleLabel(ctx, locale)} O2 Sensor Learning Case`,
      symptom: 'Warning lamp remains on after sensor replacement',
      solution: 'Performed learning procedure; normalized',
      relevanceScore: 0.87,
    },
    'tie-inspect-1': {
      title: (ctx, locale) => `${vehicleLabel(ctx, locale)} Post-Work Inspection Case`,
      symptom: 'Re-entry due to missed inspection',
      solution: 'Prevent recurrence with thorough final inspection',
      relevanceScore: 0.83,
    },
    'tie-report-1': {
      title: () => 'Best Practice: Customer Explanation',
      symptom: 'Initiative to improve customer satisfaction',
      solution: 'Photo-based explanation materials improved understanding',
      relevanceScore: 0.8,
    },
  },
}

const qaTemplates: Record<Locale, Record<string, QATemplate>> = {
  ja: {
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
  },
  en: {
    'qa-diag-1': {
      title: (ctx) => `How do I diagnose ${dtcLabel(ctx)}?`,
      bestAnswer: 'First check freeze frame with scan tool, then measure O2 sensor voltage waveform',
      relevanceScore: 0.88,
    },
    'qa-repair-1': {
      title: () => 'What to watch when replacing O2 sensor?',
      bestAnswer: 'Follow torque spec and apply anti-seize to sensor threads',
      relevanceScore: 0.89,
    },
    'qa-cal-1': {
      title: () => 'How to perform O2 sensor learning?',
      bestAnswer: 'Reset learning values via scan tool, then idle 10 minutes to complete learning',
      relevanceScore: 0.85,
    },
    'qa-inspect-1': {
      title: () => 'What to check in final inspection?',
      bestAnswer: 'DTC re-check, sensor output verification, and test drive are mandatory',
      relevanceScore: 0.81,
    },
    'qa-report-1': {
      title: () => 'Tips for explaining work to customers?',
      bestAnswer: 'Avoid jargon and use photos for clear explanation',
      relevanceScore: 0.78,
    },
  },
}

export function getWorkflowManual(id: string, ctx: SessionContext, locale: Locale = 'ja'): ManualDetail | null {
  const template = manualTemplates[locale][id]
  if (!template) return null
  return {
    id,
    title: template.title(ctx, locale),
    section: template.section,
    contentType: template.contentType,
    relevanceScore: template.relevanceScore,
    url: `/manuals/${id}`,
    body: template.body,
  }
}

export function getWorkflowTie(id: string, ctx: SessionContext, locale: Locale = 'ja'): TIE | null {
  const template = tieTemplates[locale][id]
  if (!template) return null
  return {
    id,
    title: template.title(ctx, locale),
    symptom: template.symptom,
    solution: template.solution,
    relevanceScore: template.relevanceScore,
    url: `/ties/${id}`,
  }
}

export function getWorkflowQA(id: string, ctx: SessionContext, locale: Locale = 'ja'): QAQuestion | null {
  const template = qaTemplates[locale][id]
  if (!template) return null
  return {
    id,
    title: template.title(ctx, locale),
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
