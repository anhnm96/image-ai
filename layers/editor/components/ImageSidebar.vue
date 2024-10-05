<script lang="ts" setup>
import type { ActiveTool } from '../types'
import { cn } from '~/lib/utils'
import { useEditorStore } from '../stores/editor'

defineProps<{ activeTool: ActiveTool }>()
defineEmits<{
  'update:activeTool': [tool: ActiveTool]
}>()

const editorStore = useEditorStore()
const { data, isLoading, isError } = useGetImages()
</script>

<template>
  <aside
    :class="cn(
      'bg-white relative border-r z-[40] w-[360px] h-full flex flex-col',
      activeTool === 'images' ? 'visible' : 'hidden',
    )"
  >
    <ToolSidebarHeader
      title="Images"
      description="Add images to your canvas"
    />
    <div class="p-4 border-b">
      <!-- <UploadButton
          appearance={{
            button: "w-full text-sm font-medium",
            allowedContent: "hidden"
          }}
          content={{
            button: "Upload Image"
          }}
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            editor?.addImage(res[0].url);
          }}
        /> -->
    </div>
    <div v-if="isLoading" class="flex items-center justify-center flex-1">
      <Icon class="size-4 text-muted-foreground animate-spin" name="lucide:loader" />
    </div>
    <div v-if="isError" class="flex flex-col gap-y-4 items-center justify-center flex-1">
      <Icon class="size-4 text-muted-foreground" name="lucide:alert-triangle" />
      <p class="text-muted-foreground text-xs">
        Failed to fetch images
      </p>
    </div>
    <ScrollArea>
      <div class="p-4">
        <div v-if="data" class="grid grid-cols-2 gap-4">
          <button
            v-for="image in data.images"
            :key="image.id"
            class="relative w-full h-[100px] group hover:opacity-75 transition bg-muted rounded-sm overflow-hidden border"
            @click="editorStore.addImage(image.urls.regular)"
          >
            <img
              :src="image.urls.small"
              :alt="image.alt_description || 'image'"
              class="object-cover"
            >
            <NuxtLink
              target="_blank"
              :href="image.links.html"
              class="opacity-0 group-hover:opacity-100 absolute left-0 bottom-0 w-full text-[10px] truncate text-white hover:underline p-1 bg-black/50 text-left"
            >
              {{ image.user.name }}
            </NuxtLink>
          </button>
        </div>
      </div>
    </ScrollArea>
    <ToolSidebarClose @click="$emit('update:activeTool', 'select')" />
  </aside>
</template>
