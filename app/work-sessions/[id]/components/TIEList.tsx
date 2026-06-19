'use client'

import Link from 'next/link'
import { TIE } from '@/app/lib/mock-data'
import { useLanguage } from '@/app/lib/i18n/LanguageProvider'

interface TIEListProps {
  ties: TIE[]
}

export default function TIEList({ ties }: TIEListProps) {
  const { t } = useLanguage()

  if (ties.length === 0) {
    return (
      <div className="card p-6 text-center text-gray-500">
        {t('tie.noResults')}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {ties.map((tie) => (
        <div key={tie.id} className="card p-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">{tie.title}</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-gray-700">{t('tie.symptom')}:</span>{' '}
                  <span className="text-gray-600">{tie.symptom}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">{t('tie.solution')}:</span>{' '}
                  <span className="text-gray-600">{tie.solution}</span>
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-500 mt-3">
                <span>{t('tie.relevance')}: </span>
                <div className="ml-2 flex">
                  {Array.from({ length: 5 }, (_, i) => (
                    <svg
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.round(tie.relevanceScore * 5)
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
                <span className="ml-2">({tie.relevanceScore.toFixed(2)})</span>
              </div>
            </div>
            <Link href={tie.url}>
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
