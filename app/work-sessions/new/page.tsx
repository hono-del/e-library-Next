'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLanguage } from '@/app/lib/i18n/LanguageProvider'
import { Locale } from '@/app/lib/i18n/types'

const COMMON_DTC_CODES: Record<Locale, { code: string; description: string }[]> = {
  ja: [
    { code: 'P0420', description: '触媒効率低下' },
    { code: 'P0171', description: 'システム燃料調整リーン' },
    { code: 'P0172', description: 'システム燃料調整リッチ' },
    { code: 'P0300', description: 'ランダム失火検出' },
    { code: 'P0301', description: '第1気筒失火検出' },
    { code: 'P0302', description: '第2気筒失火検出' },
    { code: 'P0303', description: '第3気筒失火検出' },
    { code: 'P0304', description: '第4気筒失火検出' },
    { code: 'P0128', description: 'エンジン冷却水温度低下' },
    { code: 'P0401', description: 'EGR流量不足' },
    { code: 'P0442', description: 'EVAP系統小リーク検出' },
    { code: 'P0455', description: 'EVAP系統大リーク検出' },
    { code: 'P0100', description: 'エアフローセンサー異常' },
    { code: 'P0335', description: 'クランク角センサー異常' },
    { code: 'P0340', description: 'カム角センサー異常' },
    { code: 'P0505', description: 'アイドル回転数制御異常' },
    { code: 'P0562', description: 'バッテリー電圧低下' },
    { code: 'P0850', description: 'パーク/ニュートラルスイッチ異常' },
    { code: 'U0100', description: 'ECM通信異常' },
    { code: 'C1201', description: 'ECU異常' },
  ],
  en: [
    { code: 'P0420', description: 'Catalyst efficiency below threshold' },
    { code: 'P0171', description: 'System too lean' },
    { code: 'P0172', description: 'System too rich' },
    { code: 'P0300', description: 'Random misfire detected' },
    { code: 'P0301', description: 'Cylinder 1 misfire detected' },
    { code: 'P0302', description: 'Cylinder 2 misfire detected' },
    { code: 'P0303', description: 'Cylinder 3 misfire detected' },
    { code: 'P0304', description: 'Cylinder 4 misfire detected' },
    { code: 'P0128', description: 'Coolant temperature below thermostat' },
    { code: 'P0401', description: 'EGR flow insufficient' },
    { code: 'P0442', description: 'EVAP small leak detected' },
    { code: 'P0455', description: 'EVAP large leak detected' },
    { code: 'P0100', description: 'Mass airflow sensor malfunction' },
    { code: 'P0335', description: 'Crankshaft position sensor malfunction' },
    { code: 'P0340', description: 'Camshaft position sensor malfunction' },
    { code: 'P0505', description: 'Idle control system malfunction' },
    { code: 'P0562', description: 'System voltage low' },
    { code: 'P0850', description: 'Park/Neutral switch malfunction' },
    { code: 'U0100', description: 'ECM communication malfunction' },
    { code: 'C1201', description: 'ECU malfunction' },
  ],
}

