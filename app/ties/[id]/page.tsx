'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { mockRecommendations } from '@/app/lib/mock-data'
import { getWorkflowTie, SessionContext } from '@/app/lib/workflow-content'

export default function TIEDetailPage({ params }: { params: Promise<{ id: string }> }) {
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
  
  const workflowTie = getWorkflowTie(id, sessionContext)
  const baseTie = workflowTie ?? Object.values(mockRecommendations)
    .flatMap((rec) => rec.ties)
    .find((t) => t.id === id)
  
  const tie = baseTie ? {
    ...baseTie,
    title: workflowTie ? baseTie.title : `${sessionContext.vehicleModel} ${sessionContext.modelYear}年 P0420対応事例`,
  } : null

  if (!tie) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="card p-6 text-center">
          <p className="text-gray-500">TIE事例が見つかりません</p>
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
        <span>TIE事例詳細</span>
      </nav>

      {/* TIEヘッダー */}
      <div className="card p-6 mb-6">
        <div className="mb-4 flex items-center justify-between">
          <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">
            修理事例（TIE）
          </span>
          <div className="text-sm text-gray-600">
            <span className="font-medium">関連度:</span> {Math.round(tie.relevanceScore * 100)}%
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-3">{tie.title}</h1>
        <div className="flex items-center text-sm text-gray-600 space-x-4">
          <div>
            <span className="font-medium">症状:</span> {tie.symptom}
          </div>
          <div>
            <span className="font-medium">投稿日:</span> 2024年8月15日
          </div>
        </div>
      </div>

      {/* 車両情報 */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">車両情報</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-600">車種</div>
            <div className="font-medium">{sessionContext.vehicleModel}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">年式</div>
            <div className="font-medium">{sessionContext.modelYear}年</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">走行距離</div>
            <div className="font-medium">15,230 km</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">DTC</div>
            <div className="font-medium">P0420</div>
          </div>
        </div>
      </div>

      {/* 症状詳細 */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">症状詳細</h2>
        <div className="space-y-3 text-gray-700">
          <p>お客様からの申告: エンジンチェックランプが点灯。走行には問題なし。</p>
          <p>初期診断結果:</p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>DTC P0420（触媒効率低下）を確認</li>
            <li>O2センサー前後の電圧波形がほぼ同期</li>
            <li>触媒前後の温度差が20℃と小さい（正常値: 50℃以上）</li>
          </ul>
        </div>
      </div>

      {/* 診断・作業内容 */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">診断・作業内容</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">1. 初期診断（30分）</h3>
            <ul className="list-disc list-inside ml-4 space-y-1 text-gray-700">
              <li>DGSでDTCとフリーズフレームを確認</li>
              <li>O2センサー前後の電圧をデータモニターで確認</li>
              <li>配線の目視点検（異常なし）</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">2. O2センサー点検（20分）</h3>
            <ul className="list-disc list-inside ml-4 space-y-1 text-gray-700">
              <li>リアO2センサーの抵抗値測定: 7.2Ω（正常範囲内）</li>
              <li>しかし、電圧応答が遅いことを確認</li>
              <li>センサー劣化と判断</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">3. 部品交換（40分）</h3>
            <ul className="list-disc list-inside ml-4 space-y-1 text-gray-700">
              <li>リアO2センサーを新品に交換</li>
              <li>トルク値 55Nmで締付け</li>
              <li>DTCをクリアして試運転</li>
            </ul>
          </div>

          <div className="bg-green-50 border-l-4 border-green-500 p-4">
            <h3 className="font-semibold mb-2 text-green-900">✓ 結果</h3>
            <p className="text-green-800">
              試運転30km後もDTC再発なし。O2センサーの電圧波形も正常化。作業完了。
            </p>
          </div>
        </div>
      </div>

      {/* 解決策 */}
      <div className="card p-6 mb-6 bg-primary bg-opacity-5 border-2 border-primary">
        <h2 className="text-xl font-bold mb-4 text-primary">解決策</h2>
        <p className="text-lg font-medium mb-3">{tie.solution}</p>
        <div className="space-y-2 text-sm text-gray-700">
          <div>
            <span className="font-medium">使用部品:</span> リアO2センサー（部品番号: 22690-AA123）
          </div>
          <div>
            <span className="font-medium">作業時間:</span> 約1.5時間
          </div>
          <div>
            <span className="font-medium">費用:</span> 部品代 ¥18,500 + 工賃 ¥12,000 = 合計 ¥30,500（税別）
          </div>
        </div>
      </div>

      {/* 整備士のコメント */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">整備士のコメント</h2>
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
            <span className="text-lg">👤</span>
          </div>
          <div className="flex-1">
            <div className="font-medium mb-1">山田太郎（認証番号: 1234567）</div>
            <p className="text-gray-700 leading-relaxed">
              P0420は触媒劣化だけでなく、O2センサーの劣化でも発生します。
              今回はセンサーの応答速度が遅かったため、センサー交換で対応しました。
              触媒交換は高額なので、まずセンサー点検から始めることをお勧めします。
            </p>
          </div>
        </div>
      </div>

      {/* 関連情報 */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">参考情報</h2>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span>公式マニュアル: P0420診断手順</span>
            <Link href="/manuals/manual-123">
              <button className="btn-secondary text-xs py-1 px-3">見る</button>
            </Link>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span>Q&A: P0420のよくある原因は？</span>
            <Link href="/qa-questions/qa-789">
              <button className="btn-secondary text-xs py-1 px-3">見る</button>
            </Link>
          </div>
        </div>
      </div>

      {/* アクションボタン */}
      <div className="flex justify-between items-center">
        <Link href="/work-sessions/1">
          <button className="btn-secondary">← 作業画面に戻る</button>
        </Link>
        <div className="space-x-3">
          <button className="btn-outline">👍 参考になった (15)</button>
          <button
            onClick={() => window.print()}
            className="btn-outline"
          >
            🖨️ 印刷
          </button>
        </div>
      </div>
    </div>
  )
}
