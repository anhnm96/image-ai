<script lang="ts" setup>
import type { ActiveTool } from '../types'
import { cn } from '~/lib/utils'
import { useEditorStore } from '../stores/editor'

defineProps<{ activeTool: ActiveTool }>()
defineEmits<{
  'update:activeTool': [tool: ActiveTool]
}>()

const editorStore = useEditorStore()

function onColorChange(value: string) {
  editorStore.changeStrokeColor(value)
}

function onWidthChange(value: number[] | undefined) {
  if (!value) return
  editorStore.changeStrokeWidth(value[0] as number)
}
</script>

<template>
  <aside
    :class="cn(
      'bg-white relative border-r z-[40] w-[360px] h-full flex flex-col',
      activeTool === 'draw' ? 'visible' : 'hidden',
    )"
  >
    <ToolSidebarHeader
      title="Drawing mode"
      description="Modify brush settings"
    />
    <ScrollArea>
      <div class="p-4 space-y-6 border-b">
        <Label class="text-sm">
          Brush width
        </Label>
        <Slider
          :value="[editorStore.getActiveStrokeWidth]"
          @update:model-value="onWidthChange"
        />
      </div>
      <div class="p-4 space-y-6">
        <ColorPicker
          :model-value="editorStore.getActiveFillColor"
          @update:model-value="onColorChange"
        />
      </div>
    </ScrollArea>
    <ToolSidebarClose @click="$emit('update:activeTool', 'select')" />
  </aside>
</template>
