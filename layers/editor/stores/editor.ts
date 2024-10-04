import { fabric } from 'fabric'
import { type ActiveTool, CIRCLE_OPTIONS, DIAMOND_OPTIONS, FILL_COLOR, RECTANGLE_OPTIONS, STROKE_COLOR, STROKE_DASH_ARRAY, STROKE_WIDTH, TRIANGLE_OPTIONS } from '../types.js'
import { isTextType } from '../utils.js'

export const useEditorStore = defineStore('editor', () => {
  const activeTool = shallowRef<ActiveTool>('select')
  const canvas = shallowRef<fabric.Canvas | null>(null)
  const container = ref<HTMLDivElement | null>(null)
  const selectedObject = ref<fabric.Object | null>(null)
  const selectedObjects = shallowRef<fabric.Object[]>([])
  const fillColor = ref(FILL_COLOR)
  const strokeColor = ref(STROKE_COLOR)
  const strokeWidth = ref(STROKE_WIDTH)
  const strokeDashArray = ref<number[]>(STROKE_DASH_ARRAY)

  useAutoResize({ container, canvas })

  useCanvasEvents({ canvas, selectedObject, selectedObjects, activeTool })

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

  function getWorkspace() {
    return canvas.value?.getObjects().find(obj => obj.name === 'clip')
  }

  function center(object: fabric.Object) {
    const workspace = getWorkspace()
    const center = workspace?.getCenterPoint()

    if (!center) return
    // @ts-expect-error type
    canvas.value._centerObject(object, center)
  }

  function addToCanvas(object: fabric.Object) {
    center(object)
    canvas.value?.add(object)
    canvas.value?.setActiveObject(object)
  }

  function setFillColor(val: string) {
    fillColor.value = val
    canvas.value?.getActiveObjects().forEach((object) => {
      object.set({ fill: val })
    })
    canvas.value?.renderAll()
  }
  function setStrokeColor(val: string) {
    if (!canvas.value) return
    strokeColor.value = val
    canvas.value?.getActiveObjects().forEach((object) => {
      // Text types don't have stroke
      if (isTextType(object.type)) {
        object.set({ fill: val })
        return
      }

      object.set({ stroke: val })
    })
    canvas.value.freeDrawingBrush.color = val
    canvas.value.renderAll()
  }
  function setStrokeWidth(val: number) {
    if (!canvas.value) return
    strokeWidth.value = val
    canvas.value.getActiveObjects().forEach((object) => {
      object.set({ strokeWidth: val })
    })
    canvas.value.freeDrawingBrush.width = val
    canvas.value.renderAll()
  }
  function addCircle() {
    const object = new fabric.Circle({
      ...CIRCLE_OPTIONS,
      fill: fillColor.value,
      stroke: strokeColor.value,
      strokeWidth: strokeWidth.value,
    })
    addToCanvas(object)
  }
  function addSoftRectangle() {
    const object = new fabric.Rect({
      ...RECTANGLE_OPTIONS,
      rx: 50,
      ry: 50,
      fill: fillColor.value,
      stroke: strokeColor.value,
      strokeWidth: strokeWidth.value,
    })
    addToCanvas(object)
  }
  function addRectangle() {
    const object = new fabric.Rect({
      ...RECTANGLE_OPTIONS,
      fill: fillColor.value,
      stroke: strokeColor.value,
      strokeWidth: strokeWidth.value,
    })
    addToCanvas(object)
  }
  function addTriangle() {
    const object = new fabric.Triangle({
      ...TRIANGLE_OPTIONS,
      fill: fillColor.value,
      stroke: strokeColor.value,
      strokeWidth: strokeWidth.value,
    })

    addToCanvas(object)
  }
  function addInverseTriangle() {
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
  }
  function addDiamond() {
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
  }

  function changeStrokeWidth(value: number) {
    if (!canvas.value) return
    setStrokeWidth(value)
    canvas.value.getActiveObjects().forEach((object) => {
      object.set({ strokeWidth: value })
    })
    canvas.value.freeDrawingBrush.width = value
    canvas.value.renderAll()
  }

  function changeStrokeDashArray(value: number[]) {
    if (!canvas.value) return
    strokeDashArray.value = value
    canvas.value.getActiveObjects().forEach((object) => {
      object.set({ strokeDashArray: value })
    })
    canvas.value.renderAll()
  }

  const getActiveFillColor = computed(() => {
    if (!selectedObject.value) {
      return fillColor.value
    }

    const value = selectedObject.value.get('fill') || fillColor.value

    // Currently, gradients & patterns are not supported
    return value as string
  })

  function bringForward() {
    selectedObjects.value.forEach((object) => {
      canvas.value?.bringForward(object)
    })

    canvas.value?.renderAll()

    const workspace = getWorkspace()
    workspace?.sendToBack()
  }

  function sendBackwards() {
    selectedObjects.value.forEach((object) => {
      canvas.value?.sendBackwards(object)
    })

    canvas.value?.renderAll()
    const workspace = getWorkspace()
    workspace?.sendToBack()
  }

  function changeOpacity(value: number) {
    selectedObjects.value.forEach((object) => {
      object.set({ opacity: value })
    })
    canvas.value?.renderAll()
  }

  const getActiveStrokeColor = computed(() => {
    if (!selectedObject.value) {
      return strokeColor.value
    }

    const value = selectedObject.value.get('stroke') || strokeColor.value

    return value
  })

  const getActiveStrokeWidth = computed(() => {
    if (!selectedObject.value) {
      return strokeWidth.value
    }

    const value = selectedObject.value.get('strokeWidth') || strokeWidth.value

    return value
  })

  const getActiveStrokeDashArray = computed(() => {
    if (!selectedObject.value) {
      return strokeDashArray.value
    }

    const value = selectedObject.value.get('strokeDashArray') || strokeDashArray.value

    return value
  })

  const getActiveOpacity = computed(() => {
    if (!selectedObject.value) {
      return 1
    }

    const value = selectedObject.value.get('opacity') || 1

    return value
  })

  return {
    activeTool,
    canvas,
    selectedObjects,
    init,
    setFillColor,
    setStrokeColor,
    setStrokeWidth,
    addCircle,
    addSoftRectangle,
    addRectangle,
    addTriangle,
    addInverseTriangle,
    addDiamond,
    changeStrokeWidth,
    changeStrokeDashArray,
    bringForward,
    sendBackwards,
    changeOpacity,
    selectedObject,
    getActiveFillColor,
    getActiveStrokeColor,
    getActiveStrokeWidth,
    getActiveStrokeDashArray,
    getActiveOpacity,
  }
})
