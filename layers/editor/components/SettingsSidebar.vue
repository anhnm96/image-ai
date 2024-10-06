<script lang="ts" setup>
import type { ActiveTool } from '../types'
import { cn } from '~/lib/utils'
import { useEditorStore } from '../stores/editor'

defineProps<{ activeTool: ActiveTool }>()
defineEmits<{
  'update:activeTool': [tool: ActiveTool]
}>()

const editorStore = useEditorStore()

const width = ref(0)
const height = ref(0)
const background = ref('#fff')

onMounted(async () => {
  await nextTick()
  const workspace = editorStore.getWorkspace()
  width.value = workspace?.width || 0
  height.value = workspace?.height || 0
  background.value = workspace?.fill as string || '#fff'
})

function changeBackground(value: string) {
  background.value = value
  editorStore.changeBackground(value)
}

function onSubmit() {
  editorStore.changeSize({
    width: width.value,
    height: height.value,
  })
}
</script>

<template>
  <aside
    :class="cn(
      'bg-white relative border-r z-[40] w-[360px] h-full flex flex-col',
      activeTool === 'settings' ? 'visible' : 'hidden',
    )"
  >
    <ToolSidebarHeader
      title="Settings"
      description="Change the look of your workspace"
    />
    <ScrollArea>
      <form class="space-y-4 p-4" @submit.prevent="onSubmit">
        <div class="space-y-2">
          <Label>
            Height
          </Label>
          <Input
            v-model.number="height"
            placeholder="Height"
            type="number"
          />
        </div>
        <div class="space-y-2">
          <Label>
            Width
          </Label>
          <Input
            v-model.number="width"
            placeholder="Width"
            type="number"
          />
        </div>
        <Button type="submit" class="w-full">
          Resize
        </Button>
      </form>
      <div class="p-4">
        <ColorPicker
          :model-value="background"
          @update:model-value="changeBackground"
        />
      </div>
    </ScrollArea>
    <ToolSidebarClose @click="$emit('update:activeTool', 'select')" />
  </aside>
</template>
