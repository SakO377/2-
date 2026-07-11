import { useCallback, useEffect, useRef, useState } from 'react'
import type { MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent } from 'react'
import HalfCourt from './HalfCourt'
import PlayerToken from './PlayerToken'
import BallToken from './BallToken'
import ArrowLayer from './ArrowLayer'
import { VIEW_HEIGHT, VIEW_WIDTH } from '../court/geometry'
import { BALL_OFFSET_X, BALL_OFFSET_Y } from '../court/tokens'
import { makeArrowId } from '../hooks/useWhiteboard'
import type { ArrowData, PlayerData, Point, Step } from '../types'
import type { ToolId } from '../court/tools'

interface LiveDrag {
  kind: 'player' | 'ball'
  id: string
  x: number
  y: number
}

interface ArrowDraft {
  from: Point
  fromId?: string
}

interface Props {
  step: Step
  activeTool: ToolId
  nextOffenseColor: string
  nextDefenseColor: string
  addPlayer: (team: 'offense' | 'defense', x: number, y: number, color: string) => void
  addBall: (x: number, y: number, holder?: string | null) => void
  setBallHolder: (holder: string | null) => void
  movePlayer: (id: string, x: number, y: number) => void
  moveBall: (x: number, y: number) => void
  addArrow: (arrow: ArrowData) => void
  deletePlayer: (id: string) => void
  deleteBall: () => void
  deleteArrow: (id: string) => void
}

function getSvgPoint(svg: SVGSVGElement, clientX: number, clientY: number): Point {
  const pt = svg.createSVGPoint()
  pt.x = clientX
  pt.y = clientY
  const ctm = svg.getScreenCTM()
  if (!ctm) return { x: 0, y: 0 }
  const transformed = pt.matrixTransform(ctm.inverse())
  return {
    x: Math.min(Math.max(transformed.x, 0), VIEW_WIDTH),
    y: Math.min(Math.max(transformed.y, 0), VIEW_HEIGHT),
  }
}

