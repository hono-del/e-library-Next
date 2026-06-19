'use client'

import { use, useEffect, useState } from 'react'
import { mockWorkSessions, WorkSession } from '@/app/lib/mock-data'
import { getCurrentWorkflowPhaseId } from '@/app/lib/utils'
import { useLanguage } from '@/app/lib/i18n/LanguageProvider'
import { getWorkflowPhases } from '@/app/lib/i18n/translations'
import { getDynamicRecommendations } from '@/app/lib/workflow-recommendations'
import WorkSessionHeader from './components/WorkSessionHeader'
import AIAssistant from './components/AIAssistant'
import ManualList from './components/ManualList'
import TIEList from './components/TIEList'
import QAList from './components/QAList'
import WarningList from './components/WarningList'
import ActionBar from './components/ActionBar'

export default function WorkSessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { t, locale } = useLanguage()
  const [session, setSession] = useState<WorkSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const workflowPhases = getWorkflowPhases(locale)

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

  const recommendations = session ? getDynamicRecommendations(session, locale) : null

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="card p-6 text-center">
          <p className="text-gray-500">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="card p-6 text-center">
          <p className="text-gray-500">{t('workSession.notFound')}</p>
        </div>
      </div>
    )
  }

  if (!recommendations) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="card p-6 text-center">
          <p className="text-gray-500">{t('workSession.loadingRecs')}</p>
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
              <span>{t('workSession.workflowTitle')}</span>
            </h2>
            <span className="text-xs text-gray-500">
              {t('workSession.current')}: {t(`phase.${session.currentPhase}`)}
            </span>
          </div>
          
          <div className="overflow-x-auto pb-2">
            <div className="flex gap-2 min-w-max">
              {workflowPhases.map((phase, index) => {
                const currentPhaseId = session.currentWorkflowPhaseId ?? getCurrentWorkflowPhaseId(session.currentPhase)
                const isCurrent = phase.id === currentPhaseId
                const isCompleted = index < 2
                
                return (
                  <div key={phase.id} className="flex items-center">
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
                          <div className="text-xs text-green-600">{t('workSession.completed')}</div>
                        )}
                        {isCurrent && (
                          <div className="text-xs text-blue-600 font-semibold animate-pulse">
                            {t('workSession.inProgress')}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {index < workflowPhases.length - 1 && (
                      <div className="flex-shrink-0 px-2 text-gray-400">→</div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
          
          {(() => {
            const currentPhaseId = session.currentWorkflowPhaseId ?? getCurrentWorkflowPhaseId(session.currentPhase)
            const currentPhase = workflowPhases.find(p => p.id === currentPhaseId)
            const separator = locale === 'ja' ? '、' : ', '
            
            return currentPhase ? (
              <div className="mt-3 pt-3 border-t border-gray-200 bg-blue-50 rounded p-3">
                <div className="grid md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <div className="font-semibold text-blue-900 mb-1.5">
                      {t('workSession.requiredInfo')}
                    </div>
                    <div className="text-gray-700">
                      {currentPhase.requiredInfo.join(separator)}
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold text-blue-900 mb-1.5">
                      {t('workSession.infoSources')}
                    </div>
                    <div className="text-gray-700">
                      {currentPhase.infoSources.join(separator)}
                    </div>
                  </div>
                </div>
              </div>
            ) : null
          })()}
        </div>

        <AIAssistant summary={recommendations.aiSummary} session={session} />

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-2">{t('workSession.officialManuals')}</h2>
          <p className="text-sm text-gray-600 mb-4">{t('workSession.officialManualsDesc')}</p>
          <ManualList manuals={recommendations.manuals} />
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-2">{t('workSession.tieSection')}</h2>
          <p className="text-sm text-gray-600 mb-4">{t('workSession.tieSectionDesc')}</p>
          <TIEList ties={recommendations.ties} />
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-2">{t('workSession.qaSection')}</h2>
          <p className="text-sm text-gray-600 mb-4">{t('workSession.qaSectionDesc')}</p>
          <QAList questions={recommendations.qaQuestions} />
        </section>

        {recommendations.warnings.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-2">{t('workSession.warningsSection')}</h2>
            <p className="text-sm text-gray-600 mb-4">
              {session.dtc.length > 0 
                ? t('workSession.warningsSectionDtc', { dtc: session.dtc.join(', ') })
                : t('workSession.warningsSectionDefault')
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
