'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { mockRecommendations } from '@/app/lib/mock-data'
import { searchDocuments } from '@/app/lib/search-data'
import { getWorkflowManual, SessionContext } from '@/app/lib/workflow-content'
import ManualBodyContent from './components/ManualBodyContent'

export default function ManualDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [sessionContext, setSessionContext] = useState<SessionContext>({
    vehicleModel: 'Model A',
    modelYear: 2024,
    dtc: 'P0420',
  })
  
  useEffect(() => {
    const savedSession = sessionStorage.getItem('currentWorkSession')
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession)
        setSessionContext({
          vehicleModel: session.vehicleModel || 'Model A',
          modelYear: session.modelYear || 2024,
          dtc: session.dtc?.[0] || 'P0420',
        })
      } catch (error) {
        console.error('Failed to parse session data:', error)
      }
    }
  }, [])
  
  const workflowManual = getWorkflowManual(id, sessionContext)
  const manualFromRecsItem = Object.values(mockRecommendations)
    .flatMap((rec) => rec.manuals)
    .find((m) => m.id === id)
  const manualFromRecs = manualFromRecsItem
    ? { ...manualFromRecsItem, contentType: 'diagnosis' as const, body: '' }
    : null
  const manualFromSearch = searchDocuments.find((m) => m.type === 'manual' && m.id === id)
  const manual = workflowManual ?? manualFromRecs ?? (manualFromSearch
    ? {
        id: manualFromSearch.id,
        title: manualFromSearch.title,
        section: manualFromSearch.section ?? '',
        url: `/manuals/${manualFromSearch.id}`,
        relevanceScore: 0.9,
        contentType: 'diagnosis' as const,
        body: manualFromSearch.content,
      }
    : null)

  if (!manual) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="card p-6 text-center">
          <p className="text-gray-500">マニュアルが見つかりません</p>
          <Link href="/">
            <button className="btn-secondary mt-4">トップに戻る</button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* パンくずリスト */}
      <nav className="mb-6 text-sm text-gray-600">
        <Link href="/" className="hover:text-primary">トップ</Link>
        <span className="mx-2">/</span>
        <Link href="/work-sessions/1" className="hover:text-primary">作業セッション</Link>
        <span className="mx-2">/</span>
        <span>マニュアル詳細</span>
      </nav>

      {/* マニュアルヘッダー */}
      <div className="card p-6 mb-6">
        <div className="mb-4">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
            公式マニュアル
          </span>
        </div>
        <h1 className="text-2xl font-bold mb-3">{manual.title}</h1>
        <div className="flex flex-wrap items-center text-sm text-gray-600 gap-x-4 gap-y-1">
          <div>
            <span className="font-medium">車両:</span> {sessionContext.vehicleModel} {sessionContext.modelYear}年
          </div>
          <div>
            <span className="font-medium">セクション:</span> {manual.section}
          </div>
          <div>
            <span className="font-medium">関連度:</span> {Math.round(manual.relevanceScore * 100)}%
          </div>
        </div>
      </div>

      {/* マニュアル本文 */}
      <div className="card p-6 mb-6">
        <ManualBodyContent manual={manual} sessionContext={sessionContext} />
      </div>

      {/* アクションボタン */}
      <div className="flex justify-between items-center">
        <Link href="/work-sessions/1">
          <button className="btn-secondary">← 作業画面に戻る</button>
        </Link>
        <button
          onClick={() => window.print()}
          className="btn-outline"
        >
          🖨️ 印刷
        </button>
      </div>
    </div>
  )
}
