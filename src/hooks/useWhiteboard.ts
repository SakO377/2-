import { useCallback, useMemo, useReducer } from 'react'
import type { ArrowData, BallData, PlayerData, Step, Team } from '../types'
import { createEmptyStep } from '../types'

interface HistoryState {
  past: Step[]
  present: Step
  future: Step[]
}

type Action =
  | { type: 'ADD_PLAYER'; team: Team; x: number; y: number; color: string }
  | { type: 'ADD_BALL'; x: number; y: number; holder?: string | null }
  | { type: 'SET_BALL_HOLDER'; holder: string | null }
  | { type: 'MOVE_PLAYER'; id: string; x: number; y: number }
  | { type: 'MOVE_BALL'; x: number; y: number }
  | { type: 'ADD_ARROW'; arrow: ArrowData }
  | { type: 'DELETE_PLAYER'; id: string }
  | { type: 'DELETE_BALL' }
  | { type: 'DELETE_ARROW'; id: string }
  | { type: 'CLEAR_ALL' }
  | { type: 'UNDO' }
  | { type: 'REDO' }

let idCounter = 0
function nextId(prefix: string) {
  idCounter += 1
  return `${prefix}${idCounter}-${Date.now().toString(36)}`
}

function nextPlayerNumber(step: Step, team: Team) {
  const existing = step.players.filter((p) => p.team === team).map((p) => p.number)
  return existing.length === 0 ? 1 : Math.max(...existing) + 1
}

function applyEdit(step: Step, action: Action): Step {
  switch (action.type) {
    case 'ADD_PLAYER': {
      const number = nextPlayerNumber(step, action.team)
      const player: PlayerData = {
        id: nextId(action.team === 'offense' ? 'O' : 'D'),
        x: action.x,
        y: action.y,
        team: action.team,
        number,
        color: action.color,
      }
      return { ...step, players: [...step.players, player] }
    }
    case 'ADD_BALL': {
      const ball: BallData = { x: action.x, y: action.y, holder: action.holder ?? null }
      return { ...step, ball }
    }
    case 'SET_BALL_HOLDER': {
      if (!step.ball) return step
      return { ...step, ball: { ...step.ball, holder: action.holder } }
    }
    case 'MOVE_PLAYER': {
      return {
        ...step,
        players: step.players.map((p) =>
          p.id === action.id ? { ...p, x: action.x, y: action.y } : p,
        ),
      }
    }
    case 'MOVE_BALL': {
      if (!step.ball) return step
      return { ...step, ball: { ...step.ball, x: action.x, y: action.y, holder: null } }
    }
    case 'ADD_ARROW': {
      return { ...step, arrows: [...step.arrows, action.arrow] }
    }
    case 'DELETE_PLAYER': {
      return {
        ...step,
        players: step.players.filter((p) => p.id !== action.id),
        ball: step.ball && step.ball.holder === action.id ? { ...step.ball, holder: null } : step.ball,
        arrows: step.arrows.filter((a) => a.fromId !== action.id && a.toId !== action.id),
      }
    }
    case 'DELETE_BALL':
      return { ...step, ball: null }
    case 'DELETE_ARROW':
      return { ...step, arrows: step.arrows.filter((a) => a.id !== action.id) }
    case 'CLEAR_ALL':
      return createEmptyStep()
    default:
      return step
  }
}

function reducer(state: HistoryState, action: Action): HistoryState {
  if (action.type === 'UNDO') {
    if (state.past.length === 0) return state
    const previous = state.past[state.past.length - 1]
    return {
      past: state.past.slice(0, -1),
      present: previous,
      future: [state.present, ...state.future],
    }
  }
  if (action.type === 'REDO') {
    if (state.future.length === 0) return state
    const next = state.future[0]
    return {
      past: [...state.past, state.present],
      present: next,
      future: state.future.slice(1),
    }
  }

  const nextPresent = applyEdit(state.present, action)
  if (nextPresent === state.present) return state
  return {
    past: [...state.past, state.present],
    present: nextPresent,
    future: [],
  }
}

function init(): HistoryState {
  return { past: [], present: createEmptyStep(), future: [] }
}

export function useWhiteboard() {
  const [state, dispatch] = useReducer(reducer, undefined, init)

  const addPlayer = useCallback(
    (team: Team, x: number, y: number, color: string) =>
      dispatch({ type: 'ADD_PLAYER', team, x, y, color }),
    [],
  )
  const addBall = useCallback(
    (x: number, y: number, holder: string | null = null) =>
      dispatch({ type: 'ADD_BALL', x, y, holder }),
    [],
  )
  const setBallHolder = useCallback(
    (holder: string | null) => dispatch({ type: 'SET_BALL_HOLDER', holder }),
    [],
  )
  const movePlayer = useCallback(
    (id: string, x: number, y: number) => dispatch({ type: 'MOVE_PLAYER', id, x, y }),
    [],
  )
  const moveBall = useCallback((x: number, y: number) => dispatch({ type: 'MOVE_BALL', x, y }), [])
  const addArrow = useCallback((arrow: ArrowData) => dispatch({ type: 'ADD_ARROW', arrow }), [])
  const deletePlayer = useCallback((id: string) => dispatch({ type: 'DELETE_PLAYER', id }), [])
  const deleteBall = useCallback(() => dispatch({ type: 'DELETE_BALL' }), [])
  const deleteArrow = useCallback((id: string) => dispatch({ type: 'DELETE_ARROW', id }), [])
  const clearAll = useCallback(() => dispatch({ type: 'CLEAR_ALL' }), [])
  const undo = useCallback(() => dispatch({ type: 'UNDO' }), [])
  const redo = useCallback(() => dispatch({ type: 'REDO' }), [])

  return useMemo(
    () => ({
      step: state.present,
      canUndo: state.past.length > 0,
      canRedo: state.future.length > 0,
      addPlayer,
      addBall,
      setBallHolder,
      movePlayer,
      moveBall,
      addArrow,
      deletePlayer,
      deleteBall,
      deleteArrow,
      clearAll,
      undo,
      redo,
    }),
    [
      state,
      addPlayer,
      addBall,
      setBallHolder,
      movePlayer,
      moveBall,
      addArrow,
      deletePlayer,
      deleteBall,
      deleteArrow,
      clearAll,
      undo,
      redo,
    ],
  )
}

export function makeArrowId() {
  return nextId('A')
}
