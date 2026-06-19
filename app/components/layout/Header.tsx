'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/app/lib/i18n/LanguageProvider'
import LanguageToggle from './LanguageToggle'

interface User {
  id: string
  name: string
  role: string
  roleLabel: string
  email: string
  dealer: string
}

export default function Header() {
  const router = useRouter()
  const { t } = useLanguage()
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
    const userStr = sessionStorage.getItem('currentUser')
    if (userStr) {
      try {
        setCurrentUser(JSON.parse(userStr))
      } catch (error) {
        console.error('Failed to parse user data:', error)
      }
    }
  }, [])

  const handleLogout = () => {
    sessionStorage.removeItem('currentUser')
    sessionStorage.removeItem('currentWorkSession')
    router.push('/login')
  }

  const isManufacturer = currentUser?.role === 'manufacturer'

  return (
    <header className="bg-primary text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <h1 className="text-xl font-bold">e-library Next</h1>
          </Link>
          
          <nav className="flex items-center space-x-6">
            <Link href="/" className="text-sm hover:text-gray-200 transition-colors">
              {t('header.home')}
            </Link>
            <Link href="/search" className="text-sm hover:text-gray-200 transition-colors">
              {t('header.search')}
            </Link>
            {isManufacturer && (
              <Link href="/analytics" className="text-sm hover:text-gray-200 transition-colors">
                {t('header.analytics')}
              </Link>
            )}
            <LanguageToggle />
            <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-blue-400">
              <div className="text-right">
                <div className="text-sm font-semibold">{currentUser?.name || t('common.guest')}</div>
                <div className="text-xs text-blue-200">
                  {currentUser ? t(`roles.${currentUser.role}`) : ''}
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="text-sm hover:text-gray-200 transition-colors"
              >
                {t('header.logout')}
              </button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
