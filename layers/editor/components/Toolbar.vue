<script lang="ts" setup>
import type { ActiveTool, Editor } from '../types'
import { cn } from '~/lib/utils'

const props = defineProps<{ editor: Editor | undefined, activeTool: ActiveTool }>()
defineEmits<{
  'update:activeTool': [tool: ActiveTool]
}>()

const fillProperty = props.editor?.fillColor
const properties = reactive({
  fillColor: fillProperty,
  // strokeColor: initialStrokeColor,
  // fontFamily: initialFontFamily,
  // fontWeight: initialFontWeight,
  // fontStyle: initialFontStyle,
  // fontLinethrough: initialFontLinethrough,
  // fontUnderline: initialFontUnderline,
  // textAlign: initialTextAlign,
  // fontSize: initialFontSize,
})
</script>

<template>
  <div class="shrink-0 h-[56px] border-b bg-white w-full flex items-center overflow-x-auto z-[49] p-2 gap-x-2">
    <div v-if="props.editor?.selectedObjects.value.length" class="flex items-center h-full justify-center">
      <Hint label="Color" side="bottom" :side-offset="5">
        <Button
          size="icon"
          variant="ghost"
          :class="[cn(
            activeTool === 'fill' && 'bg-gray-100',
          )]"
          @click="$emit('update:activeTool', 'fill')"
        >
          <div
            class="rounded-sm size-4 border"
            :style="{ backgroundColor: properties.fillColor }"
          />
        </Button>
      </Hint>
    </div>
  </div>
</template>
