import { Warning } from '@/app/lib/mock-data'

interface WarningListProps {
  warnings: Warning[]
}

export default function WarningList({ warnings }: WarningListProps) {
  const getSeverityLabel = (severity: 'high' | 'medium' | 'low') => {
    switch (severity) {
      case 'high':
        return '【重要】'
      case 'medium':
        return '【注意】'
      case 'low':
        return '【参考】'
    }
  }

  return (
    <div className="space-y-4">
      {warnings.map((warning) => (
        <div
          key={warning.id}
          className={`border-l-4 rounded-lg p-4 ${
            warning.severity === 'high'
              ? 'bg-red-50 border-warning text-warning'
              : warning.severity === 'medium'
              ? 'bg-yellow-50 border-yellow-500 text-yellow-800'
              : 'bg-blue-50 border-blue-500 text-blue-800'
          }`}
        >
          <p className="font-medium">
            <span className="mr-2">{getSeverityLabel(warning.severity)}</span>
            {warning.message}
          </p>
        </div>
      ))}
    </div>
  )
}
