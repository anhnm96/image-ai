<script lang="ts" setup>
import type { ActiveTool } from '../types'
import { cn } from '~/lib/utils'
import { useEditorStore } from '../stores/editor'

defineProps<{ activeTool: ActiveTool }>()
defineEmits<{
  'update:activeTool': [tool: ActiveTool]
}>()

const editorStore = useEditorStore()
</script>

<template>
  <aside
    :class="cn(
      'bg-white relative border-r z-[40] w-[360px] h-full flex flex-col',
      activeTool === 'fill' ? 'visible' : 'hidden',
    )"
  >
    <ToolSidebarHeader
      title="Fill color"
      description="Add fill color to your element"
    />
    <ScrollArea>
      <div class="p-4 space-y-6">
        <ColorPicker
          :model-value="editorStore.getActiveFillColor"
          @update:model-value="editorStore.setFillColor"
        />
      </div>
    </ScrollArea>
    <ToolSidebarClose @click="$emit('update:activeTool', 'select')" />
  </aside>
</template>
