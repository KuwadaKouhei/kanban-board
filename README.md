# KanbanBoard - カンバンボード タスク管理アプリ

Laravel + React + Inertia.js を使用したカンバンボード風のタスク管理アプリケーションです。
ドラッグ&ドロップで直感的にタスクを管理できます。

## 主要機能

- **ユーザー認証** - 登録・ログイン・ログアウト（Laravel Breeze）
- **ボード管理** - ボードの作成・編集・削除
- **カラム管理** - カラムの追加・名前変更・削除（デフォルト: Todo / In Progress / Done）
- **タスク CRUD** - タスクの作成・表示・編集・削除
- **ドラッグ&ドロップ** - タスクのカラム間移動・並び替え（楽観的 UI 更新）
- **優先度管理** - 低 / 中 / 高 / 緊急の4段階
- **期限管理** - 期限日の設定・期限切れ警告表示

## 技術スタック

| レイヤー           | 技術                             |
| ------------------ | -------------------------------- |
| バックエンド       | Laravel 13 (PHP 8.4)             |
| 認証               | Laravel Breeze                   |
| フロントエンド     | React 18 + TypeScript            |
| SPA 通信           | Inertia.js                       |
| HTTP               | axios（D&D 並び替え Ajax 通信）  |
| ドラッグ&ドロップ  | @hello-pangea/dnd                |
| CSS                | Tailwind CSS                     |
| ビルド             | Vite                             |
| DB                 | SQLite                           |

## スキル実証ポイント

### try-catch（例外処理）

- 全 Controller メソッドで DB 操作のエラーキャッチ + ログ出力
- `BoardController@store` / `TaskOrderController@update` でトランザクション + rollBack
- フロントエンドの `useTaskOperations` フックで async 関数内の try-catch + finally

### Ajax 通信

#### axios による直接 Ajax 通信（画面遷移なし）

| ファイル | コード | 用途 |
| --- | --- | --- |
| `resources/js/Pages/Dashboard.tsx` | `axios.put('/boards-reorder', { boards: payload })` | ダッシュボードのボード並び替え |
| `resources/js/hooks/useTaskOperations.ts` | `axios.put('/tasks-reorder', { tasks })` | カンバン画面のタスク並び替え |

- サーバー側は `BoardOrderController` / `TaskOrderController` が `JsonResponse` を返す純粋な Ajax エンドポイント
- 楽観的 UI 更新を行い、Ajax 通信が失敗した場合は UI をロールバック

#### Inertia.js 経由の Ajax 通信（内部で XHR を使用）

| ファイル | コード | 用途 |
| --- | --- | --- |
| `resources/js/hooks/useTaskOperations.ts` | `router.post`, `router.put`, `router.delete` | タスク作成・更新・削除 |
| `resources/js/Pages/Dashboard.tsx` | `useForm.post`, `useForm.put` | ボード作成・編集 |
| `resources/js/Pages/Board/Partials/CreateTaskModal.tsx` | `useForm.post` | タスク作成フォーム送信 |
| `resources/js/Pages/Board/Partials/EditTaskModal.tsx` | `useForm.put` | タスク編集フォーム送信 |

- Inertia の `router` / `useForm` は内部的に XMLHttpRequest（Ajax）でサーバーと通信し、ページ全体のリロードなしでデータを送受信する

### async/await（非同期処理）

- `useTaskOperations.ts` で Inertia router を Promise 化 + await
- `axios.put` を await で非同期通信
- `Board/Show.tsx` の `handleDragEnd` で楽観的 UI 更新 + 失敗時ロールバック

## セットアップ

### 前提条件

- PHP 8.4+
- Composer
- Node.js 22+
- npm

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/KuwadaKouhei/kanban-board.git
cd kanban-board

# PHP 依存パッケージ
composer install

# Node.js 依存パッケージ
npm install

# 環境設定
cp .env.example .env
php artisan key:generate

# データベース作成 & マイグレーション
php artisan migrate

# (任意) テストデータ投入
php artisan db:seed --class=DefaultBoardSeeder
```

### 起動

ターミナルを2つ開いて実行:

```bash
# ターミナル 1 - Laravel サーバー
php artisan serve

# ターミナル 2 - Vite 開発サーバー
npm run dev
```

ブラウザで <http://localhost:8000> にアクセス。

### テストアカウント

シーダー実行済みの場合:

| 項目         | 値                 |
| ------------ | ------------------ |
| メール       | `test@example.com` |
| パスワード   | password           |

## ディレクトリ構成（主要部分）

```text
kanban-board/
├── app/
│   ├── Http/Controllers/
│   │   ├── BoardController.php        # ボード CRUD
│   │   ├── ColumnController.php       # カラム CRUD
│   │   ├── TaskController.php         # タスク CRUD
│   │   └── TaskOrderController.php    # D&D 並び替え API
│   ├── Http/Requests/                 # バリデーション
│   ├── Models/                        # Board / Column / Task
│   └── Policies/                      # BoardPolicy（認可）
├── database/
│   ├── migrations/                    # テーブル定義
│   └── seeders/                       # テストデータ
├── resources/js/
│   ├── Pages/
│   │   ├── Welcome.tsx                # ホーム画面
│   │   ├── Dashboard.tsx              # ボード一覧
│   │   └── Board/
│   │       ├── Show.tsx               # カンバン画面
│   │       └── Partials/              # モーダル・カード・カラム
│   ├── Components/                    # 共通 UI
│   └── hooks/
│       └── useTaskOperations.ts       # async/await + try-catch
└── routes/web.php                     # ルート定義
```

## DB 構成

```text
users 1 ─── * boards 1 ─── * columns 1 ─── * tasks
```

| テーブル | 説明 |
| -------- | ---- |
| users | ユーザー（Breeze デフォルト） |
| boards | ボード（name, description） |
| columns | カラム（name, position, color） |
| tasks | タスク（title, description, priority, due_date, position） |

詳細なER図（Mermaid）・テーブル定義・リレーションシップについては [docs/er-diagram.md](docs/er-diagram.md) を参照してください。
