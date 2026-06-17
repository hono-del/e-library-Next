'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  name: string
  role: string
  roleLabel: string
}

export default function AnalyticsDashboard() {
  const router = useRouter()
  const [dateRange, setDateRange] = useState('30days')
  const [vehicleModel, setVehicleModel] = useState('all')
  const [modelYear, setModelYear] = useState('all')
  const [dealer, setDealer] = useState('all')
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // ログインチェックとアクセス権限チェック
    const userStr = sessionStorage.getItem('currentUser')
    if (!userStr) {
      router.push('/login')
      return
    }

    try {
      const user = JSON.parse(userStr)
      if (user.role !== 'manufacturer') {
        // メーカー管理者以外はアクセス不可
        alert('このページへのアクセス権限がありません')
        router.push('/')
        return
      }
      setCurrentUser(user)
      setIsLoading(false)
    } catch (error) {
      console.error('Failed to parse user data:', error)
      router.push('/login')
    }
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">読み込み中...</div>
      </div>
    )
  }

  // モックデータ
  const stats = {
    activeUsers: 156,
    totalSessions: 1234,
    avgSessionTime: '18分32秒',
    autoSuggestionAccuracy: 87.5,
  }

  const frequentSymptoms = [
    { symptom: 'エンジンチェックランプ点灯', count: 245, trend: '+12%' },
    { symptom: 'エンジン始動不良', count: 189, trend: '+8%' },
    { symptom: 'アイドリング不安定', count: 156, trend: '-3%' },
    { symptom: 'エアコン冷えない', count: 134, trend: '+15%' },
    { symptom: 'ブレーキ異音', count: 98, trend: '+5%' },
  ]

  const topDTCs = [
    { code: 'P0420', description: '触媒効率低下', count: 89, resolvedRate: 92 },
    { code: 'P0171', description: 'システム燃料調整リーン', count: 67, resolvedRate: 88 },
    { code: 'P0300', description: 'ランダム失火検出', count: 54, resolvedRate: 85 },
    { code: 'P0442', description: 'EVAP系統小リーク', count: 43, resolvedRate: 90 },
    { code: 'P0128', description: 'エンジン冷却水温度低下', count: 38, resolvedRate: 95 },
  ]

  const unresolvedIssues = [
    {
      id: 'qa-1001',
      title: 'Model C 2023年 P0340センサー異常が再発',
      postedDate: '2024-06-15',
      views: 45,
      urgency: 'high',
    },
    {
      id: 'qa-1002',
      title: 'Model A ハイブリッド 走行中異音の原因不明',
      postedDate: '2024-06-14',
      views: 38,
      urgency: 'medium',
    },
    {
      id: 'qa-1003',
      title: 'Model B ADAS校正後も警告灯消えない',
      postedDate: '2024-06-13',
      views: 52,
      urgency: 'high',
    },
    {
      id: 'qa-1004',
      title: 'トランスミッション異常の診断方法',
      postedDate: '2024-06-12',
      views: 29,
      urgency: 'medium',
    },
  ]

  const accuracyData = [
    { phase: '診断', accuracy: 92, usage: 456 },
    { phase: '修理・交換・調整', accuracy: 88, usage: 389 },
    { phase: '電子制御・校正', accuracy: 79, usage: 234 },
    { phase: '完了検査', accuracy: 95, usage: 567 },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-white border-b border-gray-200 mb-6">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">メーカー向け分析ダッシュボード</h1>
              <p className="text-sm text-gray-600 mt-1">
                販売店の利用状況、頻出課題、システム精度を可視化
                {currentUser && (
                  <span className="ml-2 text-gray-500">（{currentUser.name}）</span>
                )}
              </p>
            </div>
            <Link href="/">
              <button className="btn-secondary">
                トップへ戻る
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-8">
        {/* フィルタセクション */}
        <div className="card p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">フィルタ条件</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 分析期間 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                分析期間
              </label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="7days">過去7日間</option>
                <option value="30days">過去30日間</option>
                <option value="90days">過去90日間</option>
                <option value="1year">過去1年間</option>
              </select>
            </div>

            {/* 車種 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                車種
              </label>
              <select
                value={vehicleModel}
                onChange={(e) => setVehicleModel(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">全車種</option>
                <option value="Model A">Model A</option>
                <option value="Model B">Model B</option>
                <option value="Model C">Model C</option>
                <option value="Model D">Model D</option>
              </select>
            </div>

            {/* 年式 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                年式
              </label>
              <select
                value={modelYear}
                onChange={(e) => setModelYear(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">全年式</option>
                <option value="2024">2024年</option>
                <option value="2023">2023年</option>
                <option value="2022">2022年</option>
                <option value="2021">2021年</option>
                <option value="2020">2020年</option>
                <option value="older">2019年以前</option>
              </select>
            </div>

            {/* ディーラー */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ディーラー
              </label>
              <select
                value={dealer}
                onChange={(e) => setDealer(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">全ディーラー</option>
                <option value="dealer-a">ディーラーA</option>
                <option value="dealer-b">ディーラーB</option>
                <option value="dealer-c">ディーラーC</option>
              </select>
            </div>
          </div>

          {/* フィルタ適用状態表示 */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-semibold">適用中のフィルタ:</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                {dateRange === '7days' && '過去7日間'}
                {dateRange === '30days' && '過去30日間'}
                {dateRange === '90days' && '過去90日間'}
                {dateRange === '1year' && '過去1年間'}
              </span>
              {vehicleModel !== 'all' && (
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                  {vehicleModel}
                </span>
              )}
              {modelYear !== 'all' && (
                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">
                  {modelYear}年
                </span>
              )}
              {dealer !== 'all' && (
                <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded">
                  {dealer === 'dealer-a' && 'ディーラーA'}
                  {dealer === 'dealer-b' && 'ディーラーB'}
                  {dealer === 'dealer-c' && 'ディーラーC'}
                </span>
              )}
              {(vehicleModel === 'all' && modelYear === 'all' && dealer === 'all') && (
                <span className="text-gray-500">（全データ）</span>
              )}
            </div>
          </div>
        </div>

        {/* サマリーカード */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">アクティブユーザー</h3>
              <span className="text-2xl">👥</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.activeUsers}</p>
            <p className="text-xs text-gray-500 mt-1">過去30日間</p>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">総作業セッション数</h3>
              <span className="text-2xl">📊</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalSessions}</p>
            <p className="text-xs text-gray-500 mt-1">過去30日間</p>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">平均セッション時間</h3>
              <span className="text-2xl">⏱️</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.avgSessionTime}</p>
            <p className="text-xs text-green-600 mt-1">前月比 -15%</p>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">自動提示精度</h3>
              <span className="text-2xl">🎯</span>
            </div>
            <p className="text-3xl font-bold text-green-600">{stats.autoSuggestionAccuracy}%</p>
            <p className="text-xs text-green-600 mt-1">目標: 85%以上</p>
          </div>
        </div>

        {/* メインコンテンツ 2カラム */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* 頻出症状 */}
          <div className="card p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span>🔥</span>
              <span>頻出症状ランキング</span>
            </h2>
            <div className="space-y-3">
              {frequentSymptoms.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                    <div>
                      <p className="font-medium text-gray-900">{item.symptom}</p>
                      <p className="text-xs text-gray-500">{item.count}件</p>
                    </div>
                  </div>
                  <span className={`text-sm font-semibold ${item.trend.startsWith('+') ? 'text-orange-600' : 'text-green-600'}`}>
                    {item.trend}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 頻出DTC */}
          <div className="card p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span>⚠️</span>
              <span>頻出DTCコード</span>
            </h2>
            <div className="space-y-3">
              {topDTCs.map((item, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                      <div>
                        <p className="font-mono font-bold text-gray-900">{item.code}</p>
                        <p className="text-xs text-gray-600">{item.description}</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{item.count}件</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${item.resolvedRate}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-600">{item.resolvedRate}% 解決</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 未解決課題 */}
        <div className="card p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <span>🚨</span>
              <span>未解決課題（要対応）</span>
            </h2>
            <span className="text-sm text-gray-600">{unresolvedIssues.length}件の未解決質問</span>
          </div>
          <div className="space-y-3">
            {unresolvedIssues.map((issue) => (
              <div key={issue.id} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {issue.urgency === 'high' && (
                        <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded">
                          緊急
                        </span>
                      )}
                      {issue.urgency === 'medium' && (
                        <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded">
                          注意
                        </span>
                      )}
                      <Link href={`/qa-questions/${issue.id}`} className="font-medium text-gray-900 hover:text-blue-600">
                        {issue.title}
                      </Link>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>投稿日: {issue.postedDate}</span>
                      <span>閲覧数: {issue.views}</span>
                      <span className="text-orange-600 font-semibold">未回答</span>
                    </div>
                  </div>
                  <button className="btn-secondary text-sm ml-4">
                    対応する
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 自動提示精度分析 */}
        <div className="card p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span>📈</span>
            <span>工程別 自動提示精度分析</span>
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            各作業工程で提示された情報の活用率と精度を表示しています
          </p>
          <div className="space-y-4">
            {accuracyData.map((item, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold text-gray-900">{item.phase}</p>
                    <p className="text-xs text-gray-500">{item.usage}回の提示</p>
                  </div>
                  <span className={`text-2xl font-bold ${item.accuracy >= 85 ? 'text-green-600' : 'text-orange-600'}`}>
                    {item.accuracy}%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${item.accuracy >= 85 ? 'bg-green-500' : 'bg-orange-500'}`}
                      style={{ width: `${item.accuracy}%` }}
                    />
                  </div>
                </div>
                {item.accuracy < 85 && (
                  <p className="text-xs text-orange-600 mt-2">
                    ⚠️ 目標精度（85%）未達 - 改善が必要です
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
