<script lang="ts" setup>
import type { ActiveTool, Editor } from '../types'
import { cn } from '~/lib/utils'

defineProps<{ activeTool: ActiveTool, editor?: Editor }>()
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
          @click="editor?.addCircle()"
        />
        <ShapeTool
          icon="ph:square-fill"
          @click="editor?.addSoftRectangle()"
        />
        <ShapeTool
          icon="ph:square-duotone"
          @click="editor?.addRectangle()"
        />
        <ShapeTool
          icon="ph:triangle-fill"
          @click="editor?.addTriangle()"
        />
        <ShapeTool
          icon="ph:triangle-fill"
          icon-class="rotate-180"
          @click="editor?.addInverseTriangle()"
        />
        <ShapeTool
          icon="ph:diamond-fill"
          @click="editor?.addDiamond()"
        />
      </div>
    </ScrollArea>
    <ToolSidebarClose />
  </aside>
</template>
