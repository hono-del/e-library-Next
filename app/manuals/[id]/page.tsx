'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { mockRecommendations } from '@/app/lib/mock-data'
import { getSearchDocuments } from '@/app/lib/search-data'
import { getWorkflowManual, SessionContext } from '@/app/lib/workflow-content'
import { useLanguage } from '@/app/lib/i18n/LanguageProvider'
import ManualBodyContent from './components/ManualBodyContent'

export default function ManualDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { t, locale } = useLanguage()
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
  
  const workflowManual = getWorkflowManual(id, sessionContext, locale)
  const manualFromRecsItem = Object.values(mockRecommendations)
    .flatMap((rec) => rec.manuals)
    .find((m) => m.id === id)
  const manualFromRecs = manualFromRecsItem
    ? { ...manualFromRecsItem, contentType: 'diagnosis' as const, body: '' }
    : null
  const manualFromSearch = getSearchDocuments(locale).find((m) => m.type === 'manual' && m.id === id)
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

  const yearSuffix = locale === 'ja' ? t('common.year') : ''

  if (!manual) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="card p-6 text-center">
          <p className="text-gray-500">{t('manual.notFound')}</p>
          <Link href="/">
            <button className="btn-secondary mt-4">{t('common.backToTop')}</button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <nav className="mb-6 text-sm text-gray-600">
        <Link href="/" className="hover:text-primary">{t('manual.breadcrumbTop')}</Link>
        <span className="mx-2">/</span>
        <Link href="/work-sessions/1" className="hover:text-primary">{t('manual.breadcrumbSession')}</Link>
        <span className="mx-2">/</span>
        <span>{t('manual.breadcrumbManual')}</span>
      </nav>

      <div className="card p-6 mb-6">
        <div className="mb-4">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
            {t('manual.official')}
          </span>
        </div>
        <h1 className="text-2xl font-bold mb-3">{manual.title}</h1>
        <div className="flex flex-wrap items-center text-sm text-gray-600 gap-x-4 gap-y-1">
          <div>
            <span className="font-medium">{t('manual.vehicle')}:</span>{' '}
            {sessionContext.vehicleModel} {sessionContext.modelYear}{yearSuffix}
          </div>
          <div>
            <span className="font-medium">{t('manual.section')}:</span> {manual.section}
          </div>
          <div>
            <span className="font-medium">{t('manual.relevance')}:</span> {Math.round(manual.relevanceScore * 100)}%
          </div>
        </div>
      </div>

      <div className="card p-6 mb-6">
        <ManualBodyContent manual={manual} sessionContext={sessionContext} />
      </div>

      <div className="flex justify-between items-center">
        <Link href="/work-sessions/1">
          <button className="btn-secondary">{t('common.backToWork')}</button>
        </Link>
        <button onClick={() => window.print()} className="btn-outline">
          {t('common.print')}
        </button>
      </div>
    </div>
  )
}
