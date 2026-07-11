export type Team = 'offense' | 'defense'

export interface PlayerData {
  id: string
  x: number
  y: number
  team: Team
  number: number
  color: string
}

export interface BallData {
  x: number
  y: number
  /** id of the player holding the ball, or null if it's a free ball */
  holder: string | null
}

export type ArrowType = 'move' | 'pass' | 'screen'

export interface Point {
  x: number
  y: number
}

export interface ArrowData {
  id: string
  type: ArrowType
  from: Point
  to: Point
  /** player id the arrow starts from, if it was drawn from a player/ball */
  fromId?: string
  /** player id the arrow ends at, if it was drawn onto a player */
  toId?: string
}

export interface LabelData {
  id: string
  text: string
  x: number
  y: number
}

export interface PenStrokeData {
  id: string
  points: Point[]
  color: string
  width: number
}

export interface Step {
  players: PlayerData[]
  ball: BallData | null
  arrows: ArrowData[]
  labels: LabelData[]
  strokes: PenStrokeData[]
}

export function createEmptyStep(): Step {
  return {
    players: [],
    ball: null,
    arrows: [],
    labels: [],
    strokes: [],
  }
}

export interface PlayData {
  name: string
  steps: Step[]
}
