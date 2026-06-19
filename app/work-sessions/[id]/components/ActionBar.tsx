'use client'

import { useRouter } from 'next/navigation'
import { 
  Phase, 
  getCurrentWorkflowPhaseId, 
  getPhaseFromWorkflowPhaseId 
} from '@/app/lib/utils'
import { useLanguage } from '@/app/lib/i18n/LanguageProvider'
import { getNextWorkflowPhaseLocalized, getPreviousWorkflowPhaseLocalized } from '@/app/lib/i18n/translations'

interface ActionBarProps {
  sessionId: string
  currentPhase: Phase
}

export default function ActionBar({ sessionId, currentPhase }: ActionBarProps) {
  const router = useRouter()
  const { t, locale } = useLanguage()

  const getStoredWorkflowPhaseId = () => {
    let workflowPhaseId = getCurrentWorkflowPhaseId(currentPhase)
    if (typeof window !== 'undefined') {
      const savedSession = sessionStorage.getItem('currentWorkSession')
      if (savedSession) {
        try {
          const session = JSON.parse(savedSession)
          if (session.currentWorkflowPhaseId) {
            workflowPhaseId = session.currentWorkflowPhaseId
          }
        } catch (error) {
          console.error('Failed to parse session:', error)
        }
      }
    }
    return workflowPhaseId
  }

  const getNextPhaseInfo = () => {
    const currentWorkflowPhaseId = getStoredWorkflowPhaseId()
    const nextWorkflowPhase = getNextWorkflowPhaseLocalized(currentWorkflowPhaseId, locale)
    
    if (nextWorkflowPhase) {
      return {
        label: t('workSession.nextPhase', { label: nextWorkflowPhase.label }),
        nextWorkflowPhase,
        isComplete: false
      }
    }
    return {
      label: t('workSession.completeWork'),
      nextWorkflowPhase: null,
      isComplete: true
    }
  }

  const getPreviousPhaseInfo = () => {
    const currentWorkflowPhaseId = getStoredWorkflowPhaseId()
    const previousWorkflowPhase = getPreviousWorkflowPhaseLocalized(currentWorkflowPhaseId, locale)
    
    if (previousWorkflowPhase) {
      return {
        label: t('workSession.prevPhase', { label: previousWorkflowPhase.label }),
        previousWorkflowPhase,
        canGoBack: true
      }
    }
    return {
      label: '',
      previousWorkflowPhase: null,
      canGoBack: false
    }
  }

  const handleNextPhase = () => {
    const nextPhaseInfo = getNextPhaseInfo()
    if (nextPhaseInfo.isComplete) {
      handleComplete()
    } else if (nextPhaseInfo.nextWorkflowPhase) {
      const savedSession = sessionStorage.getItem('currentWorkSession')
      if (savedSession) {
        try {
          const session = JSON.parse(savedSession)
          const newPhase = getPhaseFromWorkflowPhaseId(nextPhaseInfo.nextWorkflowPhase.id)
          session.currentPhase = newPhase
          session.currentWorkflowPhaseId = nextPhaseInfo.nextWorkflowPhase.id
          sessionStorage.setItem('currentWorkSession', JSON.stringify(session))
          window.location.reload()
        } catch (error) {
          console.error('Failed to update session:', error)
          alert(t('workSession.phaseUpdateFailed'))
        }
      }
    }
  }

  const handlePreviousPhase = () => {
    const previousPhaseInfo = getPreviousPhaseInfo()
    if (previousPhaseInfo.canGoBack && previousPhaseInfo.previousWorkflowPhase) {
      const savedSession = sessionStorage.getItem('currentWorkSession')
      if (savedSession) {
        try {
          const session = JSON.parse(savedSession)
          const newPhase = getPhaseFromWorkflowPhaseId(previousPhaseInfo.previousWorkflowPhase.id)
          session.currentPhase = newPhase
          session.currentWorkflowPhaseId = previousPhaseInfo.previousWorkflowPhase.id
          sessionStorage.setItem('currentWorkSession', JSON.stringify(session))
          window.location.reload()
        } catch (error) {
          console.error('Failed to update session:', error)
          alert(t('workSession.phaseUpdateFailed'))
        }
      }
    }
  }

  const handleSearch = () => {
    router.push(`/search?sessionId=${sessionId}`)
  }

  const handlePostQuestion = () => {
    router.push(`/qa-questions/new?sessionId=${sessionId}`)
  }

  const handleComplete = () => {
    if (confirm(t('workSession.confirmComplete'))) {
      router.push('/')
    }
  }

  const nextPhaseInfo = getNextPhaseInfo()
  const previousPhaseInfo = getPreviousPhaseInfo()

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-wrap justify-center gap-3">
          {previousPhaseInfo.canGoBack && (
            <button onClick={handlePreviousPhase} className="btn-secondary">
              ← {previousPhaseInfo.label}
            </button>
          )}
          <button onClick={handleNextPhase} className="btn-accent">
            {nextPhaseInfo.label} →
          </button>
          <button onClick={handleSearch} className="btn-secondary">
            {t('workSession.aiSearch')}
          </button>
          <button onClick={handlePostQuestion} className="btn-secondary">
            {t('workSession.postQuestion')}
          </button>
          {!nextPhaseInfo.isComplete && (
            <button
              onClick={handleComplete}
              className="btn-secondary text-success border-success hover:bg-green-50"
            >
              {t('workSession.finishWork')}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
