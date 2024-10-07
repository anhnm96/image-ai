import { type ActiveTool, selectionDependentTools } from '../types'

interface UseCanvasEventsProps {
  save: () => void
  canvas: Ref<fabric.Canvas | null>
  selectedObject: Ref<fabric.Object | null>
  selectedObjects: Ref<fabric.Object[]>
  activeTool: Ref<ActiveTool>
};

export function useCanvasEvents({ save, canvas, selectedObject, selectedObjects, activeTool }: UseCanvasEventsProps) {
  const stop = watch(canvas, (_canvas) => {
    if (!_canvas) return
    _canvas.on('object:added', () => save())
    _canvas.on('object:removed', () => save())
    _canvas.on('object:modified', () => save())
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
  onScopeDispose(() => {
    console.log('dispose')
    canvas.value?.off('object:added')
    canvas.value?.off('object:removed')
    canvas.value?.off('object:modified')
    canvas.value?.off('selection:created')
    canvas.value?.off('selection:updated')
    canvas.value?.off('selection:cleared')
  })
}
