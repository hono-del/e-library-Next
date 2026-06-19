'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/app/lib/i18n/LanguageProvider'

const SAMPLE_ACCOUNTS = [
  {
    id: '1',
    email: 'mechanic@example.com',
    password: 'mechanic123',
    name: '佐藤健太',
    role: 'mechanic',
    dealer: 'サンプルディーラー',
  },
  {
    id: '2',
    email: 'manufacturer@example.com',
    password: 'manufacturer123',
    name: '田中花子',
    role: 'manufacturer',
    dealer: 'サンプル自動車株式会社',
  },
]

export default function LoginPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const user = SAMPLE_ACCOUNTS.find(
      (account) => account.email === email && account.password === password
    )

    if (user) {
      sessionStorage.setItem('currentUser', JSON.stringify({
        ...user,
        roleLabel: t(`roles.${user.role}`),
      }))
      setTimeout(() => {
        router.push('/')
      }, 500)
    } else {
      setIsLoading(false)
      setError(t('login.error'))
    }
  }

  const handleQuickLogin = (account: typeof SAMPLE_ACCOUNTS[0]) => {
    setEmail(account.email)
    setPassword(account.password)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">e-library Next</h1>
          <p className="text-gray-600">{t('login.subtitle')}</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold mb-6 text-center">{t('login.title')}</h2>

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                {t('login.email')}
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="user@example.com"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                {t('login.password')}
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? t('login.submitting') : t('login.submit')}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="font-bold mb-4 text-center text-gray-700">
            {t('login.demoAccounts')}
          </h3>
          <div className="space-y-3">
            {SAMPLE_ACCOUNTS.map((account) => (
              <button
                key={account.id}
                onClick={() => handleQuickLogin(account)}
                className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors text-left"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900">{account.name}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    account.role === 'manufacturer' 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {t(`roles.${account.role}`)}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mb-1">{account.email}</div>
                <div className="text-xs text-gray-500">
                  {t('login.passwordLabel')}: {account.password}
                </div>
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 text-center mt-4">
            {t('login.demoHint')}
          </p>
        </div>
      </div>
    </div>
  )
}
