'use client'

import { useRouter } from 'next/navigation'
import { 
  Phase, 
  getCurrentWorkflowPhaseId, 
  getNextWorkflowPhase,
  getPhaseFromWorkflowPhaseId 
} from '@/app/lib/utils'

interface ActionBarProps {
  sessionId: string
  currentPhase: Phase
}

export default function ActionBar({ sessionId, currentPhase }: ActionBarProps) {
  const router = useRouter()

  const getNextPhaseInfo = () => {
    // sessionStorageから現在のワークフローフェーズIDを取得
    let currentWorkflowPhaseId = getCurrentWorkflowPhaseId(currentPhase)
    if (typeof window !== 'undefined') {
      const savedSession = sessionStorage.getItem('currentWorkSession')
      if (savedSession) {
        try {
          const session = JSON.parse(savedSession)
          if (session.currentWorkflowPhaseId) {
            currentWorkflowPhaseId = session.currentWorkflowPhaseId
          }
        } catch (error) {
          console.error('Failed to parse session:', error)
        }
      }
    }
    
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

  const handleBackToHome = () => {
    router.push('/')
  }

  const nextPhaseInfo = getNextPhaseInfo()

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-wrap justify-center gap-3">
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
          <button
            onClick={handleBackToHome}
            className="btn-secondary"
          >
            🏠 トップへ戻る
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
