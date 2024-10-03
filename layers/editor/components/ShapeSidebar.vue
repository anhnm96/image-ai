<script lang="ts" setup>
import type { ActiveTool } from '../types'
import { cn } from '~/lib/utils'

defineProps<{ activeTool: ActiveTool }>()
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
        />
        <ShapeTool
          icon="ph:square-fill"
        />
        <ShapeTool
          icon="ph:square-duotone"
        />
        <ShapeTool
          icon="ph:triangle-fill"
        />
        <ShapeTool
          icon="ph:triangle-fill"
          icon-class="rotate-180"
        />
        <ShapeTool
          icon="ph:diamond-fill"
        />
      </div>
    </ScrollArea>
    <ToolSidebarClose />
  </aside>
</template>
