export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ')
}

export function formatElapsedTime(startedAt: Date): string {
  const now = new Date()
  const elapsed = Math.floor((now.getTime() - startedAt.getTime()) / 1000)
  
  const hours = Math.floor(elapsed / 3600)
  const minutes = Math.floor((elapsed % 3600) / 60)
  const seconds = elapsed % 60
  
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export const PHASE_LABELS = {
  intake: '受付',
  diagnosis: '診断',
  planning: '作業計画',
  execution: '作業実施',
  verification: '検証',
  delivery: '引き渡し',
} as const

export type Phase = keyof typeof PHASE_LABELS

// 整備作業の詳細フェーズ定義
export interface WorkflowPhase {
  id: string
  label: string
  description: string
  requiredInfo: string[]
  infoSources: string[]
  icon: string
}

export const WORKFLOW_PHASES: WorkflowPhase[] = [
  {
    id: 'intake-interview',
    label: '① 受付・問診',
    description: '顧客から症状や状況をヒアリング',
    requiredInfo: ['症状', '発生条件', '再現性', '過去履歴'],
    infoSources: ['QA集', '問診テンプレ', '過去事例'],
    icon: '📋'
  },
  {
    id: 'vehicle-identification',
    label: '② 車両特定',
    description: '車両の詳細情報を特定',
    requiredInfo: ['車種', '年式', '型式', 'グレード', '装備差'],
    infoSources: ['車両仕様', 'VIN情報', '部品情報'],
    icon: '🚗'
  },
  {
    id: 'diagnosis',
    label: '③ 診断',
    description: '原因を特定する',
    requiredInfo: ['DTC', '症状別フロー', '測定値', '原因候補'],
    infoSources: ['診断フロー', 'DTC表', '配線図', 'QA集'],
    icon: '🔬'
  },
  {
    id: 'repair',
    label: '④ 修理・交換・調整',
    description: '実際の修理作業を実施',
    requiredInfo: ['作業手順', '締付トルク', '脱着順', '工具'],
    infoSources: ['整備マニュアル', '部品表', 'SST情報'],
    icon: '🔧'
  },
  {
    id: 'calibration',
    label: '⑤ 電子制御・校正',
    description: '電子制御システムの調整',
    requiredInfo: ['ADAS調整', 'センサー校正', 'ECU設定'],
    infoSources: ['特定整備情報', 'スキャンツール手順'],
    icon: '💻'
  },
  {
    id: 'final-inspection',
    label: '⑥ 完了検査',
    description: '作業結果を確認',
    requiredInfo: ['作動確認', '試運転', '再診断', '記録'],
    infoSources: ['完了チェックリスト', '診断結果'],
    icon: '✅'
  },
  {
    id: 'customer-report',
    label: '⑦ 顧客説明・記録',
    description: '作業内容を顧客に説明',
    requiredInfo: ['何をしたか', 'なぜ必要だったか'],
    infoSources: ['作業報告書', '写真', '説明テンプレ'],
    icon: '📄'
  }
]

// 既存のPhaseから詳細フェーズへのマッピング
export function getWorkflowPhasesByCurrentPhase(phase: Phase): WorkflowPhase[] {
  switch (phase) {
    case 'intake':
      return WORKFLOW_PHASES.filter(p => ['intake-interview', 'vehicle-identification'].includes(p.id))
    case 'diagnosis':
      return WORKFLOW_PHASES.filter(p => p.id === 'diagnosis')
    case 'planning':
      return WORKFLOW_PHASES.filter(p => p.id === 'repair')
    case 'execution':
      return WORKFLOW_PHASES.filter(p => p.id === 'calibration')
    case 'verification':
      return WORKFLOW_PHASES.filter(p => p.id === 'final-inspection')
    case 'delivery':
      return WORKFLOW_PHASES.filter(p => p.id === 'customer-report')
    default:
      return []
  }
}

// 現在のフェーズIDを取得
export function getCurrentWorkflowPhaseId(phase: Phase): string {
  const phases = getWorkflowPhasesByCurrentPhase(phase)
  return phases.length > 0 ? phases[0].id : 'diagnosis'
}

// 次のワークフローフェーズを取得
export function getNextWorkflowPhase(currentPhaseId: string): WorkflowPhase | null {
  const currentIndex = WORKFLOW_PHASES.findIndex(p => p.id === currentPhaseId)
  if (currentIndex >= 0 && currentIndex < WORKFLOW_PHASES.length - 1) {
    return WORKFLOW_PHASES[currentIndex + 1]
  }
  return null
}

// ワークフローフェーズIDから対応するPhaseを取得
export function getPhaseFromWorkflowPhaseId(workflowPhaseId: string): Phase {
  const phase = WORKFLOW_PHASES.find(p => p.id === workflowPhaseId)
  if (!phase) return 'diagnosis'
  
  // マッピング
  if (['intake-interview', 'vehicle-identification'].includes(workflowPhaseId)) return 'intake'
  if (workflowPhaseId === 'diagnosis') return 'diagnosis'
  if (workflowPhaseId === 'repair') return 'planning'
  if (workflowPhaseId === 'calibration') return 'execution'
  if (workflowPhaseId === 'final-inspection') return 'verification'
  if (workflowPhaseId === 'customer-report') return 'delivery'
  
  return 'diagnosis'
}
