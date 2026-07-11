/**
 * Half-court geometry, modeled on NBA dimensions (in feet), scaled to SVG px.
 * Baseline (and the basket) sits at the bottom of the viewBox; the half-court
 * line is at the top, so offensive movement generally flows upward.
 */
const PX_PER_FT = 10

const COURT_WIDTH_FT = 50
const COURT_HEIGHT_FT = 47
const MARGIN_FT = 4

export const COURT_WIDTH = COURT_WIDTH_FT * PX_PER_FT
export const COURT_HEIGHT = COURT_HEIGHT_FT * PX_PER_FT
export const MARGIN = MARGIN_FT * PX_PER_FT

export const VIEW_WIDTH = COURT_WIDTH + MARGIN * 2
export const VIEW_HEIGHT = COURT_HEIGHT + MARGIN * 2

// Court origin: top-left corner of the in-bounds rectangle.
export const ORIGIN_X = MARGIN
export const ORIGIN_Y = MARGIN

export const CENTER_X = ORIGIN_X + COURT_WIDTH / 2

export const BASELINE_Y = ORIGIN_Y + COURT_HEIGHT
export const HALFCOURT_Y = ORIGIN_Y

const ft = (n: number) => n * PX_PER_FT

// Basket center is 5.25 ft from the baseline.
export const BASKET_Y = BASELINE_Y - ft(5.25)
export const BASKET_X = CENTER_X
export const RIM_RADIUS = ft(0.75)

// Backboard: 6 ft wide, 4 ft from the baseline.
export const BACKBOARD_Y = BASELINE_Y - ft(4)
export const BACKBOARD_HALF_WIDTH = ft(3)

// Restricted area arc: 4 ft radius from the basket.
export const RESTRICTED_AREA_RADIUS = ft(4)

// Paint / key: 16 ft wide, 19 ft long (baseline to free-throw line).
export const PAINT_WIDTH = ft(16)
export const PAINT_HEIGHT = ft(19)
export const PAINT_LEFT = CENTER_X - PAINT_WIDTH / 2
export const PAINT_RIGHT = CENTER_X + PAINT_WIDTH / 2
export const FREE_THROW_LINE_Y = BASELINE_Y - PAINT_HEIGHT

// Free-throw circle: 6 ft radius, centered on the free-throw line.
export const FT_CIRCLE_RADIUS = ft(6)

// Three-point line: 22 ft at the corners, 23.75 ft arc.
export const CORNER_THREE_DIST = ft(22)
export const THREE_ARC_RADIUS = ft(23.75)
export const THREE_CORNER_X_LEFT = CENTER_X - CORNER_THREE_DIST
export const THREE_CORNER_X_RIGHT = CENTER_X + CORNER_THREE_DIST

// y where the straight corner three line transitions into the arc.
const dx = CORNER_THREE_DIST
const dy = Math.sqrt(THREE_ARC_RADIUS ** 2 - dx ** 2)
export const THREE_TRANSITION_Y = BASKET_Y - dy

// Center circle at half-court (drawn as a semicircle dipping into the half-court).
export const CENTER_CIRCLE_RADIUS = ft(6)
