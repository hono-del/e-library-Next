'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { mockRecommendations } from '@/app/lib/mock-data'
import { searchDocuments } from '@/app/lib/search-data'

export default function ManualDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [vehicleInfo, setVehicleInfo] = useState({ model: 'Model A', year: 2024 })
  
  useEffect(() => {
    // sessionStorageから車両情報を取得
    const savedSession = sessionStorage.getItem('currentWorkSession')
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession)
        setVehicleInfo({
          model: session.vehicleModel || 'Model A',
          year: session.modelYear || 2024
        })
      } catch (error) {
        console.error('Failed to parse session data:', error)
      }
    }
  }, [])
  
  // モックデータから検索
  const manualFromRecs = Object.values(mockRecommendations)
    .flatMap((rec) => rec.manuals)
    .find((m) => m.id === id)
  const manualFromSearch = searchDocuments.find((m) => m.type === 'manual' && m.id === id)
  const manual = manualFromRecs ?? (manualFromSearch
    ? {
        id: manualFromSearch.id,
        title: manualFromSearch.title,
        section: manualFromSearch.section ?? '',
        url: `/manuals/${manualFromSearch.id}`,
        relevanceScore: 0.9,
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
        <div className="flex items-center text-sm text-gray-600 space-x-4">
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
        <h2 className="text-xl font-bold mb-4">診断フローチャート</h2>
        
        <div className="space-y-6">
          {/* ステップ1 */}
          <div className="border-l-4 border-primary pl-4">
            <h3 className="font-semibold text-lg mb-2">ステップ 1: 基本診断</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>DGS（診断機）を接続し、DTCを確認</li>
              <li>フリーズフレームデータを記録</li>
              <li>現在の症状を確認</li>
            </ul>
          </div>

          {/* ステップ2 */}
          <div className="border-l-4 border-primary pl-4">
            <h3 className="font-semibold text-lg mb-2">ステップ 2: O2センサー点検</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>O2センサーの配線を目視点検</li>
              <li>センサーのコネクタ接続を確認</li>
              <li>センサーの抵抗値を測定（仕様値: 4-14Ω）</li>
            </ul>
            <div className="mt-3 bg-yellow-50 border-l-4 border-yellow-500 p-3">
              <p className="text-sm text-yellow-800">
                ⚠️ <span className="font-semibold">注意:</span> センサーが熱い場合は冷めるまで待機
              </p>
            </div>
          </div>

          {/* ステップ3 */}
          <div className="border-l-4 border-primary pl-4">
            <h3 className="font-semibold text-lg mb-2">ステップ 3: 触媒効率確認</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>アイドリング時のデータモニターで前後O2センサー電圧を確認</li>
              <li>2500rpm時の電圧変化を記録</li>
              <li>触媒前後の温度差を確認（仕様値: 50℃以上）</li>
            </ul>
          </div>

          {/* ステップ4 */}
          <div className="border-l-4 border-primary pl-4">
            <h3 className="font-semibold text-lg mb-2">ステップ 4: 判定と対策</h3>
            <div className="bg-gray-50 rounded p-4 space-y-3">
              <div>
                <span className="font-semibold">OK: </span>
                <span>他の原因を調査（エアリークなど）</span>
              </div>
              <div>
                <span className="font-semibold">NG: </span>
                <span>O2センサーまたは触媒の交換を検討</span>
              </div>
            </div>
          </div>
        </div>

        {/* 必要部品 */}
        <div className="mt-8 bg-blue-50 rounded-lg p-4">
          <h3 className="font-semibold mb-3">必要な部品・工具</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center">
              <span className="w-32 font-medium">DGS（診断機）</span>
              <span className="text-gray-600">必須</span>
            </li>
            <li className="flex items-center">
              <span className="w-32 font-medium">マルチメーター</span>
              <span className="text-gray-600">必須</span>
            </li>
            <li className="flex items-center">
              <span className="w-32 font-medium">トルクレンチ</span>
              <span className="text-gray-600">交換時に必要（55Nm）</span>
            </li>
          </ul>
        </div>
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
