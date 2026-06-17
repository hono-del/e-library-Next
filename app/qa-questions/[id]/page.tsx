'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { mockRecommendations } from '@/app/lib/mock-data'

export default function QADetailPage({ params }: { params: Promise<{ id: string }> }) {
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
  const question = Object.values(mockRecommendations)
    .flatMap((rec) => rec.qaQuestions)
    .find((q) => q.id === id)

  if (!question) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="card p-6 text-center">
          <p className="text-gray-500">Q&Aが見つかりません</p>
          <Link href="/">
            <button className="btn-secondary mt-4">トップに戻る</button>
          </Link>
        </div>
      </div>
    )
  }

  // モック回答データ（車両情報を動的に反映）
  const answers = [
    {
      id: 'ans-1',
      isBest: true,
      author: '田中一郎',
      authorId: 'tech-001',
      certification: '1級整備士',
      postedAt: '2024年9月10日 14:30',
      helpful: 23,
      content: question?.bestAnswer || 'O2センサーの劣化が最も多い原因です',
      detail: `私も同じ症状に何度も対応しています。P0420の原因として最も多いのはO2センサーの劣化です。

以下の点を確認してみてください:

1. **リアO2センサーの応答速度**
   - データモニターで電圧波形を確認
   - フロントO2センサーと比較して応答が遅い場合は劣化

2. **触媒前後の温度差**
   - 赤外線温度計で測定
   - 温度差が50℃未満の場合は触媒劣化の可能性

3. **排気漏れの確認**
   - O2センサー周辺の排気漏れも誤検知の原因になります

私の経験では、約7割がO2センサー交換で解決しています。触媒交換は高額なので、まずセンサーから確認することをお勧めします。`,
    },
    {
      id: 'ans-2',
      isBest: false,
      author: '鈴木花子',
      authorId: 'tech-002',
      certification: '2級整備士',
      postedAt: '2024年9月10日 16:15',
      helpful: 8,
      content: '追加情報です。',
      detail: `田中さんの回答に加えて、以下も確認してみてください:

- **燃料系統の点検**: 燃料の不完全燃焼も触媒効率に影響します
- **エンジンオイルの確認**: オイル消費がある場合、触媒を早期劣化させます
- **点火系統**: 失火があると触媒にダメージを与えます

${vehicleInfo.model} ${vehicleInfo.year}年式は、リアO2センサーのコネクタ部分に水が入りやすいという報告もあります。コネクタ内部も確認してみてください。`,
    },
    {
      id: 'ans-3',
      isBest: false,
      author: '佐藤健',
      authorId: 'tech-003',
      certification: '1級整備士',
      postedAt: '2024年9月11日 09:20',
      helpful: 5,
      content: '部品情報を追加します。',
      detail: `${vehicleInfo.model} ${vehicleInfo.year}年式のリアO2センサーの部品番号は以下の通りです:

- **部品番号**: 22690-AA123
- **参考価格**: ¥18,500（税別）
- **交換時間**: 約30分

締付けトルクは55Nmです。トルクレンチを必ず使用してください。

また、センサー交換後は必ず以下を実施してください:
1. DTCクリア
2. 試運転（最低20km）
3. 再度DTC確認

DGSのデータモニターで、交換前後の電圧波形を記録しておくと、お客様への説明にも役立ちます。`,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* パンくずリスト */}
      <nav className="mb-6 text-sm text-gray-600">
        <Link href="/" className="hover:text-primary">トップ</Link>
        <span className="mx-2">/</span>
        <Link href="/work-sessions/1" className="hover:text-primary">作業セッション</Link>
        <span className="mx-2">/</span>
        <span>Q&A詳細</span>
      </nav>

      {/* 質問ヘッダー */}
      <div className="card p-6 mb-6">
        <div className="mb-4 flex items-center justify-between">
          <span className="inline-block bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded">
            現場Q&A
          </span>
          <div className="text-sm text-gray-600">
            <span className="font-medium">関連度:</span> {Math.round(question.relevanceScore * 100)}%
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-4">{question.title}</h1>
        
        {/* 質問者情報 */}
        <div className="flex items-center justify-between text-sm text-gray-600 border-t pt-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <span className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center mr-2">👤</span>
              <span className="font-medium">山本次郎</span>
            </div>
            <span>投稿日: 2024年9月10日 12:45</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>👁️ 145回閲覧</span>
            <span>💬 {answers.length}件の回答</span>
          </div>
        </div>
      </div>

      {/* 質問本文 */}
      <div className="card p-6 mb-6">
        <h2 className="text-lg font-bold mb-3">質問内容</h2>
        <div className="space-y-3 text-gray-700">
          <p>
            {vehicleInfo.model} {vehicleInfo.year}年式で、P0420（触媒効率低下）が発生しています。
          </p>
          <p>
            お客様からの症状は「エンジンチェックランプ点灯」のみで、走行に問題はありません。
          </p>
          <p className="font-medium">
            O2センサーが原因なのか、触媒本体が原因なのかを判断する方法を教えてください。
          </p>
          <div className="bg-gray-50 rounded p-3 mt-4">
            <div className="text-sm font-medium mb-2">車両情報:</div>
            <ul className="text-sm space-y-1">
              <li>• 車種: {vehicleInfo.model}</li>
              <li>• 年式: {vehicleInfo.year}年</li>
              <li>• 走行距離: 28,500 km</li>
              <li>• DTC: P0420</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 回答リスト */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">{answers.length}件の回答</h2>
        
        <div className="space-y-4">
          {answers.map((answer) => (
            <div
              key={answer.id}
              className={`card p-6 ${
                answer.isBest ? 'border-2 border-green-500 bg-green-50' : ''
              }`}
            >
              {/* ベストアンサーバッジ */}
              {answer.isBest && (
                <div className="mb-3">
                  <span className="inline-block bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded">
                    ✓ ベストアンサー
                  </span>
                </div>
              )}

              {/* 回答者情報 */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-lg">👤</span>
                  </div>
                  <div>
                    <div className="font-medium">{answer.author}</div>
                    <div className="text-xs text-gray-600">{answer.certification}</div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">{answer.postedAt}</div>
              </div>

              {/* 回答内容 */}
              <div className="prose max-w-none mb-4">
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {answer.detail}
                </p>
              </div>

              {/* アクション */}
              <div className="flex items-center space-x-4 pt-3 border-t">
                <button className="text-sm text-gray-600 hover:text-primary flex items-center">
                  👍 参考になった ({answer.helpful})
                </button>
                <button className="text-sm text-gray-600 hover:text-primary">
                  💬 コメント
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 回答を投稿 */}
      <div className="card p-6 mb-6">
        <h2 className="text-lg font-bold mb-4">あなたも回答してみませんか？</h2>
        <textarea
          className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-3 focus:outline-none focus:ring-2 focus:ring-primary"
          rows={6}
          placeholder="この質問への回答を入力してください..."
        />
        <div className="flex justify-end">
          <button className="btn-primary">回答を投稿</button>
        </div>
      </div>

      {/* 関連Q&A */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">関連するQ&A</h2>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100">
            <span>P0420は触媒交換が必須？</span>
            <span className="text-xs text-gray-500">12件の回答</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100">
            <span>O2センサーの点検方法を教えてください</span>
            <span className="text-xs text-gray-500">8件の回答</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100">
            <span>触媒劣化の判断基準は？</span>
            <span className="text-xs text-gray-500">15件の回答</span>
          </div>
        </div>
      </div>

      {/* アクションボタン */}
      <div className="flex justify-between items-center">
        <Link href="/work-sessions/1">
          <button className="btn-secondary">← 作業画面に戻る</button>
        </Link>
        <div className="space-x-3">
          <button className="btn-outline">🔖 ブックマーク</button>
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
