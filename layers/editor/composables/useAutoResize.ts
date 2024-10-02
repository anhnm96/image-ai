import { type Canvas, iMatrix, Point, util } from 'fabric'

interface UseAutoResizeProps {
  container: Ref<HTMLDivElement | null>
  canvas: Ref<Canvas | null>
}

export function useAutoResize({ canvas, container }: UseAutoResizeProps) {
  let resizeObserver: ResizeObserver | null = null

  function autoZoom() {
    if (!canvas.value || !container.value) return
    const width = container.value?.offsetWidth
    const height = container.value?.offsetHeight
    canvas.value?.setWidth(width)
    canvas.value?.setWidth(height)

    const center = canvas.value.getCenter()
    const zoomRatio = 0.85
    const localWorkspace = canvas.value.getObjects().find(obj => obj.name === 'clip')
    const scale = util.findScaleToFit(localWorkspace, {
      width,
      height,
    })
    const zoom = zoomRatio * scale

    canvas.value.setViewportTransform(iMatrix.concat())
    canvas.value.zoomToPoint(new Point(center.left, center.top), zoom)
    if (!localWorkspace) return
    const workspaceCenter = localWorkspace.getCenterPoint()
    const viewportTransform = canvas.value.viewportTransform

    if (canvas.value.width === undefined || canvas.value.height === undefined || !viewportTransform) {
      return
    }

    viewportTransform[4] = canvas.value.width / 2 - workspaceCenter.x * viewportTransform[0]
    viewportTransform[5] = canvas.value.height / 2 - workspaceCenter.y * viewportTransform[3]
    canvas.value.setViewportTransform(viewportTransform)
    localWorkspace.clone((cloned: Rect) => {
      canvas.value!.clipPath = cloned
      canvas.value?.requestRenderAll()
    })
  }

  onMounted(() => {
    if (canvas.value && container.value) {
      resizeObserver = new ResizeObserver(() => {
        autoZoom()
      })

      resizeObserver.observe(container.value)
    }
  })

  onBeforeUnmount(() => {
    resizeObserver?.disconnect()
  })
}
