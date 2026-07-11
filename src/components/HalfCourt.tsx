import {
  BACKBOARD_HALF_WIDTH,
  BACKBOARD_Y,
  BASELINE_Y,
  BASKET_X,
  BASKET_Y,
  CENTER_CIRCLE_RADIUS,
  CENTER_X,
  COURT_HEIGHT,
  COURT_WIDTH,
  FREE_THROW_LINE_Y,
  FT_CIRCLE_RADIUS,
  HALFCOURT_Y,
  ORIGIN_X,
  ORIGIN_Y,
  PAINT_LEFT,
  PAINT_WIDTH,
  RESTRICTED_AREA_RADIUS,
  RIM_RADIUS,
  THREE_CORNER_X_LEFT,
  THREE_CORNER_X_RIGHT,
  THREE_ARC_RADIUS,
  THREE_TRANSITION_Y,
} from '../court/geometry'

const LINE = '#334155'
const LINE_WIDTH = 2

/** Half circle passing through the "up" side (away from baseline). */
function archOver(cx: number, cy: number, r: number) {
  return `M ${cx - r},${cy} A ${r},${r} 0 0 1 ${cx + r},${cy}`
}

/** Half circle passing through the "down" side (toward baseline). */
function archUnder(cx: number, cy: number, r: number) {
  return `M ${cx + r},${cy} A ${r},${r} 0 0 1 ${cx - r},${cy}`
}

export default function HalfCourt() {
  return (
    <g>
      {/* out of bounds */}
      <rect x={0} y={0} width="100%" height="100%" fill="#f8fafc" />

      {/* court surface */}
      <rect
        x={ORIGIN_X}
        y={ORIGIN_Y}
        width={COURT_WIDTH}
        height={COURT_HEIGHT}
        fill="#fdf3e2"
        stroke={LINE}
        strokeWidth={LINE_WIDTH}
      />

      {/* half-court center circle (dips into the court from the top edge) */}
      <path
        d={archUnder(CENTER_X, HALFCOURT_Y, CENTER_CIRCLE_RADIUS)}
        fill="none"
        stroke={LINE}
        strokeWidth={LINE_WIDTH}
      />

      {/* paint / key */}
      <rect
        x={PAINT_LEFT}
        y={FREE_THROW_LINE_Y}
        width={PAINT_WIDTH}
        height={BASELINE_Y - FREE_THROW_LINE_Y}
        fill="#f4a94033"
        stroke={LINE}
        strokeWidth={LINE_WIDTH}
      />

      {/* free-throw circle: solid above the line, dashed inside the paint */}
      <path
        d={archOver(CENTER_X, FREE_THROW_LINE_Y, FT_CIRCLE_RADIUS)}
        fill="none"
        stroke={LINE}
        strokeWidth={LINE_WIDTH}
      />
      <path
        d={archUnder(CENTER_X, FREE_THROW_LINE_Y, FT_CIRCLE_RADIUS)}
        fill="none"
        stroke={LINE}
        strokeWidth={LINE_WIDTH}
        strokeDasharray="6 5"
      />

      {/* restricted area arc under the basket */}
      <path
        d={`M ${BASKET_X - RESTRICTED_AREA_RADIUS},${BASELINE_Y}
            L ${BASKET_X - RESTRICTED_AREA_RADIUS},${BASKET_Y}
            A ${RESTRICTED_AREA_RADIUS},${RESTRICTED_AREA_RADIUS} 0 0 1 ${BASKET_X + RESTRICTED_AREA_RADIUS},${BASKET_Y}
            L ${BASKET_X + RESTRICTED_AREA_RADIUS},${BASELINE_Y}`}
        fill="none"
        stroke={LINE}
        strokeWidth={LINE_WIDTH}
      />

      {/* three point line */}
      <path
        d={`M ${THREE_CORNER_X_LEFT},${BASELINE_Y}
            L ${THREE_CORNER_X_LEFT},${THREE_TRANSITION_Y}
            A ${THREE_ARC_RADIUS},${THREE_ARC_RADIUS} 0 0 1 ${THREE_CORNER_X_RIGHT},${THREE_TRANSITION_Y}
            L ${THREE_CORNER_X_RIGHT},${BASELINE_Y}`}
        fill="none"
        stroke={LINE}
        strokeWidth={LINE_WIDTH}
      />

      {/* backboard */}
      <line
        x1={BASKET_X - BACKBOARD_HALF_WIDTH}
        y1={BACKBOARD_Y}
        x2={BASKET_X + BACKBOARD_HALF_WIDTH}
        y2={BACKBOARD_Y}
        stroke={LINE}
        strokeWidth={LINE_WIDTH + 1}
      />

      {/* rim */}
      <circle
        cx={BASKET_X}
        cy={BASKET_Y}
        r={RIM_RADIUS}
        fill="none"
        stroke="#ea580c"
        strokeWidth={LINE_WIDTH}
      />
    </g>
  )
}
