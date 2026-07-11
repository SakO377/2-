import type { PointerEvent as ReactPointerEvent } from 'react'
import { BALL_RADIUS } from '../court/tokens'

interface Props {
  x: number
  y: number
  isDraggable: boolean
  onPointerDownDrag: (e: ReactPointerEvent<SVGGElement>) => void
  onClickAction: (e: React.MouseEvent<SVGGElement>) => void
}

export default function BallToken({ x, y, isDraggable, onPointerDownDrag, onClickAction }: Props) {
  return (
    <g
      transform={`translate(${x}, ${y})`}
      style={{ cursor: isDraggable ? 'grab' : 'pointer' }}
      onPointerDown={isDraggable ? onPointerDownDrag : undefined}
      onClick={!isDraggable ? onClickAction : undefined}
    >
      <circle r={BALL_RADIUS} fill="#f97316" stroke="#7c2d12" strokeWidth={1.5} />
      <path
        d={`M ${-BALL_RADIUS} 0 A ${BALL_RADIUS} ${BALL_RADIUS} 0 0 0 ${BALL_RADIUS} 0`}
        fill="none"
        stroke="#7c2d12"
        strokeWidth={1}
      />
      <line x1={0} y1={-BALL_RADIUS} x2={0} y2={BALL_RADIUS} stroke="#7c2d12" strokeWidth={1} />
      <path
        d={`M ${-BALL_RADIUS * 0.7} ${-BALL_RADIUS * 0.7} Q 0 0 ${-BALL_RADIUS * 0.7} ${BALL_RADIUS * 0.7}`}
        fill="none"
        stroke="#7c2d12"
        strokeWidth={1}
      />
      <path
        d={`M ${BALL_RADIUS * 0.7} ${-BALL_RADIUS * 0.7} Q 0 0 ${BALL_RADIUS * 0.7} ${BALL_RADIUS * 0.7}`}
        fill="none"
        stroke="#7c2d12"
        strokeWidth={1}
      />
    </g>
  )
}
