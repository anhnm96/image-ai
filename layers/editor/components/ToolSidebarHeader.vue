<script lang="ts" setup>
defineProps<{
  title: string
  description?: string
}>()
</script>

<template>
  <div class="p-4 border-b space-y-1 h-[68px]">
    <p class="text-sm font-medium">
      {{ title }}
    </p>
    <p class="text-xs text-muted-foreground">
      {{ description }}
    </p>
  </div>
</template>
