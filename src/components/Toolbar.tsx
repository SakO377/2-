import type { ToolId } from '../court/tools'
import { PLAYER_COLOR_PRESETS } from '../court/tokens'

interface Props {
  activeTool: ToolId
  setActiveTool: (tool: ToolId) => void
  nextOffenseColor: string
  setNextOffenseColor: (color: string) => void
  nextDefenseColor: string
  setNextDefenseColor: (color: string) => void
  canUndo: boolean
  canRedo: boolean
  onUndo: () => void
  onRedo: () => void
  onClearAll: () => void
}

function ToolButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        active
          ? 'bg-blue-600 text-white shadow-sm'
          : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
      }`}
    >
      {children}
    </button>
  )
}

function ColorSwatchRow({
  value,
  onChange,
}: {
  value: string
  onChange: (color: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-1.5 mt-1.5">
      {PLAYER_COLOR_PRESETS.map((color) => (
        <button
          key={color}
          type="button"
          aria-label={color}
          onClick={() => onChange(color)}
          className="w-5 h-5 rounded-full border-2"
          style={{
            backgroundColor: color,
            borderColor: value === color ? '#0f172a' : 'transparent',
          }}
        />
      ))}
    </div>
  )
}

export default function Toolbar({
  activeTool,
  setActiveTool,
  nextOffenseColor,
  setNextOffenseColor,
  nextDefenseColor,
  setNextDefenseColor,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onClearAll,
}: Props) {
  return (
    <div className="flex flex-col gap-5 p-4 w-64 shrink-0 bg-slate-50 border-r border-slate-200 overflow-y-auto">
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
          選手
        </h2>
        <div className="flex flex-col gap-2">
          <ToolButton active={activeTool === 'add-offense'} onClick={() => setActiveTool('add-offense')}>
            ● オフェンス追加
          </ToolButton>
          <ColorSwatchRow value={nextOffenseColor} onChange={setNextOffenseColor} />
          <ToolButton active={activeTool === 'add-defense'} onClick={() => setActiveTool('add-defense')}>
            ✕ ディフェンス追加
          </ToolButton>
          <ColorSwatchRow value={nextDefenseColor} onChange={setNextDefenseColor} />
        </div>
      </div>

      <div>
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
          ボール
        </h2>
        <ToolButton active={activeTool === 'add-ball'} onClick={() => setActiveTool('add-ball')}>
          🏀 ボール配置 / 保持者設定
        </ToolButton>
      </div>

      <div>
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
          矢印
        </h2>
        <div className="flex flex-col gap-2">
          <ToolButton active={activeTool === 'arrow-move'} onClick={() => setActiveTool('arrow-move')}>
            → 移動（実線）
          </ToolButton>
          <ToolButton active={activeTool === 'arrow-pass'} onClick={() => setActiveTool('arrow-pass')}>
            ⇢ パス（点線）
          </ToolButton>
        </div>
        {(activeTool === 'arrow-move' || activeTool === 'arrow-pass') && (
          <p className="text-xs text-slate-500 mt-1.5">
            始点をクリックしてから終点をクリックしてください（Escで取消）
          </p>
        )}
      </div>

      <div>
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
          編集
        </h2>
        <div className="flex flex-col gap-2">
          <ToolButton active={activeTool === 'select'} onClick={() => setActiveTool('select')}>
            ↖ 選択・ドラッグ移動
          </ToolButton>
          <ToolButton active={activeTool === 'erase'} onClick={() => setActiveTool('erase')}>
            🧹 消しゴム（クリックで削除）
          </ToolButton>
        </div>
      </div>

      <div className="mt-auto flex flex-col gap-2 pt-4 border-t border-slate-200">
        <div className="flex gap-2">
          <button
            type="button"
            disabled={!canUndo}
            onClick={onUndo}
            className="flex-1 px-3 py-2 rounded-md text-sm font-medium bg-white border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100"
          >
            ↺ Undo
          </button>
          <button
            type="button"
            disabled={!canRedo}
            onClick={onRedo}
            className="flex-1 px-3 py-2 rounded-md text-sm font-medium bg-white border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100"
          >
            ↻ Redo
          </button>
        </div>
        <button
          type="button"
          onClick={() => {
            if (window.confirm('コート上の全ての要素を削除します。よろしいですか？')) {
              onClearAll()
            }
          }}
          className="px-3 py-2 rounded-md text-sm font-medium bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
        >
          🗑 全消去
        </button>
      </div>
    </div>
  )
}
