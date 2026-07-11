import type { PointerEvent as ReactPointerEvent } from 'react'
import type { PlayerData } from '../types'
import { PLAYER_RADIUS } from '../court/tokens'

interface Props {
  player: PlayerData
  x: number
  y: number
  isDraggable: boolean
  isHighlighted?: boolean
  onPointerDownDrag: (e: ReactPointerEvent<SVGGElement>) => void
  onClickAction: (e: ReactPointerEvent<SVGGElement> | React.MouseEvent<SVGGElement>) => void
}

export default function PlayerToken({
  player,
  x,
  y,
  isDraggable,
  isHighlighted,
  onPointerDownDrag,
  onClickAction,
}: Props) {
  return (
    <g
      transform={`translate(${x}, ${y})`}
      style={{ cursor: isDraggable ? 'grab' : 'pointer' }}
      onPointerDown={isDraggable ? onPointerDownDrag : undefined}
      onClick={!isDraggable ? onClickAction : undefined}
    >
      {isHighlighted && (
        <circle r={PLAYER_RADIUS + 4} fill="none" stroke="#facc15" strokeWidth={3} />
      )}
      <circle
        r={PLAYER_RADIUS}
        fill={player.color}
        stroke={player.team === 'defense' ? '#7f1d1d' : '#1e3a8a'}
        strokeWidth={2}
      />
      {player.team === 'defense' && (
        <>
          <line
            x1={-PLAYER_RADIUS * 0.55}
            y1={-PLAYER_RADIUS * 0.55}
            x2={PLAYER_RADIUS * 0.55}
            y2={PLAYER_RADIUS * 0.55}
            stroke="white"
            strokeWidth={2}
          />
          <line
            x1={PLAYER_RADIUS * 0.55}
            y1={-PLAYER_RADIUS * 0.55}
            x2={-PLAYER_RADIUS * 0.55}
            y2={PLAYER_RADIUS * 0.55}
            stroke="white"
            strokeWidth={2}
          />
        </>
      )}
      <text
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
        fill="white"
        style={{ userSelect: 'none', pointerEvents: 'none' }}
      >
        {player.number}
      </text>
    </g>
  )
}
