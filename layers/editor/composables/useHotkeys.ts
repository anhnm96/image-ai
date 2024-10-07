import { fabric } from 'fabric'

interface UseHotkeysProps {
  canvas: Ref<fabric.Canvas | null>
  undo: () => void
  redo: () => void
  save: (skip?: boolean) => void
  copy: () => void
  paste: () => void
}

export function useHotkeys({ canvas, undo, redo, save, copy, paste }: UseHotkeysProps) {
  useEventListener('keydown', (event) => {
    const isCtrlKey = event.ctrlKey || event.metaKey
    const isBackspace = event.key === 'Backspace'
    const isInput = ['INPUT', 'TEXTAREA'].includes(
      (event.target as HTMLElement).tagName,
    )

    if (isInput) return

    if (isBackspace) {
      canvas.value?.remove(...canvas.value.getActiveObjects())
      canvas.value?.discardActiveObject()
    }

    if (isCtrlKey && event.key === 'z') {
      event.preventDefault()
      undo()
    }

    if (isCtrlKey && event.key === 'y') {
      event.preventDefault()
      redo()
    }

    if (isCtrlKey && event.key === 'c') {
      event.preventDefault()
      copy()
    }

    if (isCtrlKey && event.key === 'v') {
      event.preventDefault()
      paste()
    }

    if (isCtrlKey && event.key === 's') {
      event.preventDefault()
      save(true)
    }

    if (isCtrlKey && event.key === 'a') {
      event.preventDefault()
      canvas.value?.discardActiveObject()

      const allObjects = canvas.value?.getObjects()
        .filter(object => object.selectable)

      canvas.value?.setActiveObject(
        new fabric.ActiveSelection(allObjects, { canvas: canvas.value }),
      )
      canvas.value?.renderAll()
    }
  })
}
