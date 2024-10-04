<script lang="ts" setup>
import { cn } from '~/lib/utils'
import { useEditorStore } from '../stores/editor'
import { type ActiveTool, FONT_FAMILY, fonts } from '../types'

defineProps<{ activeTool: ActiveTool }>()
defineEmits<{
  'update:activeTool': [tool: ActiveTool]
}>()

const editorStore = useEditorStore()
const font = ref(editorStore.getActiveFontFamily)
function updateFontFamily(value: string) {
  font.value = value
  editorStore.changeFontFamily(value)
}

watch(() => editorStore.selectedObject, (val) => {
  // @ts-expect-error type
  font.value = val?.get('fontFamily') || FONT_FAMILY
})
</script>

<template>
  <aside
    :class="cn(
      'bg-white relative border-r z-[40] w-[360px] h-full flex flex-col',
      activeTool === 'font' ? 'visible' : 'hidden',
    )"
  >
    <ToolSidebarHeader
      title="Font"
      description="Change the text font"
    />
    <ScrollArea>
      <div class="p-4 space-y-1 border-b">
        <Button
          v-for="f in fonts"
          :key="f"
          variant="secondary"
          size="lg"
          :class="cn(
            'w-full h-16 justify-start text-left',
            font === f && 'border-2 border-blue-500',
          )"
          :style="{
            fontFamily: f,
            fontSize: '16px',
            padding: '8px 16px',
          }"
          @click="updateFontFamily(f)"
        >
          {{ f }}
        </Button>
      </div>
    </ScrollArea>
    <ToolSidebarClose @click="$emit('update:activeTool', 'select')" />
  </aside>
</template>
