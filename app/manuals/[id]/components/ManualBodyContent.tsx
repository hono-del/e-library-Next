import { ManualDetail, SessionContext } from '@/app/lib/workflow-content'

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
  const dtc = sessionContext.dtc || 'P0420'
  const vehicle = `${sessionContext.vehicleModel} ${sessionContext.modelYear}年`

  const sectionTitle = {
    diagnosis: '診断フローチャート',
    repair: '整備手順',
    calibration: '校正手順',
    inspection: '完了検査チェックリスト',
    report: '顧客説明テンプレート',
  }[manual.contentType]

  const renderSteps = () => {
    switch (manual.contentType) {
      case 'repair':
        return (
          <>
            <StepBlock title="ステップ 1: 作業準備">
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>イグニッションOFF、バッテリー端子の取り外し（必要に応じて）</li>
                <li>エキゾーストパイプの冷却を確認</li>
                <li>必要工具: トルクレンチ、O2センサーソケット、アンチシーズ</li>
              </ul>
            </StepBlock>
            <StepBlock title="ステップ 2: O2センサー脱着">
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>コネクタを外し、配線の状態を確認</li>
                <li>センサーを反時計回りに取り外し</li>
                <li>新品センサーのネジ部にアンチシーズを薄く塗布</li>
                <li>締付トルク <strong>55Nm</strong> を厳守して取り付け</li>
              </ul>
            </StepBlock>
            <StepBlock title="ステップ 3: 作業完了">
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>コネクタを確実に接続</li>
                <li>DTCをクリアし、警告灯消灯を確認</li>
                <li>次工程（電子制御・校正）へ進む</li>
              </ul>
            </StepBlock>
            <div className="mt-8 bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold mb-3">必要な部品・工具</h3>
              <ul className="space-y-2 text-sm">
                <li><span className="font-medium w-32 inline-block">O2センサー</span><span className="text-gray-600">部品表参照</span></li>
                <li><span className="font-medium w-32 inline-block">トルクレンチ</span><span className="text-gray-600">55Nm</span></li>
                <li><span className="font-medium w-32 inline-block">アンチシーズ</span><span className="text-gray-600">必須</span></li>
              </ul>
            </div>
          </>
        )

      case 'calibration':
        return (
          <>
            <StepBlock title="ステップ 1: 学習値リセット">
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>スキャンツールを接続</li>
                <li>O2センサー学習値のリセットを実行</li>
                <li>DTCが再設定されていないか確認</li>
              </ul>
            </StepBlock>
            <StepBlock title="ステップ 2: アイドル学習">
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>エンジンを暖機後、アイドリング状態で約10分待機</li>
                <li>学習中はエンジンを停止しない</li>
                <li>データモニターでセンサー出力が安定するか確認</li>
              </ul>
            </StepBlock>
            <StepBlock title="ステップ 3: 試運転確認">
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>市街地走行でセンサー応答を確認</li>
                <li>警告灯が再点灯しないことを確認</li>
              </ul>
            </StepBlock>
          </>
        )

      case 'inspection':
        return (
          <>
            <StepBlock title="完了検査チェックリスト">
              <ul className="space-y-3 text-gray-700">
                {[
                  'DTCが再発していないか（スキャンツールで確認）',
                  'O2センサー出力が正常範囲内か',
                  '試運転で異音・異臭がないか',
                  '作業記録・交換部品を記録したか',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">☐</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </StepBlock>
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3">
              <p className="text-sm text-yellow-800">
                ⚠️ 試運転は暖機後に実施してください
              </p>
            </div>
          </>
        )

      case 'report':
        return (
          <>
            <StepBlock title="説明の3つのポイント" borderColor="border-purple-500">
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li><strong>何をしたか</strong> — 実施した作業内容（例: O2センサー交換）</li>
                <li><strong>なぜ必要だったか</strong> — 故障の原因と放置した場合のリスク</li>
                <li><strong>今後の注意点</strong> — 定期点検の重要性、異常時の対応</li>
              </ol>
            </StepBlock>
            <StepBlock title="説明テンプレート例" borderColor="border-purple-500">
              <div className="bg-gray-50 rounded-lg p-4 space-y-4 text-sm text-gray-700">
                <div>
                  <p className="font-semibold text-gray-900 mb-1">【作業内容】</p>
                  <p>
                    お客様の{vehicle}について、エンジン警告灯（{dtc}）の原因調査の結果、
                    排気ガスを監視するO2センサーの劣化が確認されました。
                    そのため、O2センサーを新品に交換いたしました。
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">【交換が必要だった理由】</p>
                  <p>
                    センサーが正常に機能しないと、触媒の状態を正しく監視できず、
                    エンジンの燃焼効率や排ガス性能に影響が出る可能性があります。
                    早期の交換により、安全かつ快適な走行を維持できます。
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">【今後のお願い】</p>
                  <p>
                    定期的な点検をお受けいただくことで、同様の不具合を早期に発見できます。
                    警告灯が再点灯した場合は、早めにご連絡ください。
                  </p>
                </div>
              </div>
            </StepBlock>
            <div className="mt-6 bg-purple-50 rounded-lg p-4">
              <h3 className="font-semibold mb-2">💡 説明のコツ</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• 専門用語は避け、わかりやすい言葉で説明する</li>
                <li>• 作業前後の写真を見せると理解度が向上する</li>
                <li>• 見積もり時の説明と作業後の説明を一致させる</li>
              </ul>
            </div>
          </>
        )

      default:
        return (
          <>
            <StepBlock title="ステップ 1: 基本診断">
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>DGS（診断機）を接続し、DTCを確認</li>
                <li>フリーズフレームデータを記録</li>
                <li>現在の症状を確認</li>
              </ul>
            </StepBlock>
            <StepBlock title="ステップ 2: O2センサー点検">
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>O2センサーの配線を目視点検</li>
                <li>センサーのコネクタ接続を確認</li>
                <li>センサーの抵抗値を測定（仕様値: 4-14Ω）</li>
              </ul>
            </StepBlock>
            <StepBlock title="ステップ 3: 触媒効率確認">
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>アイドリング時のデータモニターで前後O2センサー電圧を確認</li>
                <li>2500rpm時の電圧変化を記録</li>
                <li>触媒前後の温度差を確認（仕様値: 50℃以上）</li>
              </ul>
            </StepBlock>
            <StepBlock title="ステップ 4: 判定と対策">
              <div className="bg-gray-50 rounded p-4 space-y-3 text-gray-700">
                <div><span className="font-semibold">OK: </span>他の原因を調査（エアリークなど）</div>
                <div><span className="font-semibold">NG: </span>O2センサーまたは触媒の交換を検討</div>
              </div>
            </StepBlock>
            <div className="mt-8 bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold mb-3">必要な部品・工具</h3>
              <ul className="space-y-2 text-sm">
                <li><span className="w-32 font-medium inline-block">DGS（診断機）</span><span className="text-gray-600">必須</span></li>
                <li><span className="w-32 font-medium inline-block">マルチメーター</span><span className="text-gray-600">必須</span></li>
              </ul>
            </div>
          </>
        )
    }
  }

  return (
    <>
      {manual.body && (
        <p className="text-gray-700 mb-6">{manual.body}</p>
      )}
      <h2 className="text-xl font-bold mb-4">{sectionTitle}</h2>
      <div className="space-y-6">{renderSteps()}</div>
    </>
  )
}
