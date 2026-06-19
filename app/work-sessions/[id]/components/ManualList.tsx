'use client'

import Link from 'next/link'
import { Manual } from '@/app/lib/mock-data'
import { useLanguage } from '@/app/lib/i18n/LanguageProvider'

interface ManualListProps {
  manuals: Manual[]
}

export default function ManualList({ manuals }: ManualListProps) {
  const { t } = useLanguage()

  if (manuals.length === 0) {
    return (
      <div className="card p-6 text-center text-gray-500">
        {t('search.noResults')}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {manuals.map((manual) => (
        <div key={manual.id} className="card p-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">{manual.title}</h3>
              <p className="text-sm text-gray-600 mb-2">
                {t('manual.section')}: {manual.section}
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <span>{t('search.relevance')}: </span>
                <div className="ml-2 flex">
                  {Array.from({ length: 5 }, (_, i) => (
                    <svg
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.round(manual.relevanceScore * 5)
                          ? 'text-accent'
                          : 'text-gray-300'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-2">({manual.relevanceScore.toFixed(2)})</span>
              </div>
            </div>
            <Link href={manual.url}>
              <button className="btn-secondary ml-4">
                {t('common.viewDetails')}
              </button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
