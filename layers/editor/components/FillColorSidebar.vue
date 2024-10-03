<script lang="ts" setup>
import type { ActiveTool, Editor } from '../types'
import { cn } from '~/lib/utils'
import { FILL_COLOR } from '../types'

const props = defineProps<{ activeTool: ActiveTool, editor?: Editor }>()
defineEmits<{
  'update:activeTool': [tool: ActiveTool]
}>()

const value = props.editor?.getActiveFillColor() || FILL_COLOR
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
          :model-value="value"
          @update:model-value="editor?.setFillColor"
        />
      </div>
    </ScrollArea>
    <ToolSidebarClose @click="$emit('update:activeTool', 'select')" />
  </aside>
</template>
