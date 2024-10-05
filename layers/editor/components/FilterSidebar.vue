<script lang="ts" setup>
import type { ActiveTool } from '../types'
import { cn } from '~/lib/utils'
import { useEditorStore } from '../stores/editor'
import { filters } from '../types'

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
      activeTool === 'filter' ? 'visible' : 'hidden',
    )"
  >
    <ToolSidebarHeader
      title="Filters"
      description="Apply a filter to selected image"
    />
    <ScrollArea>
      <div class="p-4 space-y-1 border-b">
        <Button
          v-for="filter in filters"
          :key="filter"
          variant="secondary"
          size="lg"
          class="w-full h-16 justify-start text-left"
          @click="editorStore.changeImageFilter(filter)"
        >
          {{ filter }}
        </Button>
      </div>
    </ScrollArea>
    <ToolSidebarClose @click="$emit('update:activeTool', 'select')" />
  </aside>
</template>
