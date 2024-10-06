<script lang="ts" setup>
import type { ActiveTool } from '../types'

defineProps<{ activeTool: ActiveTool }>()
defineEmits<{
  'update:activeTool': [tool: ActiveTool]
}>()
</script>

<template>
  <aside class="bg-white flex flex-col w-[100px] h-full border-r overflow-y-auto">
    <ul className="flex flex-col">
      <SidebarItem
        icon="lucide:layout-template"
        label="Design"
        :is-active="activeTool === 'templates'"
        @click="$emit('update:activeTool', 'templates')"
      />
      <SidebarItem
        icon="lucide:image"
        label="Image"
        :is-active="activeTool === 'images'"
        @click="$emit('update:activeTool', 'images')"
      />
      <SidebarItem
        icon="lucide:type"
        label="Text"
        :is-active="activeTool === 'text'"
        @click="$emit('update:activeTool', 'text')"
      />
      <SidebarItem
        icon="lucide:shapes"
        label="Shapes"
        :is-active="activeTool === 'shapes'"
        @click="$emit('update:activeTool', 'shapes')"
      />
      <SidebarItem
        icon="lucide:pencil"
        label="Draw"
        :is-active="activeTool === 'draw'"
        @click="$emit('update:activeTool', 'draw')"
      />
      <SidebarItem
        icon="lucide:settings"
        label="Settings"
        :is-active="activeTool === 'settings'"
        @click="$emit('update:activeTool', 'settings')"
      />
    </ul>
  </aside>
</template>
