import type { Canvas } from 'fabric'
import { FabricObject, Rect, Shadow } from 'fabric'

export function useEditor() {
  function init(containerEl: HTMLDivElement, canvasEl: Canvas) {
    const canvas = ref<Canvas | null>(null)
    const container = ref<HTMLDivElement | null>(null)

    useAutoResize({ container, canvas })
    FabricObject.prototype.set({
      cornerColor: '#FFF',
      cornerStyle: 'circle',
      borderColor: '#3b82f6',
      borderScaleFactor: 1.5,
      transparentCorners: false,
      borderOpacityWhenMoving: 1,
      cornerStrokeColor: '#3b82f6',
    })

    const initialWorkspace = new Rect({
      width: 900,
      height: 1200,
      name: 'clip',
      fill: 'white',
      selectable: false,
      hasControls: false,
      shadow: new Shadow({
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

  return { init }
}
