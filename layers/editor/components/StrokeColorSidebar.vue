<script lang="ts" setup>
import type { ActiveTool } from '../types'
import { cn } from '~/lib/utils'
import { useEditorStore } from '../stores/editor'

defineProps<{ activeTool: ActiveTool }>()
defineEmits<{
  'update:activeTool': [tool: ActiveTool]
}>()

const editorStore = useEditorStore()
const value = computed(() => editorStore.getActiveStrokeColor)
</script>

<template>
  <aside
    :class="[cn(
      'bg-white relative border-r z-[40] w-[360px] h-full flex flex-col',
      activeTool === 'stroke-color' ? 'visible' : 'hidden',
    )]"
  >
    <ToolSidebarHeader
      title="Stroke color"
      description="Add stroke color to your element"
    />
    <ScrollArea>
      <div class="p-4 space-y-6">
        <ColorPicker
          :model-value="value"
          @update:model-value="editorStore.setStrokeColor"
        />
      </div>
    </ScrollArea>
    <ToolSidebarClose @click="$emit('update:activeTool', 'select')" />
  </aside>
</template>