export default function NewWorkSession() {
  const router = useRouter()
  const { t, locale } = useLanguage()
  const dtcCodes = COMMON_DTC_CODES[locale]
  const [formData, setFormData] = useState({
    vehicleModel: '',
    modelYear: '',
    vin: '',
    symptom: '',
    dtc: [] as string[],
  })
  const [dtcInput, setDtcInput] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newErrors: Record<string, string> = {}
    if (!formData.vehicleModel) {
      newErrors.vehicleModel = t('newSession.errorVehicle')
    }
    if (!formData.modelYear) {
      newErrors.modelYear = t('newSession.errorYear')
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('currentWorkSession', JSON.stringify({
        id: '1',
        vehicleModel: formData.vehicleModel,
        modelYear: formData.modelYear,
        vin: formData.vin || null,
        symptom: formData.symptom || null,
        dtc: formData.dtc,
        currentPhase: 'diagnosis',
        currentWorkflowPhaseId: 'diagnosis',
        status: 'in_progress',
        startedAt: new Date().toISOString(),
      }))
    }
    
    router.push('/work-sessions/1')
  }

  const addDTC = () => {
    if (dtcInput && !formData.dtc.includes(dtcInput)) {
      const selectedDTC = dtcCodes.find(d => d.code === dtcInput)
      const dtcLabel = selectedDTC ? `${selectedDTC.code} (${selectedDTC.description})` : dtcInput
      setFormData({
        ...formData,
        dtc: [...formData.dtc, dtcLabel],
      })
      setDtcInput('')
    }
  }

  const removeDTC = (dtc: string) => {
    setFormData({
      ...formData,
      dtc: formData.dtc.filter((d) => d !== dtc),
    })
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-2">{t('newSession.title')}</h1>
      <p className="text-gray-600 mb-6">{t('newSession.subtitle')}</p>

      <form onSubmit={handleSubmit} className="card p-6">
        <div className="mb-6">
          <label htmlFor="vehicleModel" className="block text-sm font-medium mb-2">
            {t('newSession.vehicleModel')} <span className="text-warning">*</span>
          </label>
          <select
            id="vehicleModel"
            value={formData.vehicleModel}
            onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">{t('common.select')}</option>
            <option value="Model A">Model A</option>
            <option value="Model B">Model B</option>
            <option value="Model C">Model C</option>
          </select>
          {errors.vehicleModel && (
            <p className="text-warning text-sm mt-1">{errors.vehicleModel}</p>
          )}
        </div>

        <div className="mb-6">
          <label htmlFor="modelYear" className="block text-sm font-medium mb-2">
            {t('newSession.modelYear')} <span className="text-warning">*</span>
          </label>
          <select
            id="modelYear"
            value={formData.modelYear}
            onChange={(e) => setFormData({ ...formData, modelYear: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">{t('common.select')}</option>
            {Array.from({ length: 11 }, (_, i) => 2024 - i).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          {errors.modelYear && (
            <p className="text-warning text-sm mt-1">{errors.modelYear}</p>
          )}
        </div>

        <div className="mb-6">
          <label htmlFor="vin" className="block text-sm font-medium mb-2">
            {t('newSession.vin')}
          </label>
          <input
            type="text"
            id="vin"
            value={formData.vin}
            onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
            placeholder={t('newSession.vinPlaceholder')}
            maxLength={17}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="symptom" className="block text-sm font-medium mb-2">
            {t('newSession.symptom')}
          </label>
          <textarea
            id="symptom"
            value={formData.symptom}
            onChange={(e) => setFormData({ ...formData, symptom: e.target.value })}
            placeholder={t('newSession.symptomPlaceholder')}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="dtc" className="block text-sm font-medium mb-2">
            {t('newSession.dtc')}
          </label>
          <div className="flex space-x-2 mb-2">
            <select
              id="dtc"
              value={dtcInput}
              onChange={(e) => setDtcInput(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">{t('common.select')}</option>
              {dtcCodes.map((dtc) => (
                <option key={dtc.code} value={dtc.code}>
                  {dtc.code} - {dtc.description}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={addDTC}
              disabled={!dtcInput}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('common.add')}
            </button>
          </div>
          {formData.dtc.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.dtc.map((dtc) => (
                <span
                  key={dtc}
                  className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {dtc}
                  <button
                    type="button"
                    onClick={() => removeDTC(dtc)}
                    className="ml-2 text-blue-600 hover:text-blue-800 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <Link href="/">
            <button type="button" className="btn-secondary">
              {t('common.cancel')}
            </button>
          </Link>
          <button type="submit" className="btn-primary">
            {t('newSession.start')}
          </button>
        </div>
      </form>
    </div>
  )
}
