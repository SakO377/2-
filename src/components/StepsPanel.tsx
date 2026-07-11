export default function StepsPanel() {
  return (
    <div className="w-56 shrink-0 bg-slate-50 border-l border-slate-200 p-4 flex flex-col gap-3 overflow-y-auto">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">ステップ</h2>
      <div className="rounded-md border-2 border-blue-500 bg-white px-3 py-2 text-sm font-medium text-slate-700">
        ステップ 1（現在）
      </div>
      <p className="text-xs text-slate-500 leading-relaxed">
        複数ステップの作成・再生アニメーション機能は次の開発フェーズで実装予定です。
      </p>
      <div className="mt-auto flex flex-col gap-2 pt-4 border-t border-slate-200 opacity-40 pointer-events-none select-none">
        <div className="flex gap-2 justify-center">
          <button type="button" className="px-2 py-1 rounded bg-white border border-slate-200 text-sm">
            ⏮
          </button>
          <button type="button" className="px-2 py-1 rounded bg-white border border-slate-200 text-sm">
            ▶
          </button>
          <button type="button" className="px-2 py-1 rounded bg-white border border-slate-200 text-sm">
            ⏭
          </button>
        </div>
        <button type="button" className="px-3 py-2 rounded-md text-sm font-medium bg-white border border-slate-200">
          + ステップ追加
        </button>
      </div>
    </div>
  )
}
