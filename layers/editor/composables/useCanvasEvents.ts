import { type ActiveTool, selectionDependentTools } from '../types'

interface UseCanvasEventsProps {
  // save: () => void
  canvas: Ref<fabric.Canvas | null>
  selectedObject: Ref<fabric.Object | null>
  selectedObjects: Ref<fabric.Object[]>
  activeTool: Ref<ActiveTool>
};

export function useCanvasEvents({ canvas, selectedObject, selectedObjects, activeTool }: UseCanvasEventsProps) {
  const stop = watch(canvas, (_canvas) => {
    if (!_canvas) return
    _canvas.on('selection:created', (e) => {
      selectedObjects.value = e.selected || []
      if (e.selected?.length) selectedObject.value = e.selected[0] || null
    })
    _canvas.on('selection:updated', (e) => {
      selectedObjects.value = e.selected || []
      if (e.selected?.length) selectedObject.value = e.selected[0] || null
    })
    _canvas.on('selection:cleared', () => {
      selectedObject.value = null
      selectedObjects.value = []
      if (selectionDependentTools.includes(activeTool.value)) {
        activeTool.value = 'select'
      }
    })

    stop()
  })
}
