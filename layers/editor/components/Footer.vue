<script lang="ts" setup>
import { useEditorStore } from '../stores/editor'

const editorStore = useEditorStore()
</script>

<template>
  <footer class="h-[52px] border-t bg-white w-full flex items-center overflow-x-auto z-[49] p-2 gap-x-1 shrink-0 px-4 flex-row-reverse">
    <Hint label="Reset" side="bottom" :side-offset="5">
      <Button
        size="icon"
        variant="ghost"
        class="h-full"
        @click="editorStore.autoZoom"
      >
        <Icon name="lucide:minimize" />
      </Button>
    </Hint>
    <Hint label="Zoom in" side="bottom" :side-offset="5">
      <Button
        size="icon"
        variant="ghost"
        class="h-full"
        @click="editorStore.zoomIn"
      >
        <Icon name="lucide:zoom-in" />
      </Button>
    </Hint>
    <Hint label="Zoom out" side="bottom" :side-offset="5">
      <Button
        size="icon"
        variant="ghost"
        class="h-full"
        @click="editorStore.zoomOut"
      >
        <Icon name="lucide:zoom-out" />
      </Button>
    </Hint>
  </footer>
</template>
