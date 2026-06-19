'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/app/lib/i18n/LanguageProvider'
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
  const { t } = useLanguage()
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
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
      <div className="text-center mb-12">
        <Link href="/work-sessions/new">
          <button className="btn-primary text-lg py-4 px-12 mb-3">
            {t('home.startWork')}
          </button>
        </Link>
        <p className="text-sm text-gray-600">{t('home.startWorkDesc')}</p>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">{t('home.quickAccess')}</h2>
        <div className={`grid grid-cols-1 ${currentUser?.role === 'manufacturer' ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4`}>
          <Link href="/search" className="card p-6 hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-3">🔍</div>
            <h3 className="font-bold text-lg mb-2">{t('home.aiSearch')}</h3>
            <p className="text-sm text-gray-600">{t('home.aiSearchDesc')}</p>
          </Link>
          
          <Link href="/qa-questions/new" className="card p-6 hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-3">💬</div>
            <h3 className="font-bold text-lg mb-2">{t('home.postQuestion')}</h3>
            <p className="text-sm text-gray-600">{t('home.postQuestionDesc')}</p>
          </Link>
          
          {currentUser?.role === 'manufacturer' && (
            <Link href="/analytics" className="card p-6 hover:shadow-lg transition-shadow bg-blue-50 border-2 border-blue-200">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="font-bold text-lg mb-2 text-blue-900">{t('home.analytics')}</h3>
              <p className="text-sm text-blue-700">{t('home.analyticsDesc')}</p>
            </Link>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">{t('home.activeSessions')}</h2>
        
        {activeSessions.length === 0 ? (
          <div className="card p-6 text-center text-gray-500">
            {t('home.noActiveSessions')}
          </div>
        ) : (
          <div className="space-y-4">
            {activeSessions.map((session) => (
              <div key={session.id} className="card p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">{t('home.vehicle')}:</span> {session.vehicleModel} | 
                      <span className="ml-2"><span className="font-medium">{t('home.modelYear')}:</span> {session.modelYear}</span>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">{t('home.symptom')}:</span> {session.symptom || t('common.notEntered')}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">{t('home.phase')}:</span> {t(`phase.${session.currentPhase as 'diagnosis'}`)}
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">{t('home.elapsed')}:</span> {formatElapsedTime(session.startedAt)}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Link href={`/work-sessions/${session.id}`}>
                    <button className="btn-secondary">{t('home.continueWork')}</button>
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
