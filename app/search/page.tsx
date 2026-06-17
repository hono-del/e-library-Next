'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { matchesFilter } from '@/app/lib/search-data'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('sessionId')
  
  const [query, setQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [results, setResults] = useState<any[]>([])
  const [aiSummary, setAiSummary] = useState('')
  const [vehicleInfo, setVehicleInfo] = useState({ model: '', year: '' })
  const [filterModel, setFilterModel] = useState('all')
  const [filterYear, setFilterYear] = useState('all')

  useEffect(() => {
    // sessionStorageから車両情報を取得
    const savedSession = sessionStorage.getItem('currentWorkSession')
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession)
        setVehicleInfo({
          model: session.vehicleModel || '',
          year: session.modelYear || ''
        })
        setFilterModel(session.vehicleModel || 'all')
        setFilterYear(session.modelYear?.toString() || 'all')
      } catch (error) {
        console.error('Failed to parse session data:', error)
      }
    }
  }, [])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsSearching(true)
    setHasSearched(false)

    try {
      // Claude APIで実際の検索を実行
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query.trim(),
          vehicleModel: vehicleInfo.model,
          modelYear: vehicleInfo.year,
        }),
      })

      if (!response.ok) {
        throw new Error('検索に失敗しました')
      }

      const data = await response.json()

      setAiSummary(data.aiSummary || '')
      setResults(data.results || [])
      setIsSearching(false)
      setHasSearched(true)

    } catch (error) {
      console.error('Search error:', error)
      
      // エラー時はフォールバックとしてモックデータを使用
      const summary = `検索キーワード「${query}」について、${vehicleInfo.model || '車両'} ${vehicleInfo.year || ''}年式に関連する情報を検索しています。

⚠️ 現在、AI検索サービスに接続できません。モックデータを表示しています。

• **診断手順**: DTC P0420は触媒効率低下を示すコードで、まずO2センサーの点検から始めることを推奨します
• **よくある原因**: ${vehicleInfo.model || '多くの車種'}ではリアO2センサーの劣化が最も多い原因です（約70%）
• **修理事例**: センサー交換で解決した事例が多数報告されています（費用: 約3万円、作業時間: 1.5時間）`

      setAiSummary(summary)

      // 車両情報に基づいた検索結果を生成
      const vehicleText = vehicleInfo.model && vehicleInfo.year 
        ? `${vehicleInfo.model} ${vehicleInfo.year}年`
        : 'Model A 2024年'

      setResults([
        {
          type: 'manual',
          id: 'manual-123',
          title: 'サービスマニュアル: P0420 - 触媒効率低下',
          snippet: 'DTC P0420は触媒システムの効率低下を示します。リアO2センサーの出力電圧がフロントO2センサーと類似している場合に検出されます...',
          section: 'エンジン / 排気系統',
          relevanceScore: 0.95,
          url: '/manuals/manual-123',
          vehicleModel: vehicleInfo.model || 'Model A',
          modelYear: vehicleInfo.year || 2024,
        },
        {
          type: 'tie',
          id: 'tie-456',
          title: `${vehicleText} P0420対応事例`,
          snippet: `お客様からの申告: エンジンチェックランプが点灯。走行には問題なし。診断結果: O2センサーの劣化により触媒効率警告が発生。センサー交換で解決...`,
          symptom: '触媒効率警告灯点灯',
          solution: 'O2センサー交換で解決',
          relevanceScore: 0.88,
          url: '/ties/tie-456',
          vehicleModel: vehicleInfo.model || 'Model A',
          modelYear: vehicleInfo.year || 2024,
        },
        {
          type: 'qa',
          id: 'qa-789',
          title: 'P0420のよくある原因は？',
          snippet: 'P0420の原因として最も多いのはO2センサーの劣化です。データモニターで電圧波形を確認し、フロントO2センサーと比較して応答が遅い場合は劣化...',
          bestAnswer: 'O2センサーの劣化が最も多い原因です',
          relevanceScore: 0.82,
          url: '/qa-questions/qa-789',
          vehicleModel: vehicleInfo.model || 'Model A',
          modelYear: vehicleInfo.year || 2024,
        },
        {
          type: 'manual',
          id: 'manual-456',
          title: 'O2センサー点検・交換手順',
          snippet: 'リアO2センサーの点検および交換方法を説明します。必要工具: トルクレンチ、マルチメーター。締付けトルク: 55Nm...',
          section: '電装 / センサー',
          relevanceScore: 0.78,
          url: '/manuals/manual-456',
          vehicleModel: vehicleInfo.model || 'Model A',
          modelYear: vehicleInfo.year || 2024,
        },
        {
          type: 'tie',
          id: 'tie-789',
          title: `${vehicleText} 触媒交換事例`,
          snippet: `走行距離12万kmの${vehicleText}で、O2センサー交換後もP0420が再発。触媒本体の交換で解決した事例...`,
          symptom: 'センサー交換後もDTC再発',
          solution: '触媒本体交換',
          relevanceScore: 0.72,
          url: '/ties/tie-789',
          vehicleModel: vehicleInfo.model || 'Model A',
          modelYear: vehicleInfo.year || 2024,
        },
      ])
      setIsSearching(false)
      setHasSearched(true)
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'manual':
        return { label: '公式マニュアル', bgColor: 'bg-blue-100', textColor: 'text-blue-800' }
      case 'tie':
        return { label: 'TIE事例', bgColor: 'bg-green-100', textColor: 'text-green-800' }
      case 'qa':
        return { label: 'Q&A', bgColor: 'bg-purple-100', textColor: 'text-purple-800' }
      default:
        return { label: '不明', bgColor: 'bg-gray-100', textColor: 'text-gray-800' }
    }
  }

  // フィルター適用（全車種共通 "all" も表示対象に含める）
  const filteredResults = results.filter((result) =>
    matchesFilter(result, filterModel, filterYear)
  )

  // 利用可能な車種・年式のリストを取得
  const availableModels = ['all', ...Array.from(new Set(results.map(r => r.vehicleModel).filter(Boolean)))]
  const availableYears = ['all', ...Array.from(new Set(results.map(r => r.modelYear).filter(Boolean)))]

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
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
        <span>AI検索</span>
      </nav>

      {/* ヘッダー */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-3">🔍 AI情報検索</h1>
        <p className="text-gray-600">
          AIが自動で表示できなかった情報を探すことができます
        </p>
        {vehicleInfo.model && vehicleInfo.year && (
          <div className="mt-3 inline-flex items-center bg-blue-50 text-blue-800 text-sm px-3 py-1 rounded">
            <span className="font-medium">作業中の車両: {vehicleInfo.model} {vehicleInfo.year}年</span>
          </div>
        )}
      </div>

      {/* 検索フォーム */}
      <form id="search-form" onSubmit={handleSearch} className="mb-8">
        <div className="flex space-x-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="例: O2センサーの点検方法、触媒交換の手順、P0420の原因..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary text-base"
            disabled={isSearching}
          />
          <button
            type="submit"
            className="btn-primary px-8"
            disabled={isSearching || !query.trim()}
          >
            {isSearching ? '検索中...' : '検索'}
          </button>
        </div>
        <div className="mt-3 text-sm text-gray-600">
          💡 ヒント: 具体的なキーワード（DTC、車種、症状など）を入れると精度が上がります
        </div>
      </form>

      {/* 検索中のローディング */}
      {isSearching && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-600">AIが関連情報を検索しています...</p>
        </div>
      )}

      {/* AI要約サマリー */}
      {hasSearched && !isSearching && aiSummary && (
        <div className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-secondary rounded-lg p-6">
          <div className="flex items-start mb-3">
            <div className="flex-shrink-0 mr-3">
              <svg className="h-6 w-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">AIによる要約</h3>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">{aiSummary}</p>
            </div>
          </div>
        </div>
      )}

      {/* 検索結果 */}
      {hasSearched && !isSearching && (
        <div>
          {/* フィルタータブ */}
          <div className="mb-6 bg-gray-50 rounded-lg p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mr-2">車種:</label>
                <select
                  value={filterModel}
                  onChange={(e) => setFilterModel(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">すべて</option>
                  {availableModels.filter(m => m !== 'all').map((model) => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mr-2">年式:</label>
                <select
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">すべて</option>
                  {availableYears.filter(y => y !== 'all').map((year) => (
                    <option key={year} value={year}>{year}年</option>
                  ))}
                </select>
              </div>
              {(filterModel !== 'all' || filterYear !== 'all') && (
                <button
                  onClick={() => {
                    setFilterModel('all')
                    setFilterYear('all')
                  }}
                  className="text-sm text-primary hover:underline"
                >
                  フィルターをクリア
                </button>
              )}
            </div>
          </div>

          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">
              検索結果: {filteredResults.length}件
              {filteredResults.length < results.length && (
                <span className="text-sm font-normal text-gray-600 ml-2">
                  （全{results.length}件中）
                </span>
              )}
            </h2>
            <span className="text-sm text-gray-600">
              「{query}」の検索結果
            </span>
          </div>

          <div className="space-y-4">
            {filteredResults.map((result) => {
              const typeInfo = getTypeLabel(result.type)
              return (
                <div key={result.id} className="card p-6 hover:shadow-lg transition-shadow">
                  {/* タイプバッジと関連度 */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`inline-block ${typeInfo.bgColor} ${typeInfo.textColor} text-xs font-semibold px-2.5 py-0.5 rounded`}
                      >
                        {typeInfo.label}
                      </span>
                      {result.vehicleModel && result.modelYear && (
                        <span className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                          {result.vehicleModel === 'all' ? '全車種共通' : `${result.vehicleModel} ${result.modelYear}年`}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-xs text-gray-600">
                        関連度: {Math.round(result.relevanceScore * 100)}%
                      </div>
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${result.relevanceScore * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* タイトル */}
                  <h3 className="text-lg font-bold mb-2">{result.title}</h3>

                  {/* 追加情報 */}
                  {result.section && (
                    <div className="text-sm text-gray-600 mb-2">
                      セクション: {result.section}
                    </div>
                  )}
                  {result.symptom && (
                    <div className="text-sm text-gray-600 mb-2">
                      症状: {result.symptom}
                    </div>
                  )}

                  {/* スニペット */}
                  <p className="text-gray-700 mb-4 line-clamp-3">{result.snippet}</p>

                  {/* アクション */}
                  <Link href={result.url}>
                    <button className="btn-secondary">詳細を見る</button>
                  </Link>
                </div>
              )
            })}
          </div>

          {filteredResults.length === 0 && (
            <div className="card p-6 text-center text-gray-500">
              選択した条件に一致する検索結果がありません
            </div>
          )}
        </div>
      )}

      {/* 初期状態の提案 */}
      {!hasSearched && !isSearching && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold mb-3">検索のヒント</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setQuery('P0420 診断方法')
                  setTimeout(() => {
                    const form = document.getElementById('search-form') as HTMLFormElement
                    form?.requestSubmit()
                  }, 100)
                }}
                className="card p-4 text-left hover:shadow-md transition-shadow"
              >
                <div className="font-medium mb-1">DTCから検索</div>
                <div className="text-sm text-gray-600">例: P0420 診断方法</div>
              </button>
              <button
                onClick={() => {
                  setQuery('O2センサー 点検')
                  setTimeout(() => {
                    const form = document.getElementById('search-form') as HTMLFormElement
                    form?.requestSubmit()
                  }, 100)
                }}
                className="card p-4 text-left hover:shadow-md transition-shadow"
              >
                <div className="font-medium mb-1">部品名から検索</div>
                <div className="text-sm text-gray-600">例: O2センサー 点検</div>
              </button>
              <button
                onClick={() => {
                  setQuery('触媒 交換 手順')
                  setTimeout(() => {
                    const form = document.getElementById('search-form') as HTMLFormElement
                    form?.requestSubmit()
                  }, 100)
                }}
                className="card p-4 text-left hover:shadow-md transition-shadow"
              >
                <div className="font-medium mb-1">作業手順を検索</div>
                <div className="text-sm text-gray-600">例: 触媒 交換 手順</div>
              </button>
              <button
                onClick={() => {
                  setQuery('エンジンチェックランプ 点灯')
                  setTimeout(() => {
                    const form = document.getElementById('search-form') as HTMLFormElement
                    form?.requestSubmit()
                  }, 100)
                }}
                className="card p-4 text-left hover:shadow-md transition-shadow"
              >
                <div className="font-medium mb-1">症状から検索</div>
                <div className="text-sm text-gray-600">例: エンジンチェックランプ 点灯</div>
              </button>
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-secondary rounded-lg p-6">
            <h3 className="font-semibold mb-2">💡 このページの使い方</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• AIが自動で表示した情報で不足がある場合に使います</li>
              <li>• 具体的なキーワードを入力すると、関連性の高い情報が見つかります</li>
              <li>• 公式マニュアル、TIE事例、Q&Aから横断的に検索します</li>
              {vehicleInfo.model && vehicleInfo.year && (
                <li>• 現在作業中の{vehicleInfo.model} {vehicleInfo.year}年の情報を優先的に表示します</li>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* 戻るボタン */}
      {sessionId && (
        <div className="mt-8">
          <Link href={`/work-sessions/${sessionId}`}>
            <button className="btn-secondary">← 作業画面に戻る</button>
          </Link>
        </div>
      )}
    </div>
  )
}
