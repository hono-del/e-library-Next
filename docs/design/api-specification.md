# API仕様書

**プロジェクト**: e-library Next  
**バージョン**: 1.1  
**作成日**: 2026年6月17日  
**最終更新日**: 2026年6月17日  

---

## 目次

1. [概要](#1-概要)
2. [設計原則](#2-設計原則)
3. [認証・認可](#3-認証・認可)
4. [エンドポイント一覧](#4-エンドポイント一覧)
5. [作業セッションAPI](#5-作業セッションapi)
6. [推薦情報API](#6-推薦情報api)
7. [マニュアルAPI](#7-マニュアルapi)
8. [TIE API](#8-tie-api)
9. [問題交流API](#9-問題交流api)
10. [検索API](#10-検索api)
11. [エラーハンドリング](#11-エラーハンドリング)
12. [レート制限](#12-レート制限)

---

## 1. 概要

e-library NextのAPIは、Next.js API Routesで実装され、RESTful設計原則に従います。フロントエンド（React）とバックエンド（Neon DB、OpenAI API）間の通信を仲介し、作業セッション管理、推薦情報取得、検索などの機能を提供します。

### 1.1 ベースURL

- **開発環境**: `http://localhost:3000/api`
- **本番環境**: `https://elibrary-next.vercel.app/api`

### 1.2 データフォーマット

- **リクエスト**: JSON形式（`Content-Type: application/json`）
- **レスポンス**: JSON形式
- **文字エンコーディング**: UTF-8
- **日時フォーマット**: ISO 8601（例: `2026-06-16T12:00:00Z`）

---

## 2. 設計原則

### 2.1 RESTful設計

- **リソースベース**: エンドポイントはリソース（work-sessions, manuals, tiesなど）を表す
- **HTTPメソッド**:
  - `GET`: リソースの取得
  - `POST`: リソースの作成
  - `PUT/PATCH`: リソースの更新
  - `DELETE`: リソースの削除
- **ステートレス**: 各リクエストは独立し、サーバー側でセッション状態を保持しない（JWTで認証）

### 2.2 命名規則

- **エンドポイント**: ケバブケース（例: `/work-sessions`, `/qa-questions`）
- **JSONキー**: スネークケース（例: `vehicle_model`, `model_year`）
- **HTTPステータスコード**:
  - `200 OK`: 成功（GET, PUT, PATCH）
  - `201 Created`: リソース作成成功（POST）
  - `204 No Content`: 成功、レスポンスなし（DELETE）
  - `400 Bad Request`: リクエストエラー
  - `401 Unauthorized`: 認証エラー
  - `403 Forbidden`: 権限エラー
  - `404 Not Found`: リソースが見つからない
  - `500 Internal Server Error`: サーバーエラー

---

## 3. 認証・認可

### 3.1 認証方式

**JWT（JSON Web Token）ベースの認証**

- Supabase Authでログイン時にJWTを発行
- クライアントは `Authorization` ヘッダーにJWTを含めてリクエスト

### 3.2 リクエストヘッダー

```http
GET /api/work-sessions HTTP/1.1
Host: elibrary-next.vercel.app
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

### 3.3 認可（アクセス制御）

- **Row Level Security（RLS）**: Neon DBのRLSにより、ユーザーは自分のディーラー・メーカーのデータのみアクセス可能
- **APIレベルのチェック**: Next.js Middlewareで認証チェック、API Routesで権限チェック

### 3.4 未認証アクセスのエラー

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "認証が必要です。ログインしてください。"
  }
}
```

---

## 4. エンドポイント一覧

| エンドポイント | HTTPメソッド | 説明 | 認証 |
|---|---|---|---|
| `/api/auth/login` | POST | ログイン | ✕ |
| `/api/auth/logout` | POST | ログアウト | ✓ |
| `/api/work-sessions` | GET | 作業セッション一覧取得 | ✓ |
| `/api/work-sessions` | POST | 作業セッション作成 | ✓ |
| `/api/work-sessions/[id]` | GET | 作業セッション詳細取得 | ✓ |
| `/api/work-sessions/[id]` | PATCH | 作業セッション更新 | ✓ |
| `/api/work-sessions/[id]/advance-phase` | POST | 工程を進める | ✓ |
| `/api/work-sessions/[id]/complete` | POST | 作業完了 | ✓ |
| `/api/work-sessions/[id]/recommendations` | GET | 推薦情報取得 | ✓ |
| `/api/manuals` | GET | マニュアル一覧取得 | ✓ |
| `/api/manuals/[id]` | GET | マニュアル詳細取得 | ✓ |
| `/api/ties` | GET | TIE一覧取得 | ✓ |
| `/api/ties/[id]` | GET | TIE詳細取得 | ✓ |
| `/api/ties` | POST | TIE作成 | ✓ |
| `/api/qa-questions` | GET | 質問一覧取得 | ✓ |
| `/api/qa-questions` | POST | 質問投稿 | ✓ |
| `/api/qa-questions/[id]` | GET | 質問詳細取得 | ✓ |
| `/api/qa-questions/[id]/answers` | POST | 回答投稿 | ✓ |
| `/api/search` | GET | AI検索 | ✓ |

---

## 5. 作業セッションAPI

### 5.1 作業セッション一覧取得

**エンドポイント:** `GET /api/work-sessions`

**説明:** ログインユーザーの作業セッション一覧を取得

**クエリパラメータ:**
- `status` (optional): ステータスでフィルタ（`in_progress`, `paused`, `completed`）
- `limit` (optional): 取得件数（デフォルト: 20、最大: 100）
- `offset` (optional): オフセット（ページネーション用）

**リクエスト例:**
```http
GET /api/work-sessions?status=in_progress&limit=10 HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**レスポンス（成功）:**
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "vehicle_model": "Model A",
      "model_year": 2024,
      "vin": "JN1XXXXXXXXXXXXX",
      "symptom": "エンジンチェックランプ点灯",
      "dtc": ["P0420", "P0300"],
      "current_phase": "diagnosis",
      "status": "in_progress",
      "started_at": "2026-06-16T12:00:00Z",
      "completed_at": null
    }
  ],
  "meta": {
    "total": 15,
    "limit": 10,
    "offset": 0
  }
}
```

---

### 5.2 作業セッション作成

**エンドポイント:** `POST /api/work-sessions`

**説明:** 新しい作業セッションを作成

**リクエストボディ:**
```json
{
  "vehicle_model": "Model A",
  "model_year": 2024,
  "vin": "JN1XXXXXXXXXXXXX",  // optional
  "symptom": "エンジンチェックランプ点灯",  // optional
  "dtc": ["P0420", "P0300"]  // optional
}
```

**バリデーション:**
- `vehicle_model`: 必須、TEXT
- `model_year`: 必須、2000〜現在年の範囲
- `vin`: 任意、17桁の英数字
- `dtc`: 任意、配列

**レスポンス（成功）: 201 Created**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "vehicle_model": "Model A",
  "model_year": 2024,
  "vin": "JN1XXXXXXXXXXXXX",
  "symptom": "エンジンチェックランプ点灯",
  "dtc": ["P0420", "P0300"],
  "current_phase": "intake",
  "status": "in_progress",
  "started_at": "2026-06-16T12:00:00Z",
  "completed_at": null
}
```

**レスポンス（エラー）: 400 Bad Request**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "車種を選択してください",
    "field": "vehicle_model"
  }
}
```

---

### 5.3 作業セッション詳細取得

**エンドポイント:** `GET /api/work-sessions/[id]`

**説明:** 指定した作業セッションの詳細を取得

**パスパラメータ:**
- `id`: 作業セッションID（UUID）

**レスポンス（成功）: 200 OK**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "vehicle_model": "Model A",
  "model_year": 2024,
  "vin": "JN1XXXXXXXXXXXXX",
  "symptom": "エンジンチェックランプ点灯",
  "dtc": ["P0420", "P0300"],
  "current_phase": "diagnosis",
  "status": "in_progress",
  "started_at": "2026-06-16T12:00:00Z",
  "completed_at": null,
  "user": {
    "id": "user-123",
    "name": "佐藤健太"
  }
}
```

**レスポンス（エラー）: 404 Not Found**
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "作業セッションが見つかりません"
  }
}
```

---

### 5.4 作業セッション更新

**エンドポイント:** `PATCH /api/work-sessions/[id]`

**説明:** 作業セッションの情報を更新

**リクエストボディ（更新したいフィールドのみ）:**
```json
{
  "symptom": "エンジンチェックランプ点灯、アイドリング不安定",
  "dtc": ["P0420", "P0300", "P0301"]
}
```

**レスポンス（成功）: 200 OK**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "vehicle_model": "Model A",
  "model_year": 2024,
  "symptom": "エンジンチェックランプ点灯、アイドリング不安定",
  "dtc": ["P0420", "P0300", "P0301"],
  "current_phase": "diagnosis",
  "status": "in_progress",
  "updated_at": "2026-06-16T12:15:00Z"
}
```

---

### 5.5 工程を進める

**エンドポイント:** `POST /api/work-sessions/[id]/advance-phase`

**説明:** 作業工程を次の段階に進める

**リクエストボディ:** なし

**レスポンス（成功）: 200 OK**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "current_phase": "planning",
  "updated_at": "2026-06-16T12:20:00Z"
}
```

**工程の順序:**
1. `intake` → 2. `diagnosis` → 3. `planning` → 4. `execution` → 5. `verification` → 6. `delivery`

---

### 5.6 作業完了

**エンドポイント:** `POST /api/work-sessions/[id]/complete`

**説明:** 作業セッションを完了する

**リクエストボディ:**
```json
{
  "feedback": {
    "auto_recommendations_helpful": true,
    "additional_info_searched": "O2センサーの交換手順",
    "rating": 5
  }
}
```

**レスポンス（成功）: 200 OK**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "completed",
  "completed_at": "2026-06-16T14:30:00Z"
}
```

---

## 6. 推薦情報API

### 6.1 推薦情報取得

**エンドポイント:** `GET /api/work-sessions/[id]/recommendations`

**説明:** 作業工程に応じた推薦情報（マニュアル、TIE、問題交流、注意事項）を取得

**クエリパラメータ:**
- `phase` (optional): 作業工程（デフォルト: 現在の工程）

**リクエスト例:**
```http
GET /api/work-sessions/550e8400-e29b-41d4-a716-446655440000/recommendations?phase=diagnosis HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**レスポンス（成功）: 200 OK**
```json
{
  "session_id": "550e8400-e29b-41d4-a716-446655440000",
  "phase": "diagnosis",
  "ai_summary": "このDTC P0420 は、触媒効率低下を示しています。まず以下を確認してください: 1. O2センサーの配線接続、2. センサーの動作確認、3. ECUとの通信状態",
  "manuals": [
    {
      "id": "manual-123",
      "title": "サービスマニュアル: P0420 - 触媒効率低下",
      "section": "エンジン / 排気系統",
      "url": "/api/manuals/manual-123",
      "pdf_url": "https://storage.supabase.co/manuals/manual-123.pdf",
      "relevance_score": 0.95
    }
  ],
  "ties": [
    {
      "id": "tie-456",
      "title": "Model A 2024年 P0420対応事例",
      "symptom": "触媒効率警告灯点灯",
      "solution": "O2センサー交換で解決",
      "url": "/api/ties/tie-456",
      "relevance_score": 0.88
    }
  ],
  "qa_questions": [
    {
      "id": "qa-789",
      "title": "P0420のよくある原因は？",
      "best_answer": "O2センサーの劣化が最も多い原因です",
      "url": "/api/qa-questions/qa-789",
      "relevance_score": 0.82
    }
  ],
  "warnings": [
    {
      "id": "warning-101",
      "message": "⚠️ 作業前に必ずイグニッションOFFを確認してください",
      "severity": "high"
    }
  ]
}
```

---

## 7. マニュアルAPI

### 7.1 マニュアル一覧取得

**エンドポイント:** `GET /api/manuals`

**クエリパラメータ:**
- `vehicle_model` (optional): 車種でフィルタ
- `model_year` (optional): 年式でフィルタ
- `manual_type` (optional): マニュアル種別でフィルタ
- `limit` (optional): 取得件数（デフォルト: 20）
- `offset` (optional): オフセット

**レスポンス（成功）: 200 OK**
```json
{
  "data": [
    {
      "id": "manual-123",
      "vehicle_model": "Model A",
      "model_year": 2024,
      "manual_type": "service_manual",
      "title": "サービスマニュアル: P0420 - 触媒効率低下",
      "section": "エンジン / 排気系統",
      "pdf_url": "https://storage.supabase.co/manuals/manual-123.pdf"
    }
  ],
  "meta": {
    "total": 50,
    "limit": 20,
    "offset": 0
  }
}
```

---

### 7.2 マニュアル詳細取得

**エンドポイント:** `GET /api/manuals/[id]`

**レスポンス（成功）: 200 OK**
```json
{
  "id": "manual-123",
  "vehicle_model": "Model A",
  "model_year": 2024,
  "manual_type": "service_manual",
  "title": "サービスマニュアル: P0420 - 触媒効率低下",
  "section": "エンジン / 排気系統",
  "content": "触媒効率低下の診断手順...",
  "pdf_url": "https://storage.supabase.co/manuals/manual-123.pdf",
  "related_dtc": ["P0420", "P0430"],
  "related_ties": [
    {
      "id": "tie-456",
      "title": "Model A 2024年 P0420対応事例"
    }
  ],
  "related_qa_questions": [
    {
      "id": "qa-789",
      "title": "P0420のよくある原因は？"
    }
  ]
}
```

---

## 8. TIE API

### 8.1 TIE一覧取得

**エンドポイント:** `GET /api/ties`

**クエリパラメータ:**
- `vehicle_model` (optional): 車種でフィルタ
- `model_year` (optional): 年式でフィルタ
- `approval_status` (optional): 承認ステータスでフィルタ（デフォルト: `approved`）

**レスポンス（成功）: 200 OK**
```json
{
  "data": [
    {
      "id": "tie-456",
      "title": "Model A 2024年 P0420対応事例",
      "vehicle_model": "Model A",
      "model_year": 2024,
      "symptom": "触媒効率警告灯点灯",
      "dtc": ["P0420"],
      "approval_status": "approved"
    }
  ],
  "meta": {
    "total": 30,
    "limit": 20,
    "offset": 0
  }
}
```

---

### 8.2 TIE詳細取得

**エンドポイント:** `GET /api/ties/[id]`

**レスポンス（成功）: 200 OK**
```json
{
  "id": "tie-456",
  "title": "Model A 2024年 P0420対応事例",
  "vehicle_model": "Model A",
  "model_year": 2024,
  "symptom": "触媒効率警告灯点灯、アイドリング時の異音",
  "dtc": ["P0420"],
  "cause": "O2センサーの劣化による触媒効率低下",
  "action": "O2センサーを交換、触媒の状態を確認",
  "approval_status": "approved",
  "approved_at": "2026-05-15T10:00:00Z",
  "approved_by": {
    "id": "user-456",
    "name": "山田裕子"
  }
}
```

---

### 8.3 TIE作成

**エンドポイント:** `POST /api/ties`

**リクエストボディ:**
```json
{
  "title": "Model B 2025年 P0300対応事例",
  "vehicle_model": "Model B",
  "model_year": 2025,
  "symptom": "ランダム失火、エンジン振動",
  "dtc": ["P0300"],
  "cause": "スパークプラグの劣化",
  "action": "スパークプラグを全気筒交換"
}
```

**レスポンス（成功）: 201 Created**
```json
{
  "id": "tie-789",
  "title": "Model B 2025年 P0300対応事例",
  "approval_status": "draft",
  "created_at": "2026-06-16T15:00:00Z"
}
```

---

## 9. 問題交流API

### 9.1 質問一覧取得

**エンドポイント:** `GET /api/qa-questions`

**クエリパラメータ:**
- `status` (optional): ステータスでフィルタ（`open`, `resolved`, `closed`）
- `vehicle_model` (optional): 車種でフィルタ

**レスポンス（成功）: 200 OK**
```json
{
  "data": [
    {
      "id": "qa-789",
      "title": "P0420のよくある原因は？",
      "body": "Model Aで頻繁にP0420が出ます。よくある原因を教えてください。",
      "vehicle_model": "Model A",
      "status": "resolved",
      "answers_count": 3,
      "created_at": "2026-06-10T09:00:00Z"
    }
  ],
  "meta": {
    "total": 100,
    "limit": 20,
    "offset": 0
  }
}
```

---

### 9.2 質問詳細取得

**エンドポイント:** `GET /api/qa-questions/[id]`

**レスポンス（成功）: 200 OK**
```json
{
  "id": "qa-789",
  "title": "P0420のよくある原因は？",
  "body": "Model Aで頻繁にP0420が出ます。よくある原因を教えてください。",
  "vehicle_model": "Model A",
  "model_year": 2024,
  "dtc": ["P0420"],
  "status": "resolved",
  "created_at": "2026-06-10T09:00:00Z",
  "user": {
    "id": "user-123",
    "name": "佐藤健太"
  },
  "answers": [
    {
      "id": "answer-101",
      "body": "O2センサーの劣化が最も多い原因です。まずO2センサーの状態を確認してください。",
      "is_best_answer": true,
      "created_at": "2026-06-10T10:30:00Z",
      "user": {
        "id": "user-789",
        "name": "田中一郎"
      }
    }
  ]
}
```

---

### 9.3 質問投稿

**エンドポイント:** `POST /api/qa-questions`

**リクエストボディ:**
```json
{
  "title": "P0300の診断で困っています",
  "body": "Model Bで P0300 が出ていますが、スパークプラグを交換しても直りません。他に確認すべきことはありますか？",
  "vehicle_model": "Model B",
  "model_year": 2025,
  "dtc": ["P0300"]
}
```

**レスポンス（成功）: 201 Created**
```json
{
  "id": "qa-999",
  "title": "P0300の診断で困っています",
  "status": "open",
  "created_at": "2026-06-16T16:00:00Z"
}
```

---

### 9.4 回答投稿

**エンドポイント:** `POST /api/qa-questions/[id]/answers`

**リクエストボディ:**
```json
{
  "body": "イグニッションコイルの動作確認もしてみてください。P0300の場合、コイルの劣化も多い原因です。"
}
```

**レスポンス（成功）: 201 Created**
```json
{
  "id": "answer-202",
  "question_id": "qa-999",
  "body": "イグニッションコイルの動作確認もしてみてください。P0300の場合、コイルの劣化も多い原因です。",
  "created_at": "2026-06-16T16:15:00Z"
}
```

---

## 10. 検索API

### 10.1 AI検索（フォールバック）

**エンドポイント:** `GET /api/search`

**説明:** 自然言語検索、全文検索、ベクトル検索を組み合わせた高精度検索

**クエリパラメータ:**
- `q`: 検索クエリ（必須）
- `session_id` (optional): 作業セッションID（コンテキスト引き継ぎ）
- `type` (optional): 検索対象（`all`, `manuals`, `ties`, `qa`、デフォルト: `all`）

**リクエスト例:**
```http
GET /api/search?q=エンジンがかからない&session_id=550e8400-e29b-41d4-a716-446655440000 HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**レスポンス（成功）: 200 OK**
```json
{
  "query": "エンジンがかからない",
  "results": {
    "manuals": [
      {
        "id": "manual-234",
        "title": "エンジン始動トラブルシューティング",
        "snippet": "エンジンがかからない場合、まずバッテリー電圧を確認...",
        "relevance_score": 0.92
      }
    ],
    "ties": [
      {
        "id": "tie-567",
        "title": "Model A エンジン始動不良事例",
        "snippet": "バッテリー電圧低下により始動不良が発生...",
        "relevance_score": 0.88
      }
    ],
    "qa_questions": [
      {
        "id": "qa-345",
        "title": "エンジンがかからない時の対処法",
        "snippet": "セルモーターは回るがエンジンがかからない場合...",
        "relevance_score": 0.85
      }
    ]
  },
  "meta": {
    "total_results": 15,
    "search_time_ms": 250
  }
}
```

---

## 11. エラーハンドリング

### 11.1 エラーレスポンス形式

全てのエラーレスポンスは以下の形式で統一：

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "エラーメッセージ（ユーザー向け）",
    "details": "詳細情報（デバッグ用、任意）",
    "field": "エラーが発生したフィールド名（バリデーションエラーの場合）"
  }
}
```

### 11.2 エラーコード一覧

| エラーコード | HTTPステータス | 説明 |
|---|---|---|
| `VALIDATION_ERROR` | 400 | バリデーションエラー |
| `UNAUTHORIZED` | 401 | 認証エラー（ログインが必要） |
| `FORBIDDEN` | 403 | 権限エラー（アクセス権限なし） |
| `NOT_FOUND` | 404 | リソースが見つからない |
| `CONFLICT` | 409 | リソースの競合（例: 既に存在する） |
| `RATE_LIMIT_EXCEEDED` | 429 | レート制限超過 |
| `INTERNAL_SERVER_ERROR` | 500 | サーバー内部エラー |
| `SERVICE_UNAVAILABLE` | 503 | サービス一時停止中 |

### 11.3 エラーレスポンス例

**400 Bad Request（バリデーションエラー）**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "年式は2000年以降を指定してください",
    "field": "model_year"
  }
}
```

**401 Unauthorized（認証エラー）**
```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "認証が必要です。ログインしてください。"
  }
}
```

**404 Not Found（リソースが見つからない）**
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "指定された作業セッションが見つかりません",
    "details": "session_id: 550e8400-e29b-41d4-a716-446655440000"
  }
}
```

**500 Internal Server Error**
```json
{
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "サーバーエラーが発生しました。しばらくしてから再度お試しください。"
  }
}
```

---

## 12. レート制限

### 12.1 制限内容

- **一般API**: 1分あたり60リクエスト（1ユーザーあたり）
- **AI検索API**: 1分あたり10リクエスト（OpenAI APIのコスト削減のため）
- **推薦情報API**: 1分あたり30リクエスト

### 12.2 レート制限超過時のレスポンス

**429 Too Many Requests**
```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "リクエスト制限を超えました。しばらくしてから再度お試しください。",
    "retry_after": 30
  }
}
```

**レスポンスヘッダー:**
```http
HTTP/1.1 429 Too Many Requests
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1686912000
Retry-After: 30
```

---

## 付録

### A. TypeScript型定義

```typescript
// 作業セッション
interface WorkSession {
  id: string;
  vehicle_model: string;
  model_year: number;
  vin: string | null;
  symptom: string | null;
  dtc: string[];
  current_phase: 'intake' | 'diagnosis' | 'planning' | 'execution' | 'verification' | 'delivery';
  status: 'in_progress' | 'paused' | 'completed';
  started_at: string;
  completed_at: string | null;
}

// 推薦情報
interface Recommendations {
  session_id: string;
  phase: string;
  ai_summary: string;
  manuals: Manual[];
  ties: TIE[];
  qa_questions: QAQuestion[];
  warnings: Warning[];
}

// マニュアル
interface Manual {
  id: string;
  vehicle_model: string;
  model_year: number;
  manual_type: 'service_manual' | 'user_manual' | 'repair_guide';
  title: string;
  section: string;
  content?: string;
  pdf_url?: string;
  related_dtc?: string[];
}

// TIE
interface TIE {
  id: string;
  title: string;
  vehicle_model: string;
  model_year: number;
  symptom: string;
  dtc: string[];
  cause: string;
  action: string;
  approval_status: 'draft' | 'pending' | 'approved' | 'rejected';
}

// 問題交流（質問）
interface QAQuestion {
  id: string;
  title: string;
  body: string;
  vehicle_model?: string;
  model_year?: number;
  dtc?: string[];
  status: 'open' | 'resolved' | 'closed';
  created_at: string;
}

// 問題交流（回答）
interface QAAnswer {
  id: string;
  question_id: string;
  body: string;
  is_best_answer: boolean;
  created_at: string;
}

// エラーレスポンス
interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: string;
    field?: string;
  };
}
```

---

**以上、API仕様書v1.1**
