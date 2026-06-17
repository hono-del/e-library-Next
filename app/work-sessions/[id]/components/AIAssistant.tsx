import { WorkSession } from '@/app/lib/mock-data'
import { PHASE_LABELS, Phase } from '@/app/lib/utils'

interface AIAssistantProps {
  summary: string
  session: WorkSession
}

export default function AIAssistant({ summary, session }: AIAssistantProps) {
  return (
    <div className="bg-blue-50 border-l-4 border-secondary rounded-lg p-6 mb-8">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg
            className="h-6 w-6 text-secondary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
        </div>
        <div className="ml-4 flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">AIアシスト</h3>
          
          {/* 判断根拠を追加 */}
          <div className="bg-white rounded-lg p-3 mb-4 text-sm border border-blue-100">
            <div className="font-medium text-gray-900 mb-2">以下の情報から判断しています：</div>
            <div className="space-y-1 text-gray-700">
              <div>• 車両: {session.vehicleModel} {session.modelYear}年</div>
              <div>• DTC: {session.dtc.length > 0 ? session.dtc.join(', ') : 'なし'}</div>
              <div>• 工程: {PHASE_LABELS[session.currentPhase]}</div>
            </div>
          </div>
          
          <p className="text-gray-700 whitespace-pre-line leading-relaxed">{summary}</p>
        </div>
      </div>
    </div>
  )
}
