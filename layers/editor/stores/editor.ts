import { fabric } from 'fabric'
import { type ActiveTool, CIRCLE_OPTIONS, DIAMOND_OPTIONS, FILL_COLOR, FONT_FAMILY, FONT_SIZE, FONT_WEIGHT, JSON_KEYS, RECTANGLE_OPTIONS, STROKE_COLOR, STROKE_DASH_ARRAY, STROKE_WIDTH, TEXT_OPTIONS, TRIANGLE_OPTIONS } from '../types.js'
import { createFilter, isTextType } from '../utils.js'

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
  const fontFamily = ref(FONT_FAMILY)

  const { autoZoom } = useAutoResize({ container, canvas })

  const {
    save,
    canRedo,
    canUndo,
    undo,
    redo,
    canvasHistory,
    historyIndex,
  } = useHistory({
    canvas,
  })

  useCanvasEvents({ save, canvas, selectedObject, selectedObjects, activeTool })

  const { copy, paste } = useCloneCanvas({ canvas })

  useHotkeys({ undo, redo, copy, paste, save, canvas })

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

    canvasHistory.value = [JSON.stringify(canvas.value.toJSON(JSON_KEYS))]
    historyIndex.value = 0
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
    setStrokeWidth(value)
    if (!canvas.value) return
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
  };

  function addText(value: string, options?: fabric.ITextboxOptions) {
    const object = new fabric.Textbox(value, {
      ...TEXT_OPTIONS,
      fill: fillColor.value,
      ...options,
    })

    addToCanvas(object)
  }

  function changeFontFamily(value: string) {
    fontFamily.value = value
    selectedObjects.value.forEach((object) => {
      if (isTextType(object.type)) {
        // @ts-expect-error fontFamily exists.
        object.set({ fontFamily: value })
      }
    })
    canvas.value?.renderAll()
  }

  function changeFontWeight(value: number) {
    canvas.value?.getActiveObjects().forEach((object) => {
      if (isTextType(object.type)) {
        // @ts-expect-error type
        object.set({ fontWeight: value })
      }
    })
    canvas.value?.renderAll()
  }

  function changeFontStyle(value: string) {
    selectedObjects.value.forEach((object) => {
      if (isTextType(object.type)) {
        // @ts-expect-error type
        object.set({ fontStyle: value })
      }
    })
    canvas.value?.renderAll()
  }

  function changeFontUnderline(value: boolean) {
    selectedObjects.value.forEach((object) => {
      if (isTextType(object.type)) {
        // @ts-expect-error type
        object.set({ underline: value })
      }
    })
    canvas.value?.renderAll()
  }

  function changeFontLinethrough(value: boolean) {
    selectedObjects.value.forEach((object) => {
      if (isTextType(object.type)) {
        // @ts-expect-error type
        object.set({ linethrough: value })
      }
    })
    canvas.value?.renderAll()
  }

  function changeTextAlign(value: string) {
    selectedObjects.value.forEach((object) => {
      if (isTextType(object.type)) {
        // @ts-expect-error type
        object.set({ textAlign: value })
      }
    })
    canvas.value?.renderAll()
  }

  function changeFontSize(value: number) {
    selectedObjects.value.forEach((object) => {
      if (isTextType(object.type)) {
        // @ts-expect-error type
        object.set({ fontSize: value })
      }
    })
    canvas.value?.renderAll()
  }

  function deleteSelected() {
    selectedObjects.value.forEach(object => canvas.value?.remove(object))
    canvas.value?.discardActiveObject()
    canvas.value?.renderAll()
  }

  function addImage(value: string) {
    fabric.Image.fromURL(
      value,
      (image) => {
        const workspace = getWorkspace()

        image.scaleToWidth(workspace?.width || 0)
        image.scaleToHeight(workspace?.height || 0)

        addToCanvas(image)
      },
      {
        crossOrigin: 'anonymous',
      },
    )
  }

  function changeImageFilter(value: string) {
    selectedObjects.value.forEach((object) => {
      if (object.type === 'image') {
        const imageObject = object as fabric.Image

        const effect = createFilter(value)

        imageObject.filters = effect ? [effect] : []
        imageObject.applyFilters()
        canvas.value?.renderAll()
      }
    })
  }

  function enableDrawingMode() {
    if (!canvas.value) return
    canvas.value.discardActiveObject()
    canvas.value.renderAll()
    canvas.value.isDrawingMode = true
    canvas.value.freeDrawingBrush.width = strokeWidth.value
    canvas.value.freeDrawingBrush.color = strokeColor.value
  }
  function disableDrawingMode() {
    if (!canvas.value) return
    canvas.value.isDrawingMode = false
  }

  function changeStrokeColor(value: string) {
    strokeColor.value = value
    selectedObjects.value.forEach((object) => {
      // Text types don't have stroke
      if (isTextType(object.type)) {
        object.set({ fill: value })
        return
      }

      object.set({ stroke: value })
    })
    if (!canvas.value) return
    canvas.value.freeDrawingBrush.color = value
    canvas.value.renderAll()
  }

  function changeSize(value: { width: number, height: number }) {
    const workspace = getWorkspace()

    workspace?.set(value)
    autoZoom()
    save()
  }

  function changeBackground(value: string) {
    const workspace = getWorkspace()
    workspace?.set({ fill: value })
    canvas.value?.renderAll()
    save()
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

  const getActiveFontFamily = computed(() => {
    if (!selectedObject.value) {
      return fontFamily.value
    }

    // @ts-expect-error fontFamily exists.
    const value = selectedObject.value.get('fontFamily') || fontFamily.value

    return value
  })

  const getActiveFontWeight = computed(() => {
    if (!selectedObject.value) {
      return FONT_WEIGHT
    }

    // @ts-expect-error type
    const value = selectedObject.value.get('fontWeight') || FONT_WEIGHT

    return value
  })

  const getActiveFontStyle = computed(() => {
    if (!selectedObject.value) {
      return 'normal'
    }

    // @ts-expect-error type
    const value = selectedObject.value.get('fontStyle') || 'normal'

    return value
  })

  const getActiveFontUnderline = computed(() => {
    if (!selectedObject.value) {
      return false
    }

    // @ts-expect-error type
    const value = selectedObject.value.get('underline') || false

    return value
  })

  const getActiveFontLinethrough = computed(() => {
    if (!selectedObject.value) {
      return false
    }

    // @ts-expect-error type
    const value = selectedObject.value.get('linethrough') || false

    return value
  })

  const getActiveTextAlign = computed(() => {
    if (!selectedObject.value) {
      return 'left'
    }

    // @ts-expect-error type
    const value = selectedObject.value.get('textAlign') || 'left'

    return value
  })

  const getActiveFontSize = computed(() => {
    if (!selectedObject.value) {
      return FONT_SIZE
    }

    // @ts-expect-error type
    const value = selectedObject.value.get('fontSize') || FONT_SIZE

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
    addText,
    changeFontFamily,
    changeFontWeight,
    changeFontStyle,
    changeFontUnderline,
    changeFontLinethrough,
    changeTextAlign,
    changeFontSize,
    deleteSelected,
    addImage,
    changeImageFilter,
    copy,
    paste,
    enableDrawingMode,
    disableDrawingMode,
    changeStrokeColor,
    changeSize,
    changeBackground,
    getWorkspace,
    zoomIn: () => {
      if (!canvas.value) return
      let zoomRatio = canvas.value.getZoom()
      zoomRatio += 0.05
      const center = canvas.value.getCenter()
      canvas.value.zoomToPoint(
        new fabric.Point(center.left, center.top),
        zoomRatio > 1 ? 1 : zoomRatio,
      )
    },
    zoomOut: () => {
      if (!canvas.value) return
      let zoomRatio = canvas.value.getZoom()
      zoomRatio -= 0.05
      const center = canvas.value.getCenter()
      canvas.value.zoomToPoint(
        new fabric.Point(center.left, center.top),
        zoomRatio < 0.2 ? 0.2 : zoomRatio,
      )
    },
    autoZoom,
    canRedo,
    canUndo,
    undo,
    redo,
    canvasHistory,
    historyIndex,
    selectedObject,
    getActiveFillColor,
    getActiveStrokeColor,
    getActiveStrokeWidth,
    getActiveStrokeDashArray,
    getActiveOpacity,
    getActiveFontFamily,
    getActiveFontWeight,
    getActiveFontStyle,
    getActiveFontUnderline,
    getActiveFontLinethrough,
    getActiveTextAlign,
    getActiveFontSize,
  }
})
