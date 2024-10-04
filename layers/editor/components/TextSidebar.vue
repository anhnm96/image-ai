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
      activeTool === 'text' ? 'visible' : 'hidden',
    )"
  >
    <ToolSidebarHeader
      title="Text"
      description="Add text to your canvas"
    />
    <ScrollArea>
      <div class="p-4 space-y-4 border-b">
        <Button
          class="w-full"
          @click="editorStore.addText('Textbox')"
        >
          Add a textbox
        </Button>
        <Button
          class="w-full h-16"
          variant="secondary"
          size="lg"
          @click="editorStore.addText('Heading', {
            fontSize: 80,
            fontWeight: 700,
          })"
        >
          <span class="text-3xl font-bold">
            Add a heading
          </span>
        </Button>
        <Button
          class="w-full h-16"
          variant="secondary"
          size="lg"
          @click="editorStore.addText('Subheading', {
            fontSize: 44,
            fontWeight: 600,
          })"
        >
          <span class="text-xl font-semibold">
            Add a subheading
          </span>
        </Button>
        <Button
          class="w-full h-16"
          variant="secondary"
          size="lg"
          @click="editorStore.addText('Paragraph', { fontSize: 32 })"
        >
          Paragraph
        </Button>
      </div>
    </ScrollArea>
    <ToolSidebarClose @click="$emit('update:activeTool', 'select')" />
  </aside>
</template>
