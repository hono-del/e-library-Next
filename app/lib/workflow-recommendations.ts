import { WorkSession } from '@/app/lib/mock-data'
import { getCurrentWorkflowPhaseId } from '@/app/lib/utils'
import { Locale } from '@/app/lib/i18n/types'

export function getDynamicRecommendations(session: WorkSession, locale: Locale) {
  const dtcText = session.dtc.length > 0 ? session.dtc[0] : 'P0420'
  const vehicleInfo = `${session.vehicleModel} ${session.modelYear}${locale === 'ja' ? '年' : ''}`
  const currentWorkflowPhaseId = session.currentWorkflowPhaseId ?? getCurrentWorkflowPhaseId(session.currentPhase)

  if (locale === 'en') {
    return getEnglishRecommendations(dtcText, vehicleInfo, currentWorkflowPhaseId)
  }
  return getJapaneseRecommendations(dtcText, vehicleInfo, currentWorkflowPhaseId)
}

function getJapaneseRecommendations(dtcText: string, vehicleInfo: string, phaseId: string) {
  switch (phaseId) {
    case 'diagnosis':
      return {
        aiSummary: `このDTC ${dtcText} は、触媒効率低下を示しています。診断手順：1. スキャンツールでフリーズフレームデータを確認、2. O2センサーの波形を測定、3. 触媒前後のO2センサー出力を比較`,
        manuals: [
          { id: 'manual-diag-1', title: `診断マニュアル: ${dtcText} - 診断フローチャート`, section: '故障診断 / DTC診断手順', url: '/manuals/manual-diag-1', pdfUrl: '#', relevanceScore: 0.98 },
          { id: 'manual-diag-2', title: `${vehicleInfo} O2センサー診断手順`, section: '故障診断 / センサー診断', url: '/manuals/manual-diag-2', pdfUrl: '#', relevanceScore: 0.92 },
        ],
        ties: [{ id: 'tie-diag-1', title: `${vehicleInfo} ${dtcText}診断事例`, symptom: '触媒効率警告灯点灯、診断で原因特定', solution: 'O2センサー波形測定で異常を確認、センサー不良と判断', url: '/ties/tie-diag-1', relevanceScore: 0.9 }],
        qaQuestions: [{ id: 'qa-diag-1', title: `${dtcText}の診断方法を教えてください`, bestAnswer: 'まずスキャンツールでフリーズフレームを確認し、O2センサーの電圧波形を測定します', url: '/qa-questions/qa-diag-1', relevanceScore: 0.88 }],
        warnings: [
          { id: 'warning-diag-1', message: '⚠️ 診断前に必ずイグニッションOFFを確認してください', severity: 'high' as const },
          { id: 'warning-diag-2', message: '⚠️ スキャンツール接続時はバッテリー電圧を確認してください', severity: 'medium' as const },
        ],
      }
    case 'repair':
      return {
        aiSummary: `${dtcText} の修理手順：1. O2センサーを取り外す（締付トルク：55Nm）、2. 新品センサーを取り付け、3. コネクタを確実に接続、4. DTCをクリア`,
        manuals: [
          { id: 'manual-repair-1', title: '整備マニュアル: O2センサー交換手順', section: '整備手順 / センサー交換', url: '/manuals/manual-repair-1', pdfUrl: '#', relevanceScore: 0.97 },
          { id: 'manual-repair-2', title: `${vehicleInfo} 部品交換トルク値一覧`, section: '整備手順 / 締付トルク', url: '/manuals/manual-repair-2', pdfUrl: '#', relevanceScore: 0.93 },
        ],
        ties: [{ id: 'tie-repair-1', title: `${vehicleInfo} O2センサー交換事例`, symptom: 'O2センサー不良による触媒効率低下', solution: 'O2センサーを交換、正常に復旧', url: '/ties/tie-repair-1', relevanceScore: 0.91 }],
        qaQuestions: [{ id: 'qa-repair-1', title: 'O2センサー交換時の注意点は？', bestAnswer: '締付トルクを厳守し、センサーネジ部にアンチシーズを塗布してください', url: '/qa-questions/qa-repair-1', relevanceScore: 0.89 }],
        warnings: [
          { id: 'warning-repair-1', message: '⚠️ O2センサー交換時はトルク値 55Nmを厳守してください', severity: 'high' as const },
          { id: 'warning-repair-2', message: '⚠️ エキゾーストパイプが熱い場合は冷却してから作業してください', severity: 'high' as const },
        ],
      }
    case 'calibration':
      return {
        aiSummary: 'O2センサー交換後の校正手順：1. スキャンツールでO2センサー学習値をリセット、2. アイドル状態で学習を実施、3. 試運転で学習完了を確認',
        manuals: [{ id: 'manual-cal-1', title: '校正マニュアル: O2センサー学習手順', section: '電子制御 / センサー学習', url: '/manuals/manual-cal-1', pdfUrl: '#', relevanceScore: 0.96 }],
        ties: [{ id: 'tie-cal-1', title: `${vehicleInfo} O2センサー学習事例`, symptom: 'センサー交換後も警告灯が消えない', solution: '学習を実施して正常化', url: '/ties/tie-cal-1', relevanceScore: 0.87 }],
        qaQuestions: [{ id: 'qa-cal-1', title: 'O2センサー学習の方法は？', bestAnswer: 'スキャンツールから学習値リセット後、アイドル10分で学習完了します', url: '/qa-questions/qa-cal-1', relevanceScore: 0.85 }],
        warnings: [{ id: 'warning-cal-1', message: '⚠️ 学習中はエンジンを停止しないでください', severity: 'high' as const }],
      }
    case 'final-inspection':
      return {
        aiSummary: '作業完了後の検査項目：1. DTCが再発していないか確認、2. O2センサー出力が正常範囲内か確認、3. 試運転で異常がないか確認',
        manuals: [{ id: 'manual-inspect-1', title: '検査マニュアル: 完了検査チェックリスト', section: '完了検査 / 検査項目', url: '/manuals/manual-inspect-1', pdfUrl: '#', relevanceScore: 0.94 }],
        ties: [{ id: 'tie-inspect-1', title: `${vehicleInfo} 作業後検査事例`, symptom: '検査漏れによる再入庫', solution: '完了検査を徹底することで再発防止', url: '/ties/tie-inspect-1', relevanceScore: 0.83 }],
        qaQuestions: [{ id: 'qa-inspect-1', title: '完了検査で確認すべき項目は？', bestAnswer: 'DTC再発確認、センサー出力確認、試運転の3つは必須です', url: '/qa-questions/qa-inspect-1', relevanceScore: 0.81 }],
        warnings: [{ id: 'warning-inspect-1', message: '⚠️ 試運転は暖機後に実施してください', severity: 'medium' as const }],
      }
    case 'customer-report':
      return {
        aiSummary: '顧客説明のポイント：1. どの部品を交換したか、2. なぜ交換が必要だったか、3. 今後の注意点（定期点検の重要性など）',
        manuals: [{ id: 'manual-report-1', title: '顧客説明マニュアル: 説明テンプレート集', section: '顧客対応 / 説明資料', url: '/manuals/manual-report-1', pdfUrl: '#', relevanceScore: 0.92 }],
        ties: [{ id: 'tie-report-1', title: '顧客説明の好事例', symptom: '顧客満足度向上の取り組み', solution: '写真付き説明資料で理解度向上', url: '/ties/tie-report-1', relevanceScore: 0.8 }],
        qaQuestions: [{ id: 'qa-report-1', title: '顧客への説明で注意すべきことは？', bestAnswer: '専門用語を避け、写真を使って分かりやすく説明することが重要です', url: '/qa-questions/qa-report-1', relevanceScore: 0.78 }],
        warnings: [{ id: 'warning-report-1', message: '💡 作業前後の写真を撮影しておくと説明がスムーズです', severity: 'medium' as const }],
      }
    default:
      return { aiSummary: `DTC ${dtcText} の診断手順を確認してください。`, manuals: [], ties: [], qaQuestions: [], warnings: [] }
  }
}

