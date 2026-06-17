import { WorkSession } from '@/app/lib/mock-data'
import { PHASE_LABELS } from '@/app/lib/utils'

interface WorkSessionHeaderProps {
  session: WorkSession
}

export default function WorkSessionHeader({ session }: WorkSessionHeaderProps) {
  // 経過時間の計算（簡易版）
  const elapsedMinutes = Math.floor((Date.now() - session.startedAt.getTime()) / 60000)
  const hours = Math.floor(elapsedMinutes / 60)
  const minutes = elapsedMinutes % 60
  const elapsedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`

  return (
    <div className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span>
              <span className="font-medium">車種:</span> {session.vehicleModel}
            </span>
            <span className="text-gray-300">|</span>
            <span>
              <span className="font-medium">年式:</span> {session.modelYear}
            </span>
            {session.vin && (
              <>
                <span className="text-gray-300">|</span>
                <span>
                  <span className="font-medium">VIN:</span> {session.vin}
                </span>
              </>
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span>
              <span className="font-medium">工程:</span> {PHASE_LABELS[session.currentPhase]}
            </span>
            <span className="text-gray-300">|</span>
            <span>
              <span className="font-medium">経過時間:</span> {elapsedTime}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
