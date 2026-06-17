'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { PHASE_LABELS } from '@/app/lib/utils'
import { formatElapsedTime } from '@/app/lib/utils'

interface ActiveSession {
  id: string
  vehicleModel: string
  modelYear: number | string
  symptom: string | null
  currentPhase: string
  startedAt: Date
}

interface User {
  id: string
  name: string
  role: string
  roleLabel: string
}

export default function Home() {
  const router = useRouter()
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
    // ログインチェック
    const userStr = sessionStorage.getItem('currentUser')
    if (!userStr) {
      router.push('/login')
      return
    }

    try {
      setCurrentUser(JSON.parse(userStr))
    } catch (error) {
      console.error('Failed to parse user data:', error)
      router.push('/login')
      return
    }

    // sessionStorageから進行中の作業セッションを取得
    const savedSession = sessionStorage.getItem('currentWorkSession')
    
    if (savedSession) {
      try {
        const parsedSession = JSON.parse(savedSession)
        parsedSession.startedAt = new Date(parsedSession.startedAt)
        setActiveSessions([parsedSession])
      } catch (error) {
        console.error('Failed to parse session data:', error)
        setActiveSessions([])
      }
    }
  }, [router])

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* メインアクション */}
      <div className="text-center mb-12">
        <Link href="/work-sessions/new">
          <button className="btn-primary text-lg py-4 px-12 mb-3">
            作業を開始する
          </button>
        </Link>
        <p className="text-sm text-gray-600">
          車両情報を入力すると、作業に必要な情報が自動で表示されます
        </p>
      </div>

      {/* クイックアクセス */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">クイックアクセス</h2>
        <div className={`grid grid-cols-1 ${currentUser?.role === 'manufacturer' ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4`}>
          <Link href="/search" className="card p-6 hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-3">🔍</div>
            <h3 className="font-bold text-lg mb-2">AI情報検索</h3>
            <p className="text-sm text-gray-600">症状やDTCから関連情報を検索</p>
          </Link>
          
          <Link href="/qa-questions/new" className="card p-6 hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-3">💬</div>
            <h3 className="font-bold text-lg mb-2">質問を投稿</h3>
            <p className="text-sm text-gray-600">他の整備士に質問する</p>
          </Link>
          
          {currentUser?.role === 'manufacturer' && (
            <Link href="/analytics" className="card p-6 hover:shadow-lg transition-shadow bg-blue-50 border-2 border-blue-200">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="font-bold text-lg mb-2 text-blue-900">分析ダッシュボード</h3>
              <p className="text-sm text-blue-700">利用状況と課題を可視化（管理者向け）</p>
            </Link>
          )}
        </div>
      </section>

      {/* 進行中の作業セッション */}
      <section>
        <h2 className="text-2xl font-bold mb-6">進行中の作業セッション</h2>
        
        {activeSessions.length === 0 ? (
          <div className="card p-6 text-center text-gray-500">
            現在、進行中の作業セッションはありません
          </div>
        ) : (
          <div className="space-y-4">
            {activeSessions.map((session) => (
              <div key={session.id} className="card p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">車種:</span> {session.vehicleModel} | 
                      <span className="ml-2"><span className="font-medium">年式:</span> {session.modelYear}</span>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">症状:</span> {session.symptom || '未入力'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">工程:</span> {PHASE_LABELS[session.currentPhase as keyof typeof PHASE_LABELS] || session.currentPhase}
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">経過時間:</span> {formatElapsedTime(session.startedAt)}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Link href={`/work-sessions/${session.id}`}>
                    <button className="btn-secondary">
                      続きから作業する
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
