<script lang="ts" setup>
import type { ActiveTool } from '../types'
import { cn } from '~/lib/utils'
import { useEditorStore } from '../stores/editor'

defineProps<{ activeTool: ActiveTool }>()
defineEmits<{
  'update:activeTool': [tool: ActiveTool]
}>()

const editorStore = useEditorStore()
const opacity = ref(editorStore.getActiveOpacity)
function updateOpacity(value: number) {
  opacity.value = value
  editorStore.changeOpacity(value)
}

watch(() => editorStore.selectedObject, (val) => {
  opacity.value = val?.opacity || 1
})
</script>

<template>
  <aside
    :class="cn(
      'bg-white relative border-r z-[40] w-[360px] h-full flex flex-col',
      activeTool === 'opacity' ? 'visible' : 'hidden',
    )"
  >
    <ToolSidebarHeader
      title="Opacity"
      description="Change the opacity of the selected object"
    />
    <ScrollArea>
      <div class="p-4 space-y-6 border-b">
        <Slider
          :model-value="[opacity]"
          :max="1"
          :min="0"
          :step="0.01"
          @update:model-value="(values) => updateOpacity(values?.[0] || 1)"
        />
      </div>
    </ScrollArea>
    <ToolSidebarClose @click="$emit('update:activeTool', 'select')" />
  </aside>
</template>
