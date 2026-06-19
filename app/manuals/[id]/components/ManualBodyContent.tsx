'use client'

import { ManualDetail, SessionContext } from '@/app/lib/workflow-content'
import { useLanguage } from '@/app/lib/i18n/LanguageProvider'
import {
  getDiagnosisVerdict,
  getInspectionChecklist,
  getManualSteps,
  getReportContent,
} from '@/app/lib/i18n/manual-body-steps'

interface ManualBodyContentProps {
  manual: ManualDetail
  sessionContext: SessionContext
}

function StepBlock({
  title,
  children,
  borderColor = 'border-primary',
}: {
  title: string
  children: React.ReactNode
  borderColor?: string
}) {
  return (
    <div className={`border-l-4 ${borderColor} pl-4`}>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      {children}
    </div>
  )
}

export default function ManualBodyContent({ manual, sessionContext }: ManualBodyContentProps) {
  const { locale } = useLanguage()
  const dtc = sessionContext.dtc || 'P0420'
  const yearSuffix = locale === 'ja' ? '年' : ''
  const vehicle = `${sessionContext.vehicleModel} ${sessionContext.modelYear}${yearSuffix}`

  const sectionTitle = {
    ja: {
      diagnosis: '診断フローチャート',
      repair: '整備手順',
      calibration: '校正手順',
      inspection: '完了検査チェックリスト',
      report: '顧客説明テンプレート',
    },
    en: {
      diagnosis: 'Diagnostic Flowchart',
      repair: 'Service Procedure',
      calibration: 'Calibration Procedure',
      inspection: 'Final Inspection Checklist',
      report: 'Customer Explanation Template',
    },
  }[locale][manual.contentType]

  const stepsContent = getManualSteps(manual.contentType, locale)
  const verdict = getDiagnosisVerdict(locale)
  const checklist = getInspectionChecklist(locale)
  const reportContent = getReportContent(locale, vehicle, dtc)

  const renderSection = (section: (typeof stepsContent.sections)[0], index: number) => {
    if (section.custom === 'inspection-checklist') {
      return (
        <StepBlock key={section.title} title={section.title}>
          <ul className="space-y-3 text-gray-700">
            {checklist.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-green-600 font-bold">☐</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </StepBlock>
      )
    }

    if (section.custom === 'diagnosis-verdict') {
      return (
        <StepBlock key={section.title} title={section.title}>
          <div className="bg-gray-50 rounded p-4 space-y-3 text-gray-700">
            <div>
              <span className="font-semibold">OK: </span>
              {verdict.ok}
            </div>
            <div>
              <span className="font-semibold">NG: </span>
              {verdict.ng}
            </div>
          </div>
        </StepBlock>
      )
    }

    if (section.custom === 'report-template') {
      if (index === 0) {
        return (
          <StepBlock key={section.title} title={section.title} borderColor="border-purple-500">
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              {reportContent.points.map((point) => (
                <li key={point.title}>
                  <strong>{point.title}</strong> — {point.text}
                </li>
              ))}
            </ol>
          </StepBlock>
        )
      }
      return (
        <StepBlock key={section.title} title={section.title} borderColor="border-purple-500">
          <div className="bg-gray-50 rounded-lg p-4 space-y-4 text-sm text-gray-700">
            {reportContent.template.map((block) => (
              <div key={block.heading}>
                <p className="font-semibold text-gray-900 mb-1">{block.heading}</p>
                <p>{block.body}</p>
              </div>
            ))}
          </div>
        </StepBlock>
      )
    }

    return (
      <StepBlock key={section.title} title={section.title}>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          {section.items?.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </StepBlock>
    )
  }

  return (
    <>
      {manual.body && <p className="text-gray-700 mb-6">{manual.body}</p>}
      <h2 className="text-xl font-bold mb-4">{sectionTitle}</h2>
      <div className="space-y-6">
        {stepsContent.sections.map((section, index) => renderSection(section, index))}
        {stepsContent.note && (
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3">
            <p className="text-sm text-yellow-800">{stepsContent.note}</p>
          </div>
        )}
        {stepsContent.parts && stepsContent.parts.length > 0 && (
          <div className="mt-8 bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold mb-3">{stepsContent.partsTitle}</h3>
            <ul className="space-y-2 text-sm">
              {stepsContent.parts.map((part) => (
                <li key={part.label}>
                  <span className="font-medium w-32 inline-block">{part.label}</span>
                  <span className="text-gray-600">{part.value}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {stepsContent.tips && stepsContent.tips.length > 0 && (
          <div className="mt-6 bg-purple-50 rounded-lg p-4">
            <h3 className="font-semibold mb-2">{stepsContent.tipsTitle}</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              {stepsContent.tips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  )
}
