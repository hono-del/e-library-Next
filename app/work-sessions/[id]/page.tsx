'use client'

import { use, useEffect, useState } from 'react'
import { mockWorkSessions, mockRecommendations, WorkSession } from '@/app/lib/mock-data'
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

    return {
      aiSummary: `このDTC ${dtcText} は、触媒効率低下を示しています。まず以下を確認してください: 1. O2センサーの配線接続、2. センサーの動作確認、3. ECUとの通信状態`,
      manuals: [
        {
          id: 'manual-123',
          title: `サービスマニュアル: ${dtcText} - 触媒効率低下`,
          section: 'エンジン / 排気系統',
          url: '/manuals/manual-123',
          pdfUrl: '#',
          relevanceScore: 0.95,
        },
      ],
      ties: [
        {
          id: 'tie-456',
          title: `${vehicleInfo} ${dtcText}対応事例`,
          symptom: '触媒効率警告灯点灯',
          solution: 'O2センサー交換で解決',
          url: '/ties/tie-456',
          relevanceScore: 0.88,
        },
      ],
      qaQuestions: [
        {
          id: 'qa-789',
          title: `${dtcText}のよくある原因は？`,
          bestAnswer: 'O2センサーの劣化が最も多い原因です',
          url: '/qa-questions/qa-789',
          relevanceScore: 0.82,
        },
      ],
      warnings: [
        {
          id: 'warning-101',
          message: '⚠️ 作業前に必ずイグニッションOFFを確認してください',
          severity: 'high' as const,
        },
        {
          id: 'warning-102',
          message: '⚠️ O2センサー交換時はトルク値 55Nmを厳守してください',
          severity: 'high' as const,
        },
      ],
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
                const currentPhaseId = (session as any).currentWorkflowPhaseId || getCurrentWorkflowPhaseId(session.currentPhase)
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
            const currentPhaseId = (session as any).currentWorkflowPhaseId || getCurrentWorkflowPhaseId(session.currentPhase)
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
