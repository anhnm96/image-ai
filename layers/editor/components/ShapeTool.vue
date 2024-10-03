<script lang="ts" setup>
import { cn } from '~/lib/utils'

defineProps<{ icon: string, iconClass?: string }>()
</script>

<template>
  <button class="aspect-square border rounded-md p-5">
    <Icon :class="cn('h-full w-full', iconClass)" :name="icon" />
  </button>
</template>
