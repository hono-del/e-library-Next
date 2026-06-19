'use client'

import { Suspense, useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { matchesFilter, SearchResultItem, localSearch, buildFallbackSummary } from '@/app/lib/search-data'
import { useLanguage } from '@/app/lib/i18n/LanguageProvider'

function SearchPageContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('sessionId')
  const { t, locale } = useLanguage()
  const yearSuffix = locale === 'ja' ? '年' : ''
  
  const [query, setQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [results, setResults] = useState<SearchResultItem[]>([])
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

  const performSearch = async (searchQuery: string) => {
    setIsSearching(true)
    setHasSearched(false)

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: searchQuery,
          vehicleModel: vehicleInfo.model,
          modelYear: vehicleInfo.year,
          locale,
        }),
      })

      if (!response.ok) {
        throw new Error(t('search.searchFailed'))
      }

      const data = await response.json()

      setAiSummary(data.aiSummary || '')
      setResults(data.results || [])
      setIsSearching(false)
      setHasSearched(true)
    } catch (error) {
      console.error('Search error:', error)

      const fallbackResults = localSearch(
        searchQuery,
        vehicleInfo.model,
        vehicleInfo.year,
        5,
        locale
      )
      setResults(fallbackResults)
      setAiSummary(
        buildFallbackSummary(
          searchQuery,
          vehicleInfo.model,
          vehicleInfo.year,
          fallbackResults,
          locale
        )
      )
      setIsSearching(false)
      setHasSearched(true)
    }
  }

  useEffect(() => {
    if (hasSearched && query.trim()) {
      performSearch(query.trim())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    await performSearch(query.trim())
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'manual':
        return { label: t('search.typeManual'), bgColor: 'bg-blue-100', textColor: 'text-blue-800' }
      case 'tie':
        return { label: t('search.typeTie'), bgColor: 'bg-green-100', textColor: 'text-green-800' }
      case 'qa':
        return { label: t('search.typeQa'), bgColor: 'bg-purple-100', textColor: 'text-purple-800' }
      default:
        return { label: t('search.typeUnknown'), bgColor: 'bg-gray-100', textColor: 'text-gray-800' }
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
        <Link href="/" className="hover:text-primary">{t('manual.breadcrumbTop')}</Link>
        {sessionId && (
          <>
            <span className="mx-2">/</span>
            <Link href={`/work-sessions/${sessionId}`} className="hover:text-primary">
              {t('manual.breadcrumbSession')}
            </Link>
          </>
        )}
        <span className="mx-2">/</span>
        <span>{t('search.breadcrumb')}</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-3">🔍 {t('search.title')}</h1>
        <p className="text-gray-600">{t('search.subtitle')}</p>
        {vehicleInfo.model && vehicleInfo.year && (
          <div className="mt-3 inline-flex items-center bg-blue-50 text-blue-800 text-sm px-3 py-1 rounded">
            <span className="font-medium">{t('search.workingVehicle')}: {vehicleInfo.model} {vehicleInfo.year}{yearSuffix}</span>
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
            placeholder={t('search.placeholder')}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary text-base"
            disabled={isSearching}
          />
          <button
            type="submit"
            className="btn-primary px-8"
            disabled={isSearching || !query.trim()}
          >
            {isSearching ? t('search.searching') : t('search.submit')}
          </button>
        </div>
        <div className="mt-3 text-sm text-gray-600">{t('search.hint')}</div>
      </form>

      {/* 検索中のローディング */}
      {isSearching && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-600">{t('search.searchingAi')}</p>
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
              <h3 className="text-lg font-bold text-gray-900 mb-2">{t('search.aiSummary')}</h3>
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
                <label className="text-sm font-medium text-gray-700 mr-2">{t('search.filterModel')}:</label>
                <select
                  value={filterModel}
                  onChange={(e) => setFilterModel(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">{t('search.all')}</option>
                  {availableModels.filter(m => m !== 'all').map((model) => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mr-2">{t('search.filterYear')}:</label>
                <select
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">{t('search.all')}</option>
                  {availableYears.filter(y => y !== 'all').map((year) => (
                    <option key={year} value={year}>{year}{yearSuffix}</option>
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
                  {t('search.clearFilter')}
                </button>
              )}
            </div>
          </div>

          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">
              {t('search.resultsCount', { count: String(filteredResults.length) })}
              {filteredResults.length < results.length && (
                <span className="text-sm font-normal text-gray-600 ml-2">
                  {t('search.resultsOf', { total: String(results.length) })}
                </span>
              )}
            </h2>
            <span className="text-sm text-gray-600">
              {t('search.queryResults', { query })}
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
                          {result.vehicleModel === 'all' ? t('search.allModelsCommon') : `${result.vehicleModel} ${result.modelYear}${yearSuffix}`}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-xs text-gray-600">
                        {t('search.relevance')}: {Math.round(result.relevanceScore * 100)}%
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
                      {t('search.section')}: {result.section}
                    </div>
                  )}
                  {result.symptom && (
                    <div className="text-sm text-gray-600 mb-2">
                      {t('search.symptom')}: {result.symptom}
                    </div>
                  )}

                  {/* スニペット */}
                  <p className="text-gray-700 mb-4 line-clamp-3">{result.snippet}</p>

                  {/* アクション */}
                  <Link href={result.url}>
                    <button className="btn-secondary">{t('common.viewDetails')}</button>
                  </Link>
                </div>
              )
            })}
          </div>

          {filteredResults.length === 0 && (
            <div className="card p-6 text-center text-gray-500">
              {t('search.noFilterResults')}
            </div>
          )}
        </div>
      )}

      {/* 初期状態の提案 */}
      {!hasSearched && !isSearching && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold mb-3">{t('search.searchHints')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                {
                  label: t('search.hintByDtc'),
                  example: t('search.hintByDtcEx'),
                  query: locale === 'en' ? 'P0420 diagnosis' : 'P0420 診断方法',
                },
                {
                  label: t('search.hintByPart'),
                  example: t('search.hintByPartEx'),
                  query: locale === 'en' ? 'O2 sensor inspection' : 'O2センサー 点検',
                },
                {
                  label: t('search.hintByProcedure'),
                  example: t('search.hintByProcedureEx'),
                  query: locale === 'en' ? 'catalyst replacement procedure' : '触媒 交換 手順',
                },
                {
                  label: t('search.hintBySymptom'),
                  example: t('search.hintBySymptomEx'),
                  query: locale === 'en' ? 'engine check lamp on' : 'エンジンチェックランプ 点灯',
                },
              ].map((hint) => (
                <button
                  key={hint.label}
                  onClick={() => {
                    setQuery(hint.query)
                    setTimeout(() => {
                      const form = document.getElementById('search-form') as HTMLFormElement
                      form?.requestSubmit()
                    }, 100)
                  }}
                  className="card p-4 text-left hover:shadow-md transition-shadow"
                >
                  <div className="font-medium mb-1">{hint.label}</div>
                  <div className="text-sm text-gray-600">{hint.example}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-secondary rounded-lg p-6">
            <h3 className="font-semibold mb-2">{t('search.howToUse')}</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>{t('search.howToUse1')}</li>
              <li>{t('search.howToUse2')}</li>
              <li>{t('search.howToUse3')}</li>
              {vehicleInfo.model && vehicleInfo.year && (
                <li>
                  {t('search.howToUseVehicle', {
                    model: vehicleInfo.model,
                    year: `${vehicleInfo.year}${yearSuffix}`,
                  })}
                </li>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* 戻るボタン */}
      {sessionId && (
        <div className="mt-8">
          <Link href={`/work-sessions/${sessionId}`}>
            <button className="btn-secondary">{t('common.backToWork')}</button>
          </Link>
        </div>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <SearchPageFallback />
    }>
      <SearchPageContent />
    </Suspense>
  )
}

function SearchPageFallback() {
  const { t } = useLanguage()
  return (
    <div className="container mx-auto px-4 py-8 text-center text-gray-500">
      {t('common.loading')}
    </div>
  )
}
