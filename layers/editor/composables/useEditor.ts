import type { Canvas } from 'fabric'
import { Rect, Shadow } from 'fabric'

export function useEditor() {
  function init(containerEl: HTMLDivElement, canvasEl: Canvas) {
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
  }

  return { init }
}
