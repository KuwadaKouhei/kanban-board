import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';

export default function Welcome({
    auth,
}: PageProps<{ canLogin: boolean; canRegister: boolean }>) {
    return (
        <>
            <Head title="カンバンボード" />
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
                {/* ヘッダー */}
                <header className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold text-gray-900">KanbanBoard</span>
                    </div>
                    <nav className="flex items-center gap-4">
                        {auth.user ? (
                            <Link
                                href="/dashboard"
                                className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition"
                            >
                                ダッシュボード
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition"
                                >
                                    ログイン
                                </Link>
                                <Link
                                    href="/register"
                                    className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition"
                                >
                                    新規登録
                                </Link>
                            </>
                        )}
                    </nav>
                </header>

                {/* ヒーローセクション */}
                <main className="max-w-7xl mx-auto px-6 pt-20 pb-32">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-5xl font-extrabold text-gray-900 leading-tight mb-6">
                            タスク管理を
                            <span className="text-indigo-600">もっとシンプル</span>に
                        </h1>
                        <p className="text-lg text-gray-600 mb-10 leading-relaxed">
                            ドラッグ&ドロップで直感的に操作できるカンバンボード。
                            <br />
                            チームやプロジェクトのタスクを見える化して、生産性を向上させましょう。
                        </p>
                        <div className="flex items-center justify-center gap-4">
                            {auth.user ? (
                                <Link
                                    href="/dashboard"
                                    className="rounded-lg bg-indigo-600 px-8 py-3 text-base font-semibold text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition"
                                >
                                    ダッシュボードへ
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href="/register"
                                        className="rounded-lg bg-indigo-600 px-8 py-3 text-base font-semibold text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition"
                                    >
                                        無料で始める
                                    </Link>
                                    <Link
                                        href="/login"
                                        className="rounded-lg border border-gray-300 px-8 py-3 text-base font-semibold text-gray-700 hover:bg-gray-50 transition"
                                    >
                                        ログイン
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* カンバンボード プレビュー */}
                    <div className="mt-20 max-w-5xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-2xl shadow-gray-200/50 border border-gray-100 p-6 overflow-hidden">
                            <div className="flex gap-4 overflow-x-auto pb-2">
                                {/* Todo カラム */}
                                <div className="flex-shrink-0 w-64 bg-gray-50 rounded-lg p-3">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="font-semibold text-sm text-gray-700">Todo</span>
                                        <span className="text-xs bg-gray-200 text-gray-500 rounded-full px-2 py-0.5">3</span>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="bg-white rounded-lg p-3 shadow-sm border">
                                            <p className="text-sm font-medium text-gray-800">UIデザインの作成</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className="text-xs bg-orange-100 text-orange-700 rounded px-2 py-0.5">高</span>
                                                <span className="text-xs text-gray-400">4/15</span>
                                            </div>
                                        </div>
                                        <div className="bg-white rounded-lg p-3 shadow-sm border">
                                            <p className="text-sm font-medium text-gray-800">DB設計レビュー</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className="text-xs bg-yellow-100 text-yellow-700 rounded px-2 py-0.5">中</span>
                                                <span className="text-xs text-gray-400">4/18</span>
                                            </div>
                                        </div>
                                        <div className="bg-white rounded-lg p-3 shadow-sm border opacity-60">
                                            <p className="text-sm font-medium text-gray-800">テスト計画書作成</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className="text-xs bg-blue-100 text-blue-700 rounded px-2 py-0.5">低</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* In Progress カラム */}
                                <div className="flex-shrink-0 w-64 bg-gray-50 rounded-lg p-3">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="font-semibold text-sm text-gray-700">In Progress</span>
                                        <span className="text-xs bg-gray-200 text-gray-500 rounded-full px-2 py-0.5">2</span>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="bg-white rounded-lg p-3 shadow-sm border ring-2 ring-indigo-200">
                                            <p className="text-sm font-medium text-gray-800">API開発</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className="text-xs bg-red-100 text-red-700 rounded px-2 py-0.5">緊急</span>
                                                <span className="text-xs text-gray-400">4/12</span>
                                            </div>
                                        </div>
                                        <div className="bg-white rounded-lg p-3 shadow-sm border">
                                            <p className="text-sm font-medium text-gray-800">認証機能実装</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className="text-xs bg-orange-100 text-orange-700 rounded px-2 py-0.5">高</span>
                                                <span className="text-xs text-gray-400">4/14</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Done カラム */}
                                <div className="flex-shrink-0 w-64 bg-gray-50 rounded-lg p-3">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="font-semibold text-sm text-gray-700">Done</span>
                                        <span className="text-xs bg-gray-200 text-gray-500 rounded-full px-2 py-0.5">2</span>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="bg-white rounded-lg p-3 shadow-sm border opacity-75">
                                            <p className="text-sm font-medium text-gray-800 line-through">要件定義</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className="text-xs bg-green-100 text-green-700 rounded px-2 py-0.5">完了</span>
                                            </div>
                                        </div>
                                        <div className="bg-white rounded-lg p-3 shadow-sm border opacity-75">
                                            <p className="text-sm font-medium text-gray-800 line-through">環境構築</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className="text-xs bg-green-100 text-green-700 rounded px-2 py-0.5">完了</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 機能紹介 */}
                    <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        <div className="text-center p-6">
                            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">ドラッグ&ドロップ</h3>
                            <p className="text-sm text-gray-600">タスクをドラッグして直感的にステータスを変更。マウス操作だけで完結します。</p>
                        </div>
                        <div className="text-center p-6">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">優先度・期限管理</h3>
                            <p className="text-sm text-gray-600">タスクに優先度と期限日を設定して、重要度の高いタスクを見逃しません。</p>
                        </div>
                        <div className="text-center p-6">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">安全な認証</h3>
                            <p className="text-sm text-gray-600">ユーザーごとにボードを管理。自分のデータは自分だけがアクセスできます。</p>
                        </div>
                    </div>
                </main>

                {/* フッター */}
                <footer className="border-t border-gray-200 py-8">
                    <p className="text-center text-sm text-gray-400">
                        KanbanBoard &mdash; Laravel + React + Inertia.js
                    </p>
                </footer>
            </div>
        </>
    );
}
