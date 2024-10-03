<script lang="ts" setup>
import type { ActiveTool } from '../types'
import { fabric } from 'fabric'

const activeTool = ref<ActiveTool>('select')
function setActiveTool(tool: ActiveTool) {
  if (tool === activeTool.value) {
    activeTool.value = 'select'
    return
  }
  activeTool.value = tool
}

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
    <Navbar v-model:active-tool="activeTool" />
    <div class="absolute h-[calc(100%-68px)] w-full top-[68px] flex">
      <Sidebar :active-tool="activeTool" @update:active-tool="setActiveTool" />
      <ShapeSidebar :active-tool="activeTool" />
      <main class="bg-muted flex-1 overflow-auto relative flex flex-col">
        <Toolbar />
        <div ref="container" class="flex-1 h-[calc(100%-124px)] bg-muted">
          <canvas ref="canvas" />
        </div>
        <Footer />
      </main>
    </div>
  </div>
</template>