export default function CourtBoard({
  step,
  activeTool,
  nextOffenseColor,
  nextDefenseColor,
  addPlayer,
  addBall,
  setBallHolder,
  movePlayer,
  moveBall,
  addArrow,
  deletePlayer,
  deleteBall,
  deleteArrow,
}: Props) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [liveDrag, setLiveDrag] = useState<LiveDrag | null>(null)
  const [arrowDraft, setArrowDraft] = useState<ArrowDraft | null>(null)
  const [mousePos, setMousePos] = useState<Point | null>(null)

  useEffect(() => {
    if (activeTool !== 'arrow-move' && activeTool !== 'arrow-pass') {
      setArrowDraft(null)
    }
  }, [activeTool])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setArrowDraft(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const resolvePlayerPos = useCallback(
    (player: PlayerData): Point => {
      if (liveDrag?.kind === 'player' && liveDrag.id === player.id) {
        return { x: liveDrag.x, y: liveDrag.y }
      }
      return { x: player.x, y: player.y }
    },
    [liveDrag],
  )

  const resolveBallPos = useCallback((): Point | null => {
    if (!step.ball) return null
    if (step.ball.holder) {
      const holder = step.players.find((p) => p.id === step.ball!.holder)
      if (holder) {
        const pos = resolvePlayerPos(holder)
        return { x: pos.x + BALL_OFFSET_X, y: pos.y + BALL_OFFSET_Y }
      }
    }
    if (liveDrag?.kind === 'ball') return { x: liveDrag.x, y: liveDrag.y }
    return { x: step.ball.x, y: step.ball.y }
  }, [step.ball, step.players, liveDrag, resolvePlayerPos])

  const resolveArrowPoint = useCallback(
    (arrow: ArrowData, which: 'from' | 'to'): Point => {
      const id = which === 'from' ? arrow.fromId : arrow.toId
      if (id) {
        const player = step.players.find((p) => p.id === id)
        if (player) return resolvePlayerPos(player)
      }
      return which === 'from' ? arrow.from : arrow.to
    },
    [step.players, resolvePlayerPos],
  )

  const handleArrowPoint = useCallback(
    (point: Point, playerId?: string) => {
      if (!arrowDraft) {
        setArrowDraft({ from: point, fromId: playerId })
        return
      }
      const arrow: ArrowData = {
        id: makeArrowId(),
        type: activeTool === 'arrow-pass' ? 'pass' : 'move',
        from: arrowDraft.from,
        to: point,
        fromId: arrowDraft.fromId,
        toId: playerId,
      }
      addArrow(arrow)
      setArrowDraft(null)
    },
    [arrowDraft, activeTool, addArrow],
  )

  const handleBackgroundClick = (e: ReactMouseEvent<SVGRectElement>) => {
    const svg = svgRef.current
    if (!svg) return
    const p = getSvgPoint(svg, e.clientX, e.clientY)
    switch (activeTool) {
      case 'add-offense':
        addPlayer('offense', p.x, p.y, nextOffenseColor)
        break
      case 'add-defense':
        addPlayer('defense', p.x, p.y, nextDefenseColor)
        break
      case 'add-ball':
        if (step.ball) moveBall(p.x, p.y)
        else addBall(p.x, p.y)
        break
      case 'arrow-move':
      case 'arrow-pass':
        handleArrowPoint(p)
        break
      default:
        break
    }
  }

  const handlePlayerClick = (player: PlayerData) => () => {
    switch (activeTool) {
      case 'erase':
        deletePlayer(player.id)
        break
      case 'add-ball':
        if (step.ball) setBallHolder(player.id)
        else addBall(player.x, player.y, player.id)
        break
      case 'arrow-move':
      case 'arrow-pass':
        handleArrowPoint(resolvePlayerPos(player), player.id)
        break
      default:
        break
    }
  }

  const handleBallClick = () => {
    if (activeTool === 'erase') deleteBall()
  }

  const startPlayerDrag = (player: PlayerData) => (e: ReactPointerEvent<SVGGElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    setLiveDrag({ kind: 'player', id: player.id, x: player.x, y: player.y })
  }

  const startBallDrag = (e: ReactPointerEvent<SVGGElement>) => {
    if (!step.ball) return
    e.currentTarget.setPointerCapture(e.pointerId)
    setLiveDrag({ kind: 'ball', id: 'ball', x: step.ball.x, y: step.ball.y })
  }

  const handlePointerMove = (e: ReactPointerEvent<SVGSVGElement>) => {
    const svg = e.currentTarget
    const p = getSvgPoint(svg, e.clientX, e.clientY)
    if (liveDrag) {
      setLiveDrag({ ...liveDrag, x: p.x, y: p.y })
    } else if (arrowDraft) {
      setMousePos(p)
    }
  }

  const handlePointerUp = (e: ReactPointerEvent<SVGSVGElement>) => {
    if (!liveDrag) return
    const svg = e.currentTarget
    const p = getSvgPoint(svg, e.clientX, e.clientY)
    if (liveDrag.kind === 'player') movePlayer(liveDrag.id, p.x, p.y)
    else moveBall(p.x, p.y)
    setLiveDrag(null)
  }

  const isDraggable = activeTool === 'select'
  const ballPos = resolveBallPos()

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
      className="w-full h-full max-h-full select-none"
      style={{ touchAction: 'none' }}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <HalfCourt />
      <rect
        x={0}
        y={0}
        width={VIEW_WIDTH}
        height={VIEW_HEIGHT}
        fill="transparent"
        onClick={handleBackgroundClick}
      />

      <ArrowLayer
        arrows={step.arrows}
        resolvePoint={resolveArrowPoint}
        activeTool={activeTool}
        onDeleteArrow={deleteArrow}
      />

      {arrowDraft && mousePos && (
        <line
          x1={arrowDraft.from.x}
          y1={arrowDraft.from.y}
          x2={mousePos.x}
          y2={mousePos.y}
          stroke="#94a3b8"
          strokeWidth={2}
          strokeDasharray="4 4"
        />
      )}

      {step.players.map((player) => {
        const pos = resolvePlayerPos(player)
        return (
          <PlayerToken
            key={player.id}
            player={player}
            x={pos.x}
            y={pos.y}
            isDraggable={isDraggable}
            isHighlighted={arrowDraft?.fromId === player.id}
            onPointerDownDrag={startPlayerDrag(player)}
            onClickAction={handlePlayerClick(player)}
          />
        )
      })}

      {ballPos && (
        <BallToken
          x={ballPos.x}
          y={ballPos.y}
          isDraggable={isDraggable}
          onPointerDownDrag={startBallDrag}
          onClickAction={handleBallClick}
        />
      )}
    </svg>
  )
}
