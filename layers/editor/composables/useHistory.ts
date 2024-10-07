import { JSON_KEYS } from '../types'

interface UseHistoryProps {
  canvas: Ref<fabric.Canvas | null>
  saveCallback?: (values: {
    json: string
    height: number
    width: number
  }) => void
};

export function useHistory({ canvas, saveCallback }: UseHistoryProps) {
  const historyIndex = ref()
  const canvasHistory = ref<string[]>([])
  const skipSave = ref(false)

  const canUndo = computed(() => {
    return historyIndex.value > 0
  })

  const canRedo = computed(() => {
    return historyIndex.value < canvasHistory.value.length - 1
  })

  function save(skip = false) {
    if (!canvas.value) return

    const currentState = canvas.value.toJSON(JSON_KEYS)
    const json = JSON.stringify(currentState)

    if (!skip && !skipSave.value) {
      canvasHistory.value.push(json)
      historyIndex.value = canvasHistory.value.length - 1
    }

    const workspace = canvas.value
      .getObjects()
      .find(object => object.name === 'clip')
    const height = workspace?.height || 0
    const width = workspace?.width || 0

    saveCallback?.({ json, height, width })
  }

  const undo = () => {
    if (!canUndo.value) return
    skipSave.value = true
    canvas.value?.clear().renderAll()

    const previousIndex = historyIndex.value - 1
    if (!canvasHistory.value[previousIndex]) return
    const previousState = JSON.parse(
      canvasHistory.value[previousIndex],
    )

    canvas.value?.loadFromJSON(previousState, () => {
      canvas.value?.renderAll()
      historyIndex.value = previousIndex
      skipSave.value = false
    })
  }

  const redo = () => {
    if (!canRedo.value) return
    skipSave.value = true
    canvas.value?.clear().renderAll()

    const nextIndex = historyIndex.value + 1
    if (!canvasHistory.value[nextIndex]) return
    const nextState = JSON.parse(
      canvasHistory.value[nextIndex],
    )

    canvas.value?.loadFromJSON(nextState, () => {
      canvas.value?.renderAll()
      historyIndex.value = nextIndex
      skipSave.value = false
    })
  }

  return {
    save,
    canUndo,
    canRedo,
    undo,
    redo,
    historyIndex,
    canvasHistory,
  }
}
