export interface WorkSession {
  id: string
  vehicleModel: string
  modelYear: number
  vin: string | null
  symptom: string | null
  dtc: string[]
  currentPhase: 'intake' | 'diagnosis' | 'planning' | 'execution' | 'verification' | 'delivery'
  status: 'in_progress' | 'paused' | 'completed'
  startedAt: Date
  completedAt: Date | null
}

export interface Recommendation {
  aiSummary: string
  manuals: Manual[]
  ties: TIE[]
  qaQuestions: QAQuestion[]
  warnings: Warning[]
}

export interface Manual {
  id: string
  title: string
  section: string
  url: string
  pdfUrl?: string
  relevanceScore: number
}

export interface TIE {
  id: string
  title: string
  symptom: string
  solution: string
  url: string
  relevanceScore: number
}

export interface QAQuestion {
  id: string
  title: string
  bestAnswer: string
  url: string
  relevanceScore: number
}

export interface Warning {
  id: string
  message: string
  severity: 'high' | 'medium' | 'low'
}

export const mockWorkSessions: WorkSession[] = [
  {
    id: '1',
    vehicleModel: 'Model A',
    modelYear: 2024,
    vin: 'JN1XXXXXXXXXXXXX',
    symptom: 'エンジンチェックランプ点灯',
    dtc: ['P0420', 'P0300'],
    currentPhase: 'diagnosis',
    status: 'in_progress',
    startedAt: new Date(Date.now() - 932000), // 15分32秒前
    completedAt: null,
  },
]

export const mockRecommendations: Record<string, Recommendation> = {
  '1': {
    aiSummary: 'このDTC P0420 は、触媒効率低下を示しています。まず以下を確認してください: 1. O2センサーの配線接続、2. センサーの動作確認、3. ECUとの通信状態',
    manuals: [
      {
        id: 'manual-123',
        title: 'サービスマニュアル: P0420 - 触媒効率低下',
        section: 'エンジン / 排気系統',
        url: '/manuals/manual-123',
        pdfUrl: '#',
        relevanceScore: 0.95,
      },
    ],
    ties: [
      {
        id: 'tie-456',
        title: 'Model A 2024年 P0420対応事例',
        symptom: '触媒効率警告灯点灯',
        solution: 'O2センサー交換で解決',
        url: '/ties/tie-456',
        relevanceScore: 0.88,
      },
    ],
    qaQuestions: [
      {
        id: 'qa-789',
        title: 'P0420のよくある原因は？',
        bestAnswer: 'O2センサーの劣化が最も多い原因です',
        url: '/qa-questions/qa-789',
        relevanceScore: 0.82,
      },
    ],
    warnings: [
      {
        id: 'warning-101',
        message: '⚠️ 作業前に必ずイグニッションOFFを確認してください',
        severity: 'high',
      },
      {
        id: 'warning-102',
        message: '⚠️ O2センサー交換時はトルク値 55Nmを厳守してください',
        severity: 'high',
      },
    ],
  },
}
