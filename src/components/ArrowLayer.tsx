import type { ArrowData, Point } from '../types'

interface Props {
  arrows: ArrowData[]
  resolvePoint: (arrow: ArrowData, which: 'from' | 'to') => Point
  activeTool: string
  onDeleteArrow: (id: string) => void
}

const HEAD_LEN = 10
const HEAD_WIDTH = 6

function arrowHeadPoints(from: Point, to: Point) {
  const angle = Math.atan2(to.y - from.y, to.x - from.x)
  const backX = to.x - HEAD_LEN * Math.cos(angle)
  const backY = to.y - HEAD_LEN * Math.sin(angle)
  const leftX = backX - HEAD_WIDTH * Math.sin(angle)
  const leftY = backY + HEAD_WIDTH * Math.cos(angle)
  const rightX = backX + HEAD_WIDTH * Math.sin(angle)
  const rightY = backY - HEAD_WIDTH * Math.cos(angle)
  return `${to.x},${to.y} ${leftX},${leftY} ${rightX},${rightY}`
}

export default function ArrowLayer({ arrows, resolvePoint, activeTool, onDeleteArrow }: Props) {
  return (
    <g>
      {arrows.map((arrow) => {
        const from = resolvePoint(arrow, 'from')
        const to = resolvePoint(arrow, 'to')
        const color = arrow.type === 'pass' ? '#0891b2' : arrow.type === 'screen' ? '#7c3aed' : '#111827'
        const dashed = arrow.type === 'pass'
        return (
          <g
            key={arrow.id}
            style={{ cursor: activeTool === 'erase' ? 'pointer' : 'default' }}
            onClick={() => activeTool === 'erase' && onDeleteArrow(arrow.id)}
          >
            {/* wide invisible hit area for easier clicking/erasing */}
            <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="transparent" strokeWidth={16} />
            <line
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke={color}
              strokeWidth={2.5}
              strokeDasharray={dashed ? '7 6' : undefined}
            />
            <polygon points={arrowHeadPoints(from, to)} fill={color} />
          </g>
        )
      })}
    </g>
  )
}
