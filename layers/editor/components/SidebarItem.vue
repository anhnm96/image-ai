<script lang="ts" setup>
import { cn } from '~/lib/utils'

defineProps<{
  icon: string
  label: string
  isActive?: boolean
}>()
</script>

<template>
  <Button
    variant="ghost"
    :class="[cn(
      'w-full h-full aspect-video p-3 py-4 flex flex-col rounded-none',
      isActive && 'bg-muted text-primary',
    )]"
  >
    <Icon class="stroke-2 shrink-0" size="20px" :name="icon" />
    <span class="mt-2 text-xs">
      {{ label }}
    </span>
  </Button>
</template>
