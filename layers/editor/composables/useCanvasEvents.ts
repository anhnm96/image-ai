interface UseCanvasEventsProps {
  // save: () => void
  canvas: Ref<fabric.Canvas | null>
  selectedObjects: Ref<fabric.Object[]>
  clearSelectionCallback?: () => void
};

export function useCanvasEvents({ canvas, selectedObjects, clearSelectionCallback }: UseCanvasEventsProps) {
  const stop = watch(canvas, (_canvas) => {
    if (!_canvas) return
    _canvas.on('selection:created', (e) => {
      selectedObjects.value = e.selected || []
    })
    _canvas.on('selection:updated', (e) => {
      selectedObjects.value = e.selected || []
    })
    _canvas.on('selection:cleared', () => {
      selectedObjects.value = []
      clearSelectionCallback?.()
    })

    stop()
  })
}
