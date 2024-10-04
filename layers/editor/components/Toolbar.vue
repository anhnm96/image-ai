<script lang="ts" setup>
import type { ActiveTool } from '../types'
import { cn } from '~/lib/utils'
import { useEditorStore } from '../stores/editor'
import { isTextType } from '../utils'

defineProps<{ activeTool: ActiveTool }>()
defineEmits<{
  'update:activeTool': [tool: ActiveTool]
}>()

const editorStore = useEditorStore()
const isText = ref(isTextType(editorStore.selectedObject?.type || ''))
watch(() => editorStore.selectedObject, (val) => {
  isText.value = isTextType(val?.type || '')
})
// const properties = reactive({
// fillColor: editorStore.getActiveFillColor,
// strokeColor: initialStrokeColor,
// fontFamily: initialFontFamily,
// fontWeight: initialFontWeight,
// fontStyle: initialFontStyle,
// fontLinethrough: initialFontLinethrough,
// fontUnderline: initialFontUnderline,
// textAlign: initialTextAlign,
// fontSize: initialFontSize,
// })
</script>

<template>
  <div class="shrink-0 h-[56px] border-b bg-white w-full flex items-center overflow-x-auto z-[49] p-2 gap-x-2">
    <div v-if="editorStore.selectedObjects.length" class="flex items-center h-full justify-center">
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
            :style="{ backgroundColor: editorStore.getActiveFillColor }"
          />
        </Button>
      </Hint>
      <template v-if="!isText">
        <Hint label="Stroke color" side="bottom" :side-offset="5">
          <Button
            size="icon"
            variant="ghost"
            :class="[cn(
              activeTool === 'stroke-color' && 'bg-gray-100',
            )]"
            @click="$emit('update:activeTool', 'stroke-color')"
          >
            <div
              class="rounded-sm size-4 border-2 bg-white"
              :style="{ borderColor: editorStore.getActiveStrokeColor }"
            />
          </Button>
        </Hint>
        <Hint label="Stroke width" side="bottom" :side-offset="5">
          <Button
            size="icon"
            variant="ghost"
            :class="[cn(
              activeTool === 'stroke-width' && 'bg-gray-100',
            )]"
            @click="$emit('update:activeTool', 'stroke-width')"
          >
            <Icon class="text-black" name="radix-icons:border-width" />
          </Button>
        </Hint>
      </template>
      <Hint v-if="isText" label="Font" side="bottom" :side-offset="5">
        <Button
          size="icon"
          variant="ghost"
          :class="cn(
            'w-auto px-2 text-sm',
            activeTool === 'font' && 'bg-gray-100',
          )"
          @click="$emit('update:activeTool', 'font')"
        >
          <div class="max-w-[100px] truncate">
            {{ editorStore.getActiveFontFamily }}
          </div>
          <Icon class="ml-2 shrink-0" name="lucide:chevron-down" />
        </Button>
      </Hint>
      <Hint label="Bring forward" side="bottom" :side-offset="5">
        <Button
          size="icon"
          variant="ghost"
          @click="editorStore.bringForward()"
        >
          <Icon name="lucide:arrow-up" />
        </Button>
      </Hint>
      <Hint label="Send backwards" side="bottom" :side-offset="5">
        <Button
          size="icon"
          variant="ghost"
          @click="editorStore.sendBackwards()"
        >
          <Icon name="lucide:arrow-down" />
        </Button>
      </Hint>
      <Hint label="Opacity" side="bottom" :side-offset="5">
        <Button
          size="icon"
          variant="ghost"
          :class="[cn(activeTool === 'opacity' && 'bg-gray-100')]"
          @click="$emit('update:activeTool', 'opacity')"
        >
          <Icon name="ph:cube-transparent" />
        </Button>
      </Hint>
    </div>
  </div>
</template>
