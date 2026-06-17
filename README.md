# e-library Next

自動車整備情報を「探すをなくす」システム

## 概要

e-library Nextは、整備士のワークフローに基づいて必要な情報を自動的に提供する次世代整備情報システムです。従来の検索型ではなく、作業の各工程に応じて最適な情報（マニュアル、TIE事例、Q&A）を自動表示します。

## 主な機能

- **ワークフロー連動情報提供**: 診断・計画・実施・検証の各工程で必要な情報を自動表示
- **AI情報検索**: Claude APIを活用したセマンティック検索とAI要約
- **車両情報連動**: 選択した車種・年式に基づいた情報のフィルタリング
- **リアルタイム情報推薦**: 作業コンテキストに応じた動的な情報提示

## 技術スタック

- **フロントエンド**: Next.js 15 (App Router), React 19, TypeScript 5, Tailwind CSS 3
- **AI**: Claude 3.5 Sonnet (Anthropic API)
- **データベース** (予定): Neon (PostgreSQL + pgvector)
- **認証** (予定): Supabase Auth
- **デプロイ** (予定): Vercel

## セットアップ

### 1. リポジトリのクローン

\`\`\`bash
git clone <repository-url>
cd e-library
\`\`\`

### 2. 依存関係のインストール

\`\`\`bash
npm install
\`\`\`

### 3. 環境変数の設定

\`.env.local\`ファイルを作成し、以下を設定します：

\`\`\`bash
# Anthropic API Key
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Optional: Model selection (default: claude-3-5-sonnet-20241022)
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022
\`\`\`

**Anthropic API Keyの取得方法**:
1. [Anthropic Console](https://console.anthropic.com/)にアクセス
2. アカウントを作成またはログイン
3. API Keysセクションから新しいキーを作成
4. 作成されたキーを\`.env.local\`に設定

### 4. 開発サーバーの起動

\`\`\`bash
npm run dev
\`\`\`

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## 使い方

### 1. 作業セッションの開始

1. トップページから「作業を開始する」をクリック
2. 車種、年式、症状、DTCを入力
3. 作業セッション画面に遷移

### 2. 自動情報表示

作業セッション画面では、入力した車両情報と現在の工程に基づいて、以下の情報が自動的に表示されます：

- **AIアシスト**: 作業のガイダンスと診断のポイント
- **公式マニュアル**: メーカー公式の診断手順
- **TIE事例**: 同じ症状の修理事例
- **Q&A**: 現場の整備士による質問・回答
- **注意事項**: 作業上の重要な注意点

### 3. AI情報検索

自動表示された情報で不足がある場合：

1. 「🔍 AIで情報を検索」をクリック
2. キーワードを入力して検索
3. AI要約と関連情報が表示されます
4. 車種・年式でフィルタリング可能

## プロジェクト構造

\`\`\`
e-library/
├── app/
│   ├── api/
│   │   └── search/          # AI検索API
│   ├── components/
│   │   └── layout/          # 共通レイアウトコンポーネント
│   ├── work-sessions/       # 作業セッション関連ページ
│   ├── manuals/             # マニュアル詳細ページ
│   ├── ties/                # TIE事例詳細ページ
│   ├── qa-questions/        # Q&A詳細ページ
│   ├── search/              # AI検索ページ
│   └── lib/
│       ├── mock-data.ts     # モックデータ
│       └── utils.ts         # ユーティリティ関数
├── docs/
│   ├── design/              # 設計ドキュメント
│   └── output/              # 要件定義書など
└── prompt/                  # AI生成用プロンプト
\`\`\`

## 開発ロードマップ

### Phase 1: PoC（現在）
- ✅ 基本UI/UX実装
- ✅ Claude API統合
- ✅ モックデータでの動作確認

### Phase 2: MVP開発
- [ ] Neon/Supabase統合
- [ ] ベクトル検索実装
- [ ] 認証機能
- [ ] ユーザーフィードバック機能

### Phase 3: 本格展開
- [ ] 実データ投入
- [ ] パフォーマンス最適化
- [ ] モバイル対応強化

## ライセンス

プロプライエタリ

## お問い合わせ

プロジェクトに関するお問い合わせは、開発チームまでご連絡ください。