function getEnglishRecommendations(dtcText: string, vehicleInfo: string, phaseId: string) {
  switch (phaseId) {
    case 'diagnosis':
      return {
        aiSummary: `DTC ${dtcText} indicates catalyst efficiency below threshold. Diagnosis steps: 1. Check freeze frame data with scan tool, 2. Measure O2 sensor waveform, 3. Compare pre/post catalyst O2 sensor output`,
        manuals: [
          { id: 'manual-diag-1', title: `Diagnostic Manual: ${dtcText} - Diagnostic Flowchart`, section: 'Fault Diagnosis / DTC Procedure', url: '/manuals/manual-diag-1', pdfUrl: '#', relevanceScore: 0.98 },
          { id: 'manual-diag-2', title: `${vehicleInfo} O2 Sensor Diagnosis`, section: 'Fault Diagnosis / Sensor Diagnosis', url: '/manuals/manual-diag-2', pdfUrl: '#', relevanceScore: 0.92 },
        ],
        ties: [{ id: 'tie-diag-1', title: `${vehicleInfo} ${dtcText} Diagnosis Case`, symptom: 'Catalyst efficiency warning lamp, cause identified', solution: 'O2 sensor waveform abnormal, sensor failure confirmed', url: '/ties/tie-diag-1', relevanceScore: 0.9 }],
        qaQuestions: [{ id: 'qa-diag-1', title: `How to diagnose ${dtcText}?`, bestAnswer: 'First check freeze frame with scan tool, then measure O2 sensor voltage waveform', url: '/qa-questions/qa-diag-1', relevanceScore: 0.88 }],
        warnings: [
          { id: 'warning-diag-1', message: '⚠️ Confirm ignition OFF before diagnosis', severity: 'high' as const },
          { id: 'warning-diag-2', message: '⚠️ Check battery voltage when connecting scan tool', severity: 'medium' as const },
        ],
      }
    case 'repair':
      return {
        aiSummary: `${dtcText} repair procedure: 1. Remove O2 sensor (torque: 55Nm), 2. Install new sensor, 3. Secure connector, 4. Clear DTC`,
        manuals: [
          { id: 'manual-repair-1', title: 'Service Manual: O2 Sensor Replacement', section: 'Repair / Sensor Replacement', url: '/manuals/manual-repair-1', pdfUrl: '#', relevanceScore: 0.97 },
          { id: 'manual-repair-2', title: `${vehicleInfo} Torque Specifications`, section: 'Repair / Torque Values', url: '/manuals/manual-repair-2', pdfUrl: '#', relevanceScore: 0.93 },
        ],
        ties: [{ id: 'tie-repair-1', title: `${vehicleInfo} O2 Sensor Replacement Case`, symptom: 'Catalyst efficiency drop due to O2 sensor failure', solution: 'Replaced O2 sensor, restored to normal', url: '/ties/tie-repair-1', relevanceScore: 0.91 }],
        qaQuestions: [{ id: 'qa-repair-1', title: 'O2 sensor replacement precautions?', bestAnswer: 'Follow torque spec and apply anti-seize to sensor threads', url: '/qa-questions/qa-repair-1', relevanceScore: 0.89 }],
        warnings: [
          { id: 'warning-repair-1', message: '⚠️ O2 sensor torque must be 55Nm', severity: 'high' as const },
          { id: 'warning-repair-2', message: '⚠️ Allow exhaust pipe to cool before work', severity: 'high' as const },
        ],
      }
    case 'calibration':
      return {
        aiSummary: 'Post-replacement calibration: 1. Reset O2 sensor learning with scan tool, 2. Idle learning, 3. Verify with test drive',
        manuals: [{ id: 'manual-cal-1', title: 'Calibration Manual: O2 Sensor Learning', section: 'Electronic Control / Sensor Learning', url: '/manuals/manual-cal-1', pdfUrl: '#', relevanceScore: 0.96 }],
        ties: [{ id: 'tie-cal-1', title: `${vehicleInfo} O2 Sensor Learning Case`, symptom: 'Warning lamp remains after sensor replacement', solution: 'Performed learning procedure successfully', url: '/ties/tie-cal-1', relevanceScore: 0.87 }],
        qaQuestions: [{ id: 'qa-cal-1', title: 'How to perform O2 sensor learning?', bestAnswer: 'Reset learning values via scan tool, idle 10 minutes to complete', url: '/qa-questions/qa-cal-1', relevanceScore: 0.85 }],
        warnings: [{ id: 'warning-cal-1', message: '⚠️ Do not stop engine during learning', severity: 'high' as const }],
      }
    case 'final-inspection':
      return {
        aiSummary: 'Final inspection: 1. Confirm no DTC recurrence, 2. Verify O2 sensor output, 3. Test drive check',
        manuals: [{ id: 'manual-inspect-1', title: 'Inspection Manual: Final Checklist', section: 'Final Inspection / Check Items', url: '/manuals/manual-inspect-1', pdfUrl: '#', relevanceScore: 0.94 }],
        ties: [{ id: 'tie-inspect-1', title: `${vehicleInfo} Post-Work Inspection Case`, symptom: 'Return visit due to missed inspection', solution: 'Thorough final inspection prevents recurrence', url: '/ties/tie-inspect-1', relevanceScore: 0.83 }],
        qaQuestions: [{ id: 'qa-inspect-1', title: 'Final inspection checklist items?', bestAnswer: 'DTC check, sensor output check, and test drive are mandatory', url: '/qa-questions/qa-inspect-1', relevanceScore: 0.81 }],
        warnings: [{ id: 'warning-inspect-1', message: '⚠️ Perform test drive after warm-up', severity: 'medium' as const }],
      }
    case 'customer-report':
      return {
        aiSummary: 'Customer explanation points: 1. What was replaced, 2. Why it was needed, 3. Future maintenance notes',
        manuals: [{ id: 'manual-report-1', title: 'Customer Explanation Templates', section: 'Customer Service / Explanation Materials', url: '/manuals/manual-report-1', pdfUrl: '#', relevanceScore: 0.92 }],
        ties: [{ id: 'tie-report-1', title: 'Best Practice: Customer Explanation', symptom: 'Customer satisfaction improvement', solution: 'Photo-based explanation improves understanding', url: '/ties/tie-report-1', relevanceScore: 0.8 }],
        qaQuestions: [{ id: 'qa-report-1', title: 'Customer explanation tips?', bestAnswer: 'Avoid jargon and use photos for clarity', url: '/qa-questions/qa-report-1', relevanceScore: 0.78 }],
        warnings: [{ id: 'warning-report-1', message: '💡 Take before/after photos for smoother explanation', severity: 'medium' as const }],
      }
    default:
      return { aiSummary: `Please review diagnosis procedure for DTC ${dtcText}.`, manuals: [], ties: [], qaQuestions: [], warnings: [] }
  }
}
