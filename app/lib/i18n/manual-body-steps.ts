import { Locale } from './types'
import { ManualDetail } from '@/app/lib/workflow-content'

export type ManualContentType = ManualDetail['contentType']

interface StepSection {
  title: string
  items?: string[]
  custom?: 'inspection-checklist' | 'report-template' | 'diagnosis-verdict'
}

interface ManualStepsContent {
  partsTitle: string
  parts?: { label: string; value: string }[]
  sections: StepSection[]
  note?: string
  tipsTitle?: string
  tips?: string[]
}

const manualSteps: Record<Locale, Record<ManualContentType, ManualStepsContent>> = {
  ja: {
    diagnosis: {
      partsTitle: '必要な部品・工具',
      parts: [
        { label: 'DGS（診断機）', value: '必須' },
        { label: 'マルチメーター', value: '必須' },
      ],
      sections: [
        {
          title: 'ステップ 1: 基本診断',
          items: [
            'DGS（診断機）を接続し、DTCを確認',
            'フリーズフレームデータを記録',
            '現在の症状を確認',
          ],
        },
        {
          title: 'ステップ 2: O2センサー点検',
          items: [
            'O2センサーの配線を目視点検',
            'センサーのコネクタ接続を確認',
            'センサーの抵抗値を測定（仕様値: 4-14Ω）',
          ],
        },
        {
          title: 'ステップ 3: 触媒効率確認',
          items: [
            'アイドリング時のデータモニターで前後O2センサー電圧を確認',
            '2500rpm時の電圧変化を記録',
            '触媒前後の温度差を確認（仕様値: 50℃以上）',
          ],
        },
        { title: 'ステップ 4: 判定と対策', custom: 'diagnosis-verdict' },
      ],
    },
    repair: {
      partsTitle: '必要な部品・工具',
      parts: [
        { label: 'O2センサー', value: '部品表参照' },
        { label: 'トルクレンチ', value: '55Nm' },
        { label: 'アンチシーズ', value: '必須' },
      ],
      sections: [
        {
          title: 'ステップ 1: 作業準備',
          items: [
            'イグニッションOFF、バッテリー端子の取り外し（必要に応じて）',
            'エキゾーストパイプの冷却を確認',
            '必要工具: トルクレンチ、O2センサーソケット、アンチシーズ',
          ],
        },
        {
          title: 'ステップ 2: O2センサー脱着',
          items: [
            'コネクタを外し、配線の状態を確認',
            'センサーを反時計回りに取り外し',
            '新品センサーのネジ部にアンチシーズを薄く塗布',
            '締付トルク 55Nm を厳守して取り付け',
          ],
        },
        {
          title: 'ステップ 3: 作業完了',
          items: [
            'コネクタを確実に接続',
            'DTCをクリアし、警告灯消灯を確認',
            '次工程（電子制御・校正）へ進む',
          ],
        },
      ],
    },
    calibration: {
      partsTitle: '',
      sections: [
        {
          title: 'ステップ 1: 学習値リセット',
          items: [
            'スキャンツールを接続',
            'O2センサー学習値のリセットを実行',
            'DTCが再設定されていないか確認',
          ],
        },
        {
          title: 'ステップ 2: アイドル学習',
          items: [
            'エンジンを暖機後、アイドリング状態で約10分待機',
            '学習中はエンジンを停止しない',
            'データモニターでセンサー出力が安定するか確認',
          ],
        },
        {
          title: 'ステップ 3: 試運転確認',
          items: [
            '市街地走行でセンサー応答を確認',
            '警告灯が再点灯しないことを確認',
          ],
        },
      ],
    },
    inspection: {
      partsTitle: '',
      sections: [{ title: '完了検査チェックリスト', custom: 'inspection-checklist' }],
      note: '⚠️ 試運転は暖機後に実施してください',
    },
    report: {
      partsTitle: '',
      sections: [
        { title: '説明の3つのポイント', custom: 'report-template' },
        { title: '説明テンプレート例', custom: 'report-template' },
      ],
      tipsTitle: '💡 説明のコツ',
      tips: [
        '• 専門用語は避け、わかりやすい言葉で説明する',
        '• 作業前後の写真を見せると理解度が向上する',
        '• 見積もり時の説明と作業後の説明を一致させる',
      ],
    },
  },
  en: {
    diagnosis: {
      partsTitle: 'Required Parts & Tools',
      parts: [
        { label: 'DGS (scan tool)', value: 'Required' },
        { label: 'Multimeter', value: 'Required' },
      ],
      sections: [
        {
          title: 'Step 1: Basic Diagnosis',
          items: [
            'Connect DGS (scan tool) and check DTCs',
            'Record freeze frame data',
            'Verify current symptoms',
          ],
        },
        {
          title: 'Step 2: O2 Sensor Inspection',
          items: [
            'Visually inspect O2 sensor wiring',
            'Verify sensor connector is fully seated',
            'Measure sensor resistance (spec: 4-14Ω)',
          ],
        },
        {
          title: 'Step 3: Catalyst Efficiency Check',
          items: [
            'Check front/rear O2 sensor voltage on data monitor at idle',
            'Record voltage change at 2500 rpm',
            'Verify pre/post catalyst temperature difference (spec: 50°C or more)',
          ],
        },
        { title: 'Step 4: Judgment & Action', custom: 'diagnosis-verdict' },
      ],
    },
    repair: {
      partsTitle: 'Required Parts & Tools',
      parts: [
        { label: 'O2 Sensor', value: 'See parts catalog' },
        { label: 'Torque wrench', value: '55Nm' },
        { label: 'Anti-seize', value: 'Required' },
      ],
      sections: [
        {
          title: 'Step 1: Preparation',
          items: [
            'Ignition OFF; disconnect battery terminals if needed',
            'Confirm exhaust pipe has cooled',
            'Required tools: torque wrench, O2 sensor socket, anti-seize',
          ],
        },
        {
          title: 'Step 2: O2 Sensor Removal/Installation',
          items: [
            'Disconnect connector and inspect wiring condition',
            'Remove sensor counterclockwise',
            'Apply a thin coat of anti-seize to new sensor threads',
            'Install with torque 55Nm strictly observed',
          ],
        },
        {
          title: 'Step 3: Completion',
          items: [
            'Ensure connector is fully seated',
            'Clear DTCs and confirm warning lamp is off',
            'Proceed to next phase (electronic control / calibration)',
          ],
        },
      ],
    },
    calibration: {
      partsTitle: '',
      sections: [
        {
          title: 'Step 1: Reset Learning Values',
          items: [
            'Connect scan tool',
            'Execute O2 sensor learning value reset',
            'Confirm DTCs have not reappeared',
          ],
        },
        {
          title: 'Step 2: Idle Learning',
          items: [
            'After warm-up, idle approximately 10 minutes',
            'Do not stop engine during learning',
            'Verify sensor output stabilizes on data monitor',
          ],
        },
        {
          title: 'Step 3: Test Drive Verification',
          items: [
            'Verify sensor response during city driving',
            'Confirm warning lamp does not re-illuminate',
          ],
        },
      ],
    },
    inspection: {
      partsTitle: '',
      sections: [{ title: 'Final Inspection Checklist', custom: 'inspection-checklist' }],
      note: '⚠️ Perform test drive after warm-up',
    },
    report: {
      partsTitle: '',
      sections: [
        { title: 'Three Key Explanation Points', custom: 'report-template' },
        { title: 'Explanation Template Example', custom: 'report-template' },
      ],
      tipsTitle: '💡 Explanation Tips',
      tips: [
        '• Avoid jargon; use plain language',
        '• Before/after photos improve customer understanding',
        '• Match estimate explanation with post-work explanation',
      ],
    },
  },
}

