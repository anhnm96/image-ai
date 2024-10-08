<script lang="ts" setup>
import type { ActiveTool } from '../types'
import { cn } from '~/lib/utils'
import { useEditorStore } from '../stores/editor'

defineProps<{ activeTool: ActiveTool }>()
const activeTool = defineModel<ActiveTool>('activeTool')
const editorStore = useEditorStore()

const { open, onChange } = useFileDialog({
  accept: '.json',
})

onChange((files) => {
  const file = files?.[0]
  if (!file) throw new Error('No file selected')
  const reader = new FileReader()
  reader.readAsText(file, 'UTF-8')
  reader.onload = () => {
    editorStore.loadJson(reader.result as string)
  }
})
</script>

<template>
  <nav class="w-full flex items-center p-4 h-[68px] gap-x-8 border-b lg:pl-[34px]">
    <Logo />
    <div class="w-full flex items-center gap-x-1 h-full">
      <DropdownMenu :modal="false">
        <DropdownMenuTrigger as-child>
          <Button size="sm" variant="ghost">
            File
            <Icon class="ml-2" name="lucide:chevron-down" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" class="min-w-60">
          <DropdownMenuItem class="flex items-center gap-x-2" @click="open">
            <Icon size="32px" name="lucide:file" />
            <div>
              <p>Open</p>
              <p class="text-xs text-muted-foreground">
                Open a JSON file
              </p>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Separator orientation="vertical" class="mx-2" />
      <Hint label="Select" side="bottom" :side-offset="10">
        <Button
          variant="ghost" size="icon"
          :class="[cn(activeTool === 'select' && 'bg-gray-100')]"
          @click="activeTool = 'select'"
        >
          <Icon name="lucide:mouse-pointer-click" />
        </Button>
      </Hint>
      <Hint label="Undo" side="bottom" :side-offset="10">
        <Button
          :disabled="!editorStore.canUndo"
          variant="ghost"
          size="icon"
          @click="editorStore.undo"
        >
          <Icon name="lucide:undo-2" />
        </Button>
      </Hint>
      <Hint label="Redo" side="bottom" :side-offset="10">
        <Button
          :disabled="!editorStore.canRedo"
          variant="ghost"
          size="icon"
          @click="editorStore.redo"
        >
          <Icon name="lucide:redo-2" />
        </Button>
      </Hint>
      <Separator orientation="vertical" class="mx-2" />
      <div class="flex items-center gap-x-2">
        <Icon class="text-muted-foreground" size="20px" name="ph:cloud-check" />
        <div class="text-xs text-muted-foreground">
          Saved
        </div>
      </div>
      <div class="ml-auto flex items-center gap-x-4">
        <DropdownMenu :modal="false">
          <DropdownMenuTrigger as-child>
            <Button size="sm" variant="ghost">
              Export
              <Icon class="ml-4" name="lucide:download" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" class="min-w-60">
            <DropdownMenuItem
              class="flex items-center gap-x-2"
              @click="editorStore.saveJson"
            >
              <Icon size="32px" name="lucide:file" />
              <div>
                <p>JSON</p>
                <p class="text-xs text-muted-foreground">
                  Save for later editing
                </p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              class="flex items-center gap-x-2"
              @click="editorStore.savePng"
            >
              <Icon size="32px" name="lucide:file" />
              <div>
                <p>PNG</p>
                <p class="text-xs text-muted-foreground">
                  Best for sharing on the web
                </p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              class="flex items-center gap-x-2"
              @click="editorStore.saveJpg"
            >
              <Icon size="32px" name="lucide:file" />
              <div>
                <p>JPG</p>
                <p class="text-xs text-muted-foreground">
                  Best for printing
                </p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              class="flex items-center gap-x-2"
              @click="editorStore.saveSvg"
            >
              <Icon size="32px" name="lucide:file" />
              <div>
                <p>SVG</p>
                <p class="text-xs text-muted-foreground">
                  Best for editing in vector software
                </p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  </nav>
</template>
