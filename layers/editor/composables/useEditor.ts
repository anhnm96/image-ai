import { fabric } from 'fabric'
import { type BuildEditorProps, CIRCLE_OPTIONS, DIAMOND_OPTIONS, type Editor, FILL_COLOR, RECTANGLE_OPTIONS, STROKE_COLOR, STROKE_WIDTH, TRIANGLE_OPTIONS } from '../types.js'
import { isTextType } from '../utils.js'

function buildEditor({ canvas, fillColor, strokeColor, strokeWidth, selectedObjects }: BuildEditorProps): Editor {
  function getWorkspace() {
    return canvas.getObjects().find(obj => obj.name === 'clip')
  }

  function center(object: fabric.Object) {
    const workspace = getWorkspace()
    const center = workspace?.getCenterPoint()

    if (!center) return
    // @ts-expect-error type
    canvas._centerObject(object, center)
  }

  function addToCanvas(object: fabric.Object) {
    center(object)
    canvas.add(object)
    canvas.setActiveObject(object)
  }

  return {
    setFillColor: (val: string) => {
      fillColor.value = val
      canvas.getActiveObjects().forEach((object) => {
        object.set({ fill: val })
      })
      canvas.renderAll()
    },
    setStrokeColor: (val: string) => {
      strokeColor.value = val
      canvas.getActiveObjects().forEach((object) => {
        // Text types don't have stroke
        if (isTextType(object.type)) {
          object.set({ fill: val })
          return
        }

        object.set({ stroke: val })
      })
      canvas.freeDrawingBrush.color = val
      canvas.renderAll()
    },
    setStrokeWidth: (val: number) => {
      strokeWidth.value = val
      canvas.getActiveObjects().forEach((object) => {
        object.set({ strokeWidth: val })
      })
      canvas.freeDrawingBrush.width = val
      canvas.renderAll()
    },
    addCircle: () => {
      const object = new fabric.Circle({
        ...CIRCLE_OPTIONS,
        fill: fillColor.value,
        stroke: strokeColor.value,
        strokeWidth: strokeWidth.value,
      })
      addToCanvas(object)
    },
    addSoftRectangle: () => {
      const object = new fabric.Rect({
        ...RECTANGLE_OPTIONS,
        rx: 50,
        ry: 50,
        fill: fillColor.value,
        stroke: strokeColor.value,
        strokeWidth: strokeWidth.value,
      })
      addToCanvas(object)
    },
    addRectangle: () => {
      const object = new fabric.Rect({
        ...RECTANGLE_OPTIONS,
        fill: fillColor.value,
        stroke: strokeColor.value,
        strokeWidth: strokeWidth.value,
      })
      addToCanvas(object)
    },
    addTriangle: () => {
      const object = new fabric.Triangle({
        ...TRIANGLE_OPTIONS,
        fill: fillColor.value,
        stroke: strokeColor.value,
        strokeWidth: strokeWidth.value,
      })

      addToCanvas(object)
    },
    addInverseTriangle: () => {
      const HEIGHT = TRIANGLE_OPTIONS.height
      const WIDTH = TRIANGLE_OPTIONS.width

      const object = new fabric.Polygon(
        [
          { x: 0, y: 0 },
          { x: WIDTH, y: 0 },
          { x: WIDTH / 2, y: HEIGHT },
        ],
        {
          ...TRIANGLE_OPTIONS,
          fill: fillColor.value,
          stroke: strokeColor.value,
          strokeWidth: strokeWidth.value,
        },
      )

      addToCanvas(object)
    },
    addDiamond: () => {
      const HEIGHT = DIAMOND_OPTIONS.height
      const WIDTH = DIAMOND_OPTIONS.width

      const object = new fabric.Polygon(
        [
          { x: WIDTH / 2, y: 0 },
          { x: WIDTH, y: HEIGHT / 2 },
          { x: WIDTH / 2, y: HEIGHT },
          { x: 0, y: HEIGHT / 2 },
        ],
        {
          ...DIAMOND_OPTIONS,
          fill: fillColor.value,
          stroke: strokeColor.value,
          strokeWidth: strokeWidth.value,
        },
      )
      addToCanvas(object)
    },
    getActiveFillColor: () => {
      const selectedObject = selectedObjects.value[0]

      if (!selectedObject) {
        return fillColor.value
      }

      const value = selectedObject.get('fill') || fillColor.value

      // Currently, gradients & patterns are not supported
      return value as string
    },
    canvas,
    fillColor,
    strokeColor,
    strokeWidth,
    selectedObjects,
  }
}

export function useEditor() {
  const canvas = ref<fabric.Canvas | null>(null)
  const container = ref<HTMLDivElement | null>(null)
  const selectedObjects = ref<fabric.Object[]>([])
  const fillColor = ref(FILL_COLOR)
  const strokeColor = ref(STROKE_COLOR)
  const strokeWidth = ref(STROKE_WIDTH)

  useAutoResize({ container, canvas })

  useCanvasEvents({ canvas, selectedObjects })

  const editor = computed(() => {
    if (!canvas.value) return
    return buildEditor({
      canvas: canvas.value,
      fillColor,
      strokeColor,
      strokeWidth,
      selectedObjects,
    })
  })

  function init(containerEl: HTMLDivElement, canvasEl: fabric.Canvas) {
    fabric.Object.prototype.set({
      cornerColor: '#FFF',
      cornerStyle: 'circle',
      borderColor: '#3b82f6',
      borderScaleFactor: 1.5,
      transparentCorners: false,
      borderOpacityWhenMoving: 1,
      cornerStrokeColor: '#3b82f6',
    })

    const initialWorkspace = new fabric.Rect({
      width: 900,
      height: 1200,
      name: 'clip',
      fill: 'white',
      selectable: false,
      hasControls: false,
      shadow: new fabric.Shadow({
        color: 'rgba(0,0,0,0.8)',
        blur: 5,
      }),
    })

    canvasEl.setWidth(containerEl.offsetWidth)
    canvasEl.setHeight(containerEl.offsetHeight)

    canvasEl.add(initialWorkspace)
    canvasEl.centerObject(initialWorkspace)
    canvasEl.clipPath = initialWorkspace

    container.value = containerEl
    canvas.value = canvasEl
  }

  return { editor, init }
}
