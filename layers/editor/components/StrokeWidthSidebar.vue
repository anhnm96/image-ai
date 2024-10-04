<script lang="ts" setup>
import { cn } from '~/lib/utils'
import { useEditorStore } from '../stores/editor'
import { type ActiveTool, STROKE_DASH_ARRAY, STROKE_WIDTH } from '../types'

defineProps<{ activeTool: ActiveTool }>()
defineEmits<{
  'update:activeTool': [tool: ActiveTool]
}>()

const editorStore = useEditorStore()

const typeValue = ref(editorStore.getActiveStrokeDashArray)
function updateType(values: number[]) {
  typeValue.value = values
  editorStore.changeStrokeDashArray(values)
}

const widthValue = ref(editorStore.getActiveStrokeWidth)
function updateWidth(values: number[] | undefined) {
  if (!values) return
  widthValue.value = values[0]!
  editorStore.changeStrokeWidth(values[0]!)
}

watch(() => editorStore.selectedObject, (val) => {
  typeValue.value = val?.strokeDashArray || STROKE_DASH_ARRAY
  widthValue.value = val?.strokeWidth || STROKE_WIDTH
})
</script>

<template>
  <aside
    :class="[cn(
      'bg-white relative border-r z-[40] w-[360px] h-full flex flex-col',
      activeTool === 'stroke-width' ? 'visible' : 'hidden',
    )]"
  >
    <ToolSidebarHeader
      title="Stroke options"
      description="Modify the stroke of your element"
    />
    <ScrollArea>
      <div class="p-4 space-y-4 border-b">
        <Label class="text-sm">
          Stroke width {{ widthValue }} {{ typeValue }}
        </Label>
        <Slider
          :model-value="[widthValue]"
          @update:model-value="updateWidth"
        />
      </div>
      <div class="p-4 space-y-4 border-b">
        <Label class="text-sm">
          Stroke type
        </Label>
        <Button
          variant="secondary"
          size="lg"
          :class="cn(
            'w-full h-16 justify-start text-left',
            JSON.stringify(typeValue) === `[]` && 'border-2 border-blue-500',
          )"
          style="padding: 8px 16px"
          @click="updateType([])"
        >
          <div class="w-full border-black rounded-full border-4" />
        </Button>
        <Button
          variant="secondary"
          size="lg"
          :class="[cn(
            'w-full h-16 justify-start text-left',
            JSON.stringify(typeValue) === `[5,5]` && 'border-2 border-blue-500',
          )]"
          style="padding: 8px 16px"
          @click="updateType([5, 5])"
        >
          <div class="w-full border-black rounded-full border-4 border-dashed" />
        </Button>
      </div>
    </ScrollArea>
    <ToolSidebarClose @click="$emit('update:activeTool', 'select')" />
  </aside>
</template>
