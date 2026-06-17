'use client'

import { use, useEffect, useState } from 'react'
import { mockWorkSessions, WorkSession } from '@/app/lib/mock-data'
import { PHASE_LABELS, WORKFLOW_PHASES, getCurrentWorkflowPhaseId } from '@/app/lib/utils'
import WorkSessionHeader from './components/WorkSessionHeader'
import AIAssistant from './components/AIAssistant'
import ManualList from './components/ManualList'
import TIEList from './components/TIEList'
import QAList from './components/QAList'
import WarningList from './components/WarningList'
import ActionBar from './components/ActionBar'

export default function WorkSessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [session, setSession] = useState<WorkSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // sessionStorageから現在の作業セッション情報を取得
    const savedSession = sessionStorage.getItem('currentWorkSession')
    
    if (savedSession) {
      try {
        const parsedSession = JSON.parse(savedSession)
        // startedAtをDateオブジェクトに変換
        parsedSession.startedAt = new Date(parsedSession.startedAt)
        parsedSession.completedAt = parsedSession.completedAt ? new Date(parsedSession.completedAt) : null
        setSession(parsedSession)
      } catch (error) {
        console.error('Failed to parse session data:', error)
        // エラー時はモックデータを使用
        const mockSession = mockWorkSessions.find((s) => s.id === id)
        setSession(mockSession || null)
      }
    } else {
      // sessionStorageにデータがない場合はモックデータを使用
      const mockSession = mockWorkSessions.find((s) => s.id === id)
      setSession(mockSession || null)
    }
    
    setIsLoading(false)
  }, [id])

  // セッション情報に基づいて動的に推薦情報を生成
  const getDynamicRecommendations = () => {
    if (!session) return null

    const dtcText = session.dtc.length > 0 ? session.dtc[0] : 'P0420'
    const vehicleInfo = `${session.vehicleModel} ${session.modelYear}年`
    const currentWorkflowPhaseId = session.currentWorkflowPhaseId ?? getCurrentWorkflowPhaseId(session.currentPhase)

    // 工程に応じた情報を返す
    switch (currentWorkflowPhaseId) {
      case 'diagnosis':
        // ③診断：診断手順に関する情報のみ
        return {
          aiSummary: `このDTC ${dtcText} は、触媒効率低下を示しています。診断手順：1. スキャンツールでフリーズフレームデータを確認、2. O2センサーの波形を測定、3. 触媒前後のO2センサー出力を比較`,
          manuals: [
            {
              id: 'manual-diag-1',
              title: `診断マニュアル: ${dtcText} - 診断フローチャート`,
              section: '故障診断 / DTC診断手順',
              url: '/manuals/manual-diag-1',
              pdfUrl: '#',
              relevanceScore: 0.98,
            },
            {
              id: 'manual-diag-2',
              title: `${vehicleInfo} O2センサー診断手順`,
              section: '故障診断 / センサー診断',
              url: '/manuals/manual-diag-2',
              pdfUrl: '#',
              relevanceScore: 0.92,
            },
          ],
          ties: [
            {
              id: 'tie-diag-1',
              title: `${vehicleInfo} ${dtcText}診断事例`,
              symptom: '触媒効率警告灯点灯、診断で原因特定',
              solution: 'O2センサー波形測定で異常を確認、センサー不良と判断',
              url: '/ties/tie-diag-1',
              relevanceScore: 0.90,
            },
          ],
          qaQuestions: [
            {
              id: 'qa-diag-1',
              title: `${dtcText}の診断方法を教えてください`,
              bestAnswer: 'まずスキャンツールでフリーズフレームを確認し、O2センサーの電圧波形を測定します',
              url: '/qa-questions/qa-diag-1',
              relevanceScore: 0.88,
            },
          ],
          warnings: [
            {
              id: 'warning-diag-1',
              message: '⚠️ 診断前に必ずイグニッションOFFを確認してください',
              severity: 'high' as const,
            },
            {
              id: 'warning-diag-2',
              message: '⚠️ スキャンツール接続時はバッテリー電圧を確認してください',
              severity: 'medium' as const,
            },
          ],
        }

      case 'repair':
        // ④修理・交換・調整：修理手順に関する情報のみ
        return {
          aiSummary: `${dtcText} の修理手順：1. O2センサーを取り外す（締付トルク：55Nm）、2. 新品センサーを取り付け、3. コネクタを確実に接続、4. DTCをクリア`,
          manuals: [
            {
              id: 'manual-repair-1',
              title: `整備マニュアル: O2センサー交換手順`,
              section: '整備手順 / センサー交換',
              url: '/manuals/manual-repair-1',
              pdfUrl: '#',
              relevanceScore: 0.97,
            },
            {
              id: 'manual-repair-2',
              title: `${vehicleInfo} 部品交換トルク値一覧`,
              section: '整備手順 / 締付トルク',
              url: '/manuals/manual-repair-2',
              pdfUrl: '#',
              relevanceScore: 0.93,
            },
          ],
          ties: [
            {
              id: 'tie-repair-1',
              title: `${vehicleInfo} O2センサー交換事例`,
              symptom: 'O2センサー不良による触媒効率低下',
              solution: 'O2センサーを交換、正常に復旧',
              url: '/ties/tie-repair-1',
              relevanceScore: 0.91,
            },
          ],
          qaQuestions: [
            {
              id: 'qa-repair-1',
              title: 'O2センサー交換時の注意点は？',
              bestAnswer: '締付トルクを厳守し、センサーネジ部にアンチシーズを塗布してください',
              url: '/qa-questions/qa-repair-1',
              relevanceScore: 0.89,
            },
          ],
          warnings: [
            {
              id: 'warning-repair-1',
              message: '⚠️ O2センサー交換時はトルク値 55Nmを厳守してください',
              severity: 'high' as const,
            },
            {
              id: 'warning-repair-2',
              message: '⚠️ エキゾーストパイプが熱い場合は冷却してから作業してください',
              severity: 'high' as const,
            },
            {
              id: 'warning-repair-3',
              message: '💡 センサーネジ部にアンチシーズを塗布すると次回の脱着が容易になります',
              severity: 'medium' as const,
            },
          ],
        }

      case 'calibration':
        // ⑤電子制御・校正：校正手順に関する情報のみ
        return {
          aiSummary: `O2センサー交換後の校正手順：1. スキャンツールでO2センサー学習値をリセット、2. アイドル状態で学習を実施、3. 試運転で学習完了を確認`,
          manuals: [
            {
              id: 'manual-cal-1',
              title: `校正マニュアル: O2センサー学習手順`,
              section: '電子制御 / センサー学習',
              url: '/manuals/manual-cal-1',
              pdfUrl: '#',
              relevanceScore: 0.96,
            },
          ],
          ties: [
            {
              id: 'tie-cal-1',
              title: `${vehicleInfo} O2センサー学習事例`,
              symptom: 'センサー交換後も警告灯が消えない',
              solution: '学習を実施して正常化',
              url: '/ties/tie-cal-1',
              relevanceScore: 0.87,
            },
          ],
          qaQuestions: [
            {
              id: 'qa-cal-1',
              title: 'O2センサー学習の方法は？',
              bestAnswer: 'スキャンツールから学習値リセット後、アイドル10分で学習完了します',
              url: '/qa-questions/qa-cal-1',
              relevanceScore: 0.85,
            },
          ],
          warnings: [
            {
              id: 'warning-cal-1',
              message: '⚠️ 学習中はエンジンを停止しないでください',
              severity: 'high' as const,
            },
          ],
        }

      case 'final-inspection':
        // ⑥完了検査：検査手順に関する情報のみ
        return {
          aiSummary: `作業完了後の検査項目：1. DTCが再発していないか確認、2. O2センサー出力が正常範囲内か確認、3. 試運転で異常がないか確認`,
          manuals: [
            {
              id: 'manual-inspect-1',
              title: `検査マニュアル: 完了検査チェックリスト`,
              section: '完了検査 / 検査項目',
              url: '/manuals/manual-inspect-1',
              pdfUrl: '#',
              relevanceScore: 0.94,
            },
          ],
          ties: [
            {
              id: 'tie-inspect-1',
              title: `${vehicleInfo} 作業後検査事例`,
              symptom: '検査漏れによる再入庫',
              solution: '完了検査を徹底することで再発防止',
              url: '/ties/tie-inspect-1',
              relevanceScore: 0.83,
            },
          ],
          qaQuestions: [
            {
              id: 'qa-inspect-1',
              title: '完了検査で確認すべき項目は？',
              bestAnswer: 'DTC再発確認、センサー出力確認、試運転の3つは必須です',
              url: '/qa-questions/qa-inspect-1',
              relevanceScore: 0.81,
            },
          ],
          warnings: [
            {
              id: 'warning-inspect-1',
              message: '⚠️ 試運転は暖機後に実施してください',
              severity: 'medium' as const,
            },
          ],
        }

      case 'customer-report':
        // ⑦顧客説明・記録：説明・記録に関する情報のみ
        return {
          aiSummary: `顧客説明のポイント：1. どの部品を交換したか、2. なぜ交換が必要だったか、3. 今後の注意点（定期点検の重要性など）`,
          manuals: [
            {
              id: 'manual-report-1',
              title: `顧客説明マニュアル: 説明テンプレート集`,
              section: '顧客対応 / 説明資料',
              url: '/manuals/manual-report-1',
              pdfUrl: '#',
              relevanceScore: 0.92,
            },
          ],
          ties: [
            {
              id: 'tie-report-1',
              title: `顧客説明の好事例`,
              symptom: '顧客満足度向上の取り組み',
              solution: '写真付き説明資料で理解度向上',
              url: '/ties/tie-report-1',
              relevanceScore: 0.80,
            },
          ],
          qaQuestions: [
            {
              id: 'qa-report-1',
              title: '顧客への説明で注意すべきことは？',
              bestAnswer: '専門用語を避け、写真を使って分かりやすく説明することが重要です',
              url: '/qa-questions/qa-report-1',
              relevanceScore: 0.78,
            },
          ],
          warnings: [
            {
              id: 'warning-report-1',
              message: '💡 作業前後の写真を撮影しておくと説明がスムーズです',
              severity: 'medium' as const,
            },
          ],
        }

      default:
        // デフォルト（診断）
        return {
          aiSummary: `このDTC ${dtcText} は、触媒効率低下を示しています。診断手順を確認してください。`,
          manuals: [],
          ties: [],
          qaQuestions: [],
          warnings: [],
        }
    }
  }

  const recommendations = getDynamicRecommendations()

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="card p-6 text-center">
          <p className="text-gray-500">読み込み中...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="card p-6 text-center">
          <p className="text-gray-500">作業セッションが見つかりません</p>
        </div>
      </div>
    )
  }

  if (!recommendations) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="card p-6 text-center">
          <p className="text-gray-500">推薦情報を取得中...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <WorkSessionHeader session={session} />
      
      <div className="container mx-auto px-4 py-8 pb-24 max-w-6xl">
        {/* 作業フロー全体の可視化（横スクロール形式） */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold flex items-center gap-2">
              <span>📊</span>
              <span>整備作業フロー</span>
            </h2>
            <span className="text-xs text-gray-500">
              現在: {PHASE_LABELS[session.currentPhase]}
            </span>
          </div>
          
          {/* 横スクロールタイムライン */}
          <div className="overflow-x-auto pb-2">
            <div className="flex gap-2 min-w-max">
              {WORKFLOW_PHASES.map((phase, index) => {
                // sessionStorageのcurrentWorkflowPhaseIdを使用、なければデフォルトで取得
                const currentPhaseId = session.currentWorkflowPhaseId ?? getCurrentWorkflowPhaseId(session.currentPhase)
                const isCurrent = phase.id === currentPhaseId
                const isCompleted = index < 2
                
                return (
                  <div key={phase.id} className="flex items-center">
                    {/* フェーズカード */}
                    <div 
                      className={`
                        rounded-lg p-3 transition-all w-36 flex-shrink-0
                        ${isCurrent ? 'bg-blue-50 border-2 border-blue-500 shadow-md' : 'bg-gray-50 border border-gray-200'}
                        ${isCompleted ? 'opacity-70' : ''}
                      `}
                    >
                      <div className="text-center">
                        <div className={`text-2xl mb-1 ${isCurrent ? 'scale-110' : ''}`}>
                          {phase.icon}
                        </div>
                        <div className="text-xs font-bold mb-1 text-gray-900">
                          {phase.label}
                        </div>
                        {isCompleted && (
                          <div className="text-xs text-green-600">✓ 完了</div>
                        )}
                        {isCurrent && (
                          <div className="text-xs text-blue-600 font-semibold animate-pulse">
                            ● 実施中
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* 矢印（最後以外） */}
                    {index < WORKFLOW_PHASES.length - 1 && (
                      <div className="flex-shrink-0 px-2 text-gray-400">
                        →
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
          
          {/* 現在のフェーズの詳細情報 */}
          {(() => {
            const currentPhaseId = session.currentWorkflowPhaseId ?? getCurrentWorkflowPhaseId(session.currentPhase)
            const currentPhase = WORKFLOW_PHASES.find(p => p.id === currentPhaseId)
            
            return currentPhase ? (
              <div className="mt-3 pt-3 border-t border-gray-200 bg-blue-50 rounded p-3">
                <div className="grid md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <div className="font-semibold text-blue-900 mb-1.5">
                      📌 必要な情報
                    </div>
                    <div className="text-gray-700">
                      {currentPhase.requiredInfo.join('、')}
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold text-blue-900 mb-1.5">
                      📚 情報ソース
                    </div>
                    <div className="text-gray-700">
                      {currentPhase.infoSources.join('、')}
                    </div>
                  </div>
                </div>
              </div>
            ) : null
          })()}
        </div>

        {/* AIアシスト要約 */}
        <AIAssistant summary={recommendations.aiSummary} session={session} />

        {/* 公式マニュアル */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-2">メーカー公式の診断手順</h2>
          <p className="text-sm text-gray-600 mb-4">
            DTCの診断フローチャートを確認できます
          </p>
          <ManualList manuals={recommendations.manuals} />
        </section>

        {/* 類似TIE事例 */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-2">同じ症状の修理事例（TIE）</h2>
          <p className="text-sm text-gray-600 mb-4">
            過去に他の整備士が対応した類似症状の事例です
          </p>
          <TIEList ties={recommendations.ties} />
        </section>

        {/* 問題交流 */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-2">現場の整備士Q&A</h2>
          <p className="text-sm text-gray-600 mb-4">
            同じ症状について、他の整備士が質問・回答した内容です
          </p>
          <QAList questions={recommendations.qaQuestions} />
        </section>

        {/* 注意事項 */}
        {recommendations.warnings.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-2">⚠️ 作業上の注意事項</h2>
            <p className="text-sm text-gray-600 mb-4">
              {session.dtc.length > 0 
                ? `DTC ${session.dtc.join(', ')} の作業では以下に注意してください`
                : '以下の点に注意してください'
              }
            </p>
            <WarningList warnings={recommendations.warnings} />
          </section>
        )}
      </div>

      <ActionBar sessionId={session.id} currentPhase={session.currentPhase} />
    </div>
  )
}
