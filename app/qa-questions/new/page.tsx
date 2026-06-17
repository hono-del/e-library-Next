'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'

function NewQuestionPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const sessionId = searchParams.get('sessionId')
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    vehicleModel: '',
    modelYear: '',
    dtc: '',
    symptom: '',
    category: 'diagnosis',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // モック投稿処理（2秒後に完了）
    setTimeout(() => {
      alert('質問を投稿しました。他の整備士からの回答をお待ちください。')
      setIsSubmitting(false)
      if (sessionId) {
        router.push(`/work-sessions/${sessionId}`)
      } else {
        router.push('/')
      }
    }, 2000)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* パンくずリスト */}
      <nav className="mb-6 text-sm text-gray-600">
        <Link href="/" className="hover:text-primary">トップ</Link>
        {sessionId && (
          <>
            <span className="mx-2">/</span>
            <Link href={`/work-sessions/${sessionId}`} className="hover:text-primary">
              作業セッション
            </Link>
          </>
        )}
        <span className="mx-2">/</span>
        <span>質問を投稿</span>
      </nav>

      {/* ヘッダー */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-3">💬 現場の整備士に質問する</h1>
        <p className="text-gray-600">
          困ったことがあれば、全国の整備士に質問できます
        </p>
      </div>

      {/* 注意事項 */}
      <div className="bg-blue-50 border-l-4 border-secondary rounded-lg p-6 mb-6">
        <h3 className="font-semibold mb-2">💡 質問する前に</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• 同じ質問がないか、まずAI検索で確認してみてください</li>
          <li>• 車両情報（車種、年式、DTC）を明記すると、的確な回答が得られます</li>
          <li>• 既に試した診断内容も記載すると参考になります</li>
          <li>• 回答は通常24時間以内に届きます</li>
        </ul>
      </div>

      {/* 質問フォーム */}
      <form onSubmit={handleSubmit} className="card p-6">
        {/* カテゴリー */}
        <div className="mb-6">
          <label htmlFor="category" className="block text-sm font-medium mb-2">
            カテゴリー <span className="text-warning">*</span>
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            required
          >
            <option value="diagnosis">診断・点検</option>
            <option value="repair">修理・交換</option>
            <option value="parts">部品・工具</option>
            <option value="electrical">電装系</option>
            <option value="engine">エンジン</option>
            <option value="transmission">トランスミッション</option>
            <option value="other">その他</option>
          </select>
        </div>

        {/* タイトル */}
        <div className="mb-6">
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            質問タイトル <span className="text-warning">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="例: P0420のO2センサーと触媒の判別方法は？"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            required
            maxLength={100}
          />
          <div className="text-xs text-gray-500 mt-1">
            {formData.title.length}/100文字
          </div>
        </div>

        {/* 質問内容 */}
        <div className="mb-6">
          <label htmlFor="content" className="block text-sm font-medium mb-2">
            質問内容 <span className="text-warning">*</span>
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="具体的な症状、既に試したこと、困っていることなどを詳しく書いてください。"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            rows={8}
            required
          />
          <div className="text-xs text-gray-500 mt-1">
            できるだけ詳しく記載すると、的確な回答が得られやすくなります
          </div>
        </div>

        {/* 車両情報セクション */}
        <div className="border-t pt-6 mb-6">
          <h3 className="font-semibold mb-4">車両情報（任意）</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 車種 */}
            <div>
              <label htmlFor="vehicleModel" className="block text-sm font-medium mb-2">
                車種
              </label>
              <input
                type="text"
                id="vehicleModel"
                name="vehicleModel"
                value={formData.vehicleModel}
                onChange={handleChange}
                placeholder="例: Model A"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* 年式 */}
            <div>
              <label htmlFor="modelYear" className="block text-sm font-medium mb-2">
                年式
              </label>
              <input
                type="text"
                id="modelYear"
                name="modelYear"
                value={formData.modelYear}
                onChange={handleChange}
                placeholder="例: 2024"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* DTC */}
            <div>
              <label htmlFor="dtc" className="block text-sm font-medium mb-2">
                DTC
              </label>
              <input
                type="text"
                id="dtc"
                name="dtc"
                value={formData.dtc}
                onChange={handleChange}
                placeholder="例: P0420"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* 症状 */}
            <div>
              <label htmlFor="symptom" className="block text-sm font-medium mb-2">
                症状
              </label>
              <input
                type="text"
                id="symptom"
                name="symptom"
                value={formData.symptom}
                onChange={handleChange}
                placeholder="例: エンジンチェックランプ点灯"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* 確認事項 */}
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
          <h3 className="font-semibold mb-2 text-yellow-900">⚠️ 投稿前の確認</h3>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>✓ 個人情報（顧客名、VIN、電話番号など）が含まれていないか</li>
            <li>✓ 質問内容は整備に関するものか</li>
            <li>✓ 誹謗中傷や不適切な表現が含まれていないか</li>
          </ul>
        </div>

        {/* アクションボタン */}
        <div className="flex justify-between items-center">
          <Link href={sessionId ? `/work-sessions/${sessionId}` : '/'}>
            <button type="button" className="btn-secondary" disabled={isSubmitting}>
              キャンセル
            </button>
          </Link>
          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting || !formData.title || !formData.content}
          >
            {isSubmitting ? '投稿中...' : '質問を投稿する'}
          </button>
        </div>
      </form>

      {/* よくある質問例 */}
      <div className="mt-8 card p-6">
        <h3 className="font-semibold mb-4">💡 よくある質問の例</h3>
        <div className="space-y-3 text-sm">
          <div className="p-3 bg-gray-50 rounded">
            <div className="font-medium mb-1">DTCの原因特定</div>
            <div className="text-gray-600">
              「P0420で、O2センサーと触媒のどちらが原因か判断する方法を教えてください」
            </div>
          </div>
          <div className="p-3 bg-gray-50 rounded">
            <div className="font-medium mb-1">部品選定</div>
            <div className="text-gray-600">
              「Model A 2024年式のリアO2センサーの部品番号を教えてください」
            </div>
          </div>
          <div className="p-3 bg-gray-50 rounded">
            <div className="font-medium mb-1">作業手順</div>
            <div className="text-gray-600">
              「触媒交換時の注意点や、必要な工具を教えてください」
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function NewQuestionPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8 text-center text-gray-500">
        読み込み中...
      </div>
    }>
      <NewQuestionPageContent />
    </Suspense>
  )
}
