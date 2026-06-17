'use client'

import { useRouter } from 'next/navigation'
import { 
  Phase, 
  getCurrentWorkflowPhaseId, 
  getNextWorkflowPhase,
  getPreviousWorkflowPhase,
  getPhaseFromWorkflowPhaseId 
} from '@/app/lib/utils'

interface ActionBarProps {
  sessionId: string
  currentPhase: Phase
}

export default function ActionBar({ sessionId, currentPhase }: ActionBarProps) {
  const router = useRouter()

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
    const nextWorkflowPhase = getNextWorkflowPhase(currentWorkflowPhaseId)
    
    if (nextWorkflowPhase) {
      return {
        label: `次の工程：${nextWorkflowPhase.label}`,
        nextWorkflowPhase,
        isComplete: false
      }
    }
    return {
      label: '作業完了',
      nextWorkflowPhase: null,
      isComplete: true
    }
  }

  const getPreviousPhaseInfo = () => {
    const currentWorkflowPhaseId = getStoredWorkflowPhaseId()
    const previousWorkflowPhase = getPreviousWorkflowPhase(currentWorkflowPhaseId)
    
    if (previousWorkflowPhase) {
      return {
        label: `前の工程：${previousWorkflowPhase.label}`,
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
      // sessionStorageの作業セッション情報を更新
      const savedSession = sessionStorage.getItem('currentWorkSession')
      if (savedSession) {
        try {
          const session = JSON.parse(savedSession)
          const newPhase = getPhaseFromWorkflowPhaseId(nextPhaseInfo.nextWorkflowPhase.id)
          session.currentPhase = newPhase
          session.currentWorkflowPhaseId = nextPhaseInfo.nextWorkflowPhase.id
          sessionStorage.setItem('currentWorkSession', JSON.stringify(session))
          
          // ページをリロードして新しいフェーズの情報を表示
          window.location.reload()
        } catch (error) {
          console.error('Failed to update session:', error)
          alert('工程の更新に失敗しました')
        }
      }
    }
  }

  const handlePreviousPhase = () => {
    const previousPhaseInfo = getPreviousPhaseInfo()
    if (previousPhaseInfo.canGoBack && previousPhaseInfo.previousWorkflowPhase) {
      // sessionStorageの作業セッション情報を更新
      const savedSession = sessionStorage.getItem('currentWorkSession')
      if (savedSession) {
        try {
          const session = JSON.parse(savedSession)
          const newPhase = getPhaseFromWorkflowPhaseId(previousPhaseInfo.previousWorkflowPhase.id)
          session.currentPhase = newPhase
          session.currentWorkflowPhaseId = previousPhaseInfo.previousWorkflowPhase.id
          sessionStorage.setItem('currentWorkSession', JSON.stringify(session))
          
          // ページをリロードして前のフェーズの情報を表示
          window.location.reload()
        } catch (error) {
          console.error('Failed to update session:', error)
          alert('工程の更新に失敗しました')
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
    // TODO: 作業完了APIを呼び出す
    if (confirm('作業を完了してもよろしいですか？')) {
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
            <button
              onClick={handlePreviousPhase}
              className="btn-secondary"
            >
              ← {previousPhaseInfo.label}
            </button>
          )}
          <button
            onClick={handleNextPhase}
            className="btn-accent"
          >
            {nextPhaseInfo.label} →
          </button>
          <button
            onClick={handleSearch}
            className="btn-secondary"
          >
            🔍 AIで情報を検索
          </button>
          <button
            onClick={handlePostQuestion}
            className="btn-secondary"
          >
            💬 現場に質問する
          </button>
          {!nextPhaseInfo.isComplete && (
            <button
              onClick={handleComplete}
              className="btn-secondary text-success border-success hover:bg-green-50"
            >
              作業を完了
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
