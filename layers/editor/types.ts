export type ActiveTool =
  | 'select'
  | 'shapes'
  | 'text'
  | 'images'
  | 'draw'
  | 'fill'
  | 'stroke-color'
  | 'stroke-width'
  | 'font'
  | 'opacity'
  | 'filter'
  | 'settings'
  | 'ai'
  | 'remove-bg'
  | 'templates'

export const FILL_COLOR = 'rgba(0,0,0,1)'
export const STROKE_COLOR = 'rgba(0,0,0,1)'
export const STROKE_WIDTH = 2

export const CIRCLE_OPTIONS = {
  radius: 225,
  left: 100,
  top: 100,
  fill: FILL_COLOR,
  stroke: STROKE_COLOR,
  strokeWidth: STROKE_WIDTH,
}

export const RECTANGLE_OPTIONS = {
  left: 100,
  top: 100,
  fill: FILL_COLOR,
  stroke: STROKE_COLOR,
  strokeWidth: STROKE_WIDTH,
  width: 400,
  height: 400,
  angle: 0,
}

export const DIAMOND_OPTIONS = {
  left: 100,
  top: 100,
  fill: FILL_COLOR,
  stroke: STROKE_COLOR,
  strokeWidth: STROKE_WIDTH,
  width: 600,
  height: 600,
  angle: 0,
}

export const TRIANGLE_OPTIONS = {
  left: 100,
  top: 100,
  fill: FILL_COLOR,
  stroke: STROKE_COLOR,
  strokeWidth: STROKE_WIDTH,
  width: 400,
  height: 400,
  angle: 0,
}

export interface BuildEditorProps {
  // undo: () => void
  // redo: () => void
  // save: (skip?: boolean) => void
  // canUndo: () => boolean
  // canRedo: () => boolean
  // autoZoom: () => void
  // copy: () => void
  // paste: () => void
  canvas: fabric.Canvas
  fillColor: Ref<string>
  strokeColor: Ref<string>
  strokeWidth: Ref<number>
  selectedObjects: Ref<fabric.Object[]>
  // strokeDashArray: number[]
  // fontFamily: string
  // setStrokeDashArray: (value: number[]) => void
  // setFontFamily: (value: string) => void
}

export interface Editor {
  addCircle: () => void
  addSoftRectangle: () => void
  addRectangle: () => void
  addTriangle: () => void
  addInverseTriangle: () => void
  addDiamond: () => void
  setFillColor: (value: string) => void
  setStrokeColor: (value: string) => void
  setStrokeWidth: (value: number) => void
  fillColor: Ref<string>
  strokeColor: Ref<string>
  strokeWidth: Ref<number>
  selectedObjects: Ref<fabric.Object[]>
  canvas: fabric.Canvas
  getActiveFillColor: () => string
}
