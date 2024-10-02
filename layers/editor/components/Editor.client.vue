<script lang="ts" setup>
import { fabric } from 'fabric'

const { init } = useEditor()

const containerEl = useTemplateRef('container')
const canvasEl = useTemplateRef('canvas')

onMounted(async () => {
  await nextTick()

  const canvas = new fabric.Canvas(canvasEl.value!, {
    controlsAboveOverlay: true,
    preserveObjectStacking: true,

  })
  init(containerEl.value!, canvas)
})
</script>

<template>
  <div class="h-full flex flex-col">
    <div ref="container" class="flex-1 h-full bg-muted">
      <canvas ref="canvas" />
    </div>
  </div>
</template>