export function getManualSteps(contentType: ManualContentType, locale: Locale) {
  return manualSteps[locale][contentType]
}

export function getInspectionChecklist(locale: Locale): string[] {
  return locale === 'en'
    ? [
        'No DTC recurrence (verify with scan tool)',
        'O2 sensor output within normal range',
        'No abnormal noise or odor during test drive',
        'Work record and replaced parts documented',
      ]
    : [
        'DTCが再発していないか（スキャンツールで確認）',
        'O2センサー出力が正常範囲内か',
        '試運転で異音・異臭がないか',
        '作業記録・交換部品を記録したか',
      ]
}

export function getReportContent(
  locale: Locale,
  vehicle: string,
  dtc: string
): {
  points: { title: string; text: string }[]
  template: { heading: string; body: string }[]
  tips: string[]
} {
  if (locale === 'en') {
    return {
      points: [
        {
          title: 'What was done',
          text: 'Work performed (e.g. O2 sensor replacement)',
        },
        {
          title: 'Why it was needed',
          text: 'Root cause and risks if left unrepaired',
        },
        {
          title: 'Future precautions',
          text: 'Importance of regular inspection and what to do if symptoms return',
        },
      ],
      template: [
        {
          heading: 'Work Performed',
          body: `For your ${vehicle}, investigation of the engine warning lamp (${dtc}) confirmed degradation of the O2 sensor that monitors exhaust gases. The O2 sensor was replaced with a new unit.`,
        },
        {
          heading: 'Why Replacement Was Needed',
          body: 'If the sensor does not function properly, catalyst condition cannot be monitored correctly, which may affect combustion efficiency and emissions. Early replacement helps maintain safe, comfortable driving.',
        },
        {
          heading: 'Going Forward',
          body: 'Regular inspections help detect similar issues early. Please contact us promptly if the warning lamp comes on again.',
        },
      ],
      tips: manualSteps.en.report.tips ?? [],
    }
  }

  return {
    points: [
      { title: '何をしたか', text: '実施した作業内容（例: O2センサー交換）' },
      { title: 'なぜ必要だったか', text: '故障の原因と放置した場合のリスク' },
      { title: '今後の注意点', text: '定期点検の重要性、異常時の対応' },
    ],
    template: [
      {
        heading: '【作業内容】',
        body: `お客様の${vehicle}について、エンジン警告灯（${dtc}）の原因調査の結果、排気ガスを監視するO2センサーの劣化が確認されました。そのため、O2センサーを新品に交換いたしました。`,
      },
      {
        heading: '【交換が必要だった理由】',
        body: 'センサーが正常に機能しないと、触媒の状態を正しく監視できず、エンジンの燃焼効率や排ガス性能に影響が出る可能性があります。早期の交換により、安全かつ快適な走行を維持できます。',
      },
      {
        heading: '【今後のお願い】',
        body: '定期的な点検をお受けいただくことで、同様の不具合を早期に発見できます。警告灯が再点灯した場合は、早めにご連絡ください。',
      },
    ],
    tips: manualSteps.ja.report.tips ?? [],
  }
}

export function getDiagnosisVerdict(locale: Locale): { ok: string; ng: string } {
  return locale === 'en'
    ? {
        ok: 'Investigate other causes (e.g. air leaks)',
        ng: 'Consider O2 sensor or catalyst replacement',
      }
    : {
        ok: '他の原因を調査（エアリークなど）',
        ng: 'O2センサーまたは触媒の交換を検討',
      }
}
