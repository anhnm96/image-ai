<script lang="ts" setup>
import { cn } from '~/lib/utils'
import { useEditorStore } from '../stores/editor'
import { type ActiveTool, FONT_WEIGHT } from '../types'
import { isTextType } from '../utils'

defineProps<{ activeTool: ActiveTool }>()
defineEmits<{
  'update:activeTool': [tool: ActiveTool]
}>()

const editorStore = useEditorStore()
const isText = ref(isTextType(editorStore.selectedObject?.type || ''))
// @ts-expect-error type
const fontWeight = ref(editorStore.selectedObject?.get('fontWeight') || FONT_WEIGHT)
function toggleBold() {
  if (!editorStore.selectedObject) return
  // @ts-expect-error type
  const newVal = editorStore.selectedObject.get('fontWeight') > 500 ? 500 : 700
  editorStore.changeFontWeight(newVal)
  fontWeight.value = newVal
}

const fontStyle = ref(editorStore.getActiveFontStyle)
function toggleItalic() {
  if (!editorStore.selectedObject) return

  const isItalic = fontStyle.value === 'italic'
  const newValue = isItalic ? 'normal' : 'italic'

  editorStore.changeFontStyle(newValue)
  fontStyle.value = newValue
}

const fontUnderline = ref(editorStore.getActiveFontUnderline)
function toggleUnderline() {
  if (!editorStore.selectedObject) return

  const newValue = !fontUnderline.value

  editorStore.changeFontUnderline(newValue)
  fontUnderline.value = newValue
}

const fontLinethrough = ref(editorStore.getActiveFontLinethrough)
function toggleLinethrough() {
  if (!editorStore.selectedObject) return

  const newValue = !fontLinethrough.value

  editorStore.changeFontLinethrough(newValue)
  fontLinethrough.value = newValue
}

const textAlign = ref(editorStore.getActiveTextAlign)
function changeTextAlign(value: string) {
  if (!editorStore.selectedObject) return

  editorStore.changeTextAlign(value)
  textAlign.value = value
}

const fontSize = ref(editorStore.getActiveFontSize)
function changeFontSize(value: number) {
  if (!editorStore.selectedObject) return

  editorStore.changeFontSize(value)
  fontSize.value = value
}

watch(() => editorStore.selectedObject, (val) => {
  isText.value = isTextType(val?.type || '')
  if (isText.value) {
    fontWeight.value = editorStore.getActiveFontWeight
    fontStyle.value = editorStore.getActiveFontStyle
    fontUnderline.value = editorStore.getActiveFontUnderline
    fontLinethrough.value = editorStore.getActiveFontLinethrough
    textAlign.value = editorStore.getActiveTextAlign
    fontSize.value = editorStore.getActiveFontSize
  }
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
      <Hint v-if="isText" label="Bold" side="bottom" :side-offset="5">
        <Button
          size="icon"
          variant="ghost"
          :class="cn(
            fontWeight > 500 && 'bg-gray-100',
          )"
          @click="toggleBold"
        >
          <Icon name="lucide:bold" />
        </Button>
      </Hint>
      <Hint v-if="isText" label="Italic" side="bottom" :side-offset="5">
        <Button
          size="icon"
          variant="ghost"
          :class="cn(
            fontStyle === 'italic' && 'bg-gray-100',
          )"
          @click="toggleItalic"
        >
          <Icon name="lucide:italic" />
        </Button>
      </Hint>
      <Hint v-if="isText" label="Italic" side="bottom" :side-offset="5">
        <Button
          size="icon"
          variant="ghost"
          :class="cn(
            fontUnderline && 'bg-gray-100',
          )"
          @click="toggleUnderline"
        >
          <Icon name="lucide:underline" />
        </Button>
      </Hint>
      <Hint v-if="isText" label="Italic" side="bottom" :side-offset="5">
        <Button
          size="icon"
          variant="ghost"
          :class="cn(
            fontLinethrough && 'bg-gray-100',
          )"
          @click="toggleLinethrough"
        >
          <Icon name="lucide:strikethrough" />
        </Button>
      </Hint>
      <Hint v-if="isText" label="Align left" side="bottom" :side-offset="5">
        <Button
          size="icon"
          variant="ghost"
          :class="cn(
            textAlign === 'left' && 'bg-gray-100',
          )"
          @click="changeTextAlign('left')"
        >
          <Icon name="lucide:align-left" />
        </Button>
      </Hint>
      <Hint v-if="isText" label="Align center" side="bottom" :side-offset="5">
        <Button
          size="icon"
          variant="ghost"
          :class="cn(
            textAlign === 'center' && 'bg-gray-100',
          )"
          @click="changeTextAlign('center')"
        >
          <Icon name="lucide:align-center" />
        </Button>
      </Hint>
      <Hint v-if="isText" label="Align right" side="bottom" :side-offset="5">
        <Button
          size="icon"
          variant="ghost"
          :class="cn(
            textAlign === 'right' && 'bg-gray-100',
          )"
          @click="changeTextAlign('right')"
        >
          <Icon name="lucide:align-right" />
        </Button>
      </Hint>
      <FontSizeInput
        v-if="isText"
        :model-value="fontSize" @update:model-value="changeFontSize"
      />
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
      <Hint label="Delete" side="bottom" :side-offset="5">
        <Button
          size="icon"
          variant="ghost"
          @click="editorStore.deleteSelected"
        >
          <Icon name="ph:trash" />
        </Button>
      </Hint>
    </div>
  </div>
</template>
