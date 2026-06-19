'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { useLanguage } from '@/app/lib/i18n/LanguageProvider'

function NewQuestionPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { t } = useLanguage()
  const sessionId = searchParams.get('sessionId')

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    vehicleModel: '',
    modelYear: '',
    dtc: '',
    symptom: '',
    category: 'diagnosis',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const categories = [
    { value: 'diagnosis', label: t('newQuestion.catDiagnosis') },
    { value: 'repair', label: t('newQuestion.catRepair') },
    { value: 'parts', label: t('newQuestion.catParts') },
    { value: 'electrical', label: t('newQuestion.catElectrical') },
    { value: 'engine', label: t('newQuestion.catEngine') },
    { value: 'transmission', label: t('newQuestion.catTransmission') },
    { value: 'other', label: t('newQuestion.catOther') },
  ]

  const examples = [
    { title: t('newQuestion.example1Title'), body: t('newQuestion.example1Body') },
    { title: t('newQuestion.example2Title'), body: t('newQuestion.example2Body') },
    { title: t('newQuestion.example3Title'), body: t('newQuestion.example3Body') },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    setTimeout(() => {
      alert(t('newQuestion.success'))
      setIsSubmitting(false)
      if (sessionId) {
        router.push(`/work-sessions/${sessionId}`)
      } else {
        router.push('/')
      }
    }, 2000)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
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
        <span>{t('newQuestion.breadcrumb')}</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-3">{t('newQuestion.title')}</h1>
        <p className="text-gray-600">{t('newQuestion.subtitle')}</p>
      </div>

      <div className="bg-blue-50 border-l-4 border-secondary rounded-lg p-6 mb-6">
        <h3 className="font-semibold mb-2">{t('newQuestion.beforeAsk')}</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>{t('newQuestion.tip1')}</li>
          <li>{t('newQuestion.tip2')}</li>
          <li>{t('newQuestion.tip3')}</li>
          <li>{t('newQuestion.tip4')}</li>
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="card p-6">
        <div className="mb-6">
          <label htmlFor="category" className="block text-sm font-medium mb-2">
            {t('newQuestion.category')} <span className="text-warning">*</span>
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            required
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            {t('newQuestion.titleLabel')} <span className="text-warning">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder={t('newQuestion.titlePlaceholder')}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            required
            maxLength={100}
          />
          <div className="text-xs text-gray-500 mt-1">
            {t('newQuestion.charCount', { count: String(formData.title.length) })}
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="content" className="block text-sm font-medium mb-2">
            {t('newQuestion.contentLabel')} <span className="text-warning">*</span>
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder={t('newQuestion.contentPlaceholder')}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            rows={8}
            required
          />
          <div className="text-xs text-gray-500 mt-1">{t('newQuestion.contentHint')}</div>
        </div>

        <div className="border-t pt-6 mb-6">
          <h3 className="font-semibold mb-4">{t('newQuestion.vehicleSection')}</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="vehicleModel" className="block text-sm font-medium mb-2">
                {t('newQuestion.vehicleModel')}
              </label>
              <input
                type="text"
                id="vehicleModel"
                name="vehicleModel"
                value={formData.vehicleModel}
                onChange={handleChange}
                placeholder={t('newQuestion.vehiclePlaceholder')}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label htmlFor="modelYear" className="block text-sm font-medium mb-2">
                {t('newQuestion.modelYear')}
              </label>
              <input
                type="text"
                id="modelYear"
                name="modelYear"
                value={formData.modelYear}
                onChange={handleChange}
                placeholder={t('newQuestion.yearPlaceholder')}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label htmlFor="dtc" className="block text-sm font-medium mb-2">
                {t('newQuestion.dtc')}
              </label>
              <input
                type="text"
                id="dtc"
                name="dtc"
                value={formData.dtc}
                onChange={handleChange}
                placeholder={t('newQuestion.dtcPlaceholder')}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label htmlFor="symptom" className="block text-sm font-medium mb-2">
                {t('newQuestion.symptom')}
              </label>
              <input
                type="text"
                id="symptom"
                name="symptom"
                value={formData.symptom}
                onChange={handleChange}
                placeholder={t('newQuestion.symptomPlaceholder')}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
          <h3 className="font-semibold mb-2 text-yellow-900">{t('newQuestion.confirmTitle')}</h3>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>{t('newQuestion.confirm1')}</li>
            <li>{t('newQuestion.confirm2')}</li>
            <li>{t('newQuestion.confirm3')}</li>
          </ul>
        </div>

        <div className="flex justify-between items-center">
          <Link href={sessionId ? `/work-sessions/${sessionId}` : '/'}>
            <button type="button" className="btn-secondary" disabled={isSubmitting}>
              {t('common.cancel')}
            </button>
          </Link>
          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting || !formData.title || !formData.content}
          >
            {isSubmitting ? t('newQuestion.submitting') : t('newQuestion.submit')}
          </button>
        </div>
      </form>

      <div className="mt-8 card p-6">
        <h3 className="font-semibold mb-4">{t('newQuestion.examplesTitle')}</h3>
        <div className="space-y-3 text-sm">
          {examples.map((example) => (
            <div key={example.title} className="p-3 bg-gray-50 rounded">
              <div className="font-medium mb-1">{example.title}</div>
              <div className="text-gray-600">{example.body}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function NewQuestionPageFallback() {
  const { t } = useLanguage()
  return (
    <div className="container mx-auto px-4 py-8 text-center text-gray-500">
      {t('common.loading')}
    </div>
  )
}

export default function NewQuestionPage() {
  return (
    <Suspense fallback={<NewQuestionPageFallback />}>
      <NewQuestionPageContent />
    </Suspense>
  )
}
