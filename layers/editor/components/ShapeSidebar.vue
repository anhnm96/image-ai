<script lang="ts" setup>
import type { ActiveTool } from '../types'
import { cn } from '~/lib/utils'
import { useEditorStore } from '../stores/editor'

defineProps<{ activeTool: ActiveTool }>()

const editorStore = useEditorStore()
</script>

<template>
  <aside
    :class="cn(
      'bg-white relative border-r z-[40] w-[360px] h-full flex flex-col',
      activeTool === 'shapes' ? 'visible' : 'hidden',
    )"
  >
    <ToolSidebarHeader
      title="Shapes"
      description="Add shapes to your canvas"
    />
    <ScrollArea>
      <div class="grid grid-cols-3 gap-4 p-4">
        <ShapeTool
          icon="ph:circle-fill"
          @click="editorStore.addCircle()"
        />
        <ShapeTool
          icon="ph:square-fill"
          @click="editorStore.addSoftRectangle()"
        />
        <ShapeTool
          icon="ph:square-duotone"
          @click="editorStore.addRectangle()"
        />
        <ShapeTool
          icon="ph:triangle-fill"
          @click="editorStore.addTriangle()"
        />
        <ShapeTool
          icon="ph:triangle-fill"
          icon-class="rotate-180"
          @click="editorStore.addInverseTriangle()"
        />
        <ShapeTool
          icon="ph:diamond-fill"
          @click="editorStore.addDiamond()"
        />
      </div>
    </ScrollArea>
    <ToolSidebarClose />
  </aside>
</template>
