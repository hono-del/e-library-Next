'use client'

import { useLanguage } from '@/app/lib/i18n/LanguageProvider'
import { Locale } from '@/app/lib/i18n/types'

export default function LanguageToggle() {
  const { locale, setLocale } = useLanguage()

  const toggle = () => setLocale(locale === 'ja' ? 'en' : 'ja')

  return (
    <button
      onClick={toggle}
      className="text-sm px-3 py-1 rounded-full border border-blue-300 hover:bg-blue-600 transition-colors"
      aria-label="Switch language"
    >
      {locale === 'ja' ? 'EN' : 'JA'}
    </button>
  )
}

export function useLocale(): Locale {
  return useLanguage().locale
}
