import type { fabric } from 'fabric'

interface UseClipboardProps {
  canvas: Ref<fabric.Canvas | null>
};

export function useCloneCanvas({ canvas }: UseClipboardProps) {
  const clipboard = ref<any>(null)

  const copy = () => {
    canvas.value?.getActiveObject()?.clone((cloned: any) => {
      clipboard.value = cloned
    })
  }

  const paste = () => {
    if (!clipboard.value) return

    clipboard.value.clone((clonedObj: any) => {
      canvas.value?.discardActiveObject()
      clonedObj.set({
        left: clonedObj.left + 10,
        top: clonedObj.top + 10,
        evented: true,
      })

      if (clonedObj.type === 'activeSelection') {
        clonedObj.canvas = canvas
        clonedObj.forEachObject((obj: any) => {
          canvas.value?.add(obj)
        })
        clonedObj.setCoords()
      } else {
        canvas.value?.add(clonedObj)
      }

      clipboard.value.top += 10
      clipboard.value.left += 10
      canvas.value?.setActiveObject(clonedObj)
      canvas.value?.requestRenderAll()
    })
  }

  return { copy, paste }
}
