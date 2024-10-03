<script lang="ts" setup>
defineProps<{
  label: string
  side?: 'top' | 'bottom' | 'left' | 'right'
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
  alignOffset?: number
}>()
</script>

<template>
  <TooltipProvider>
    <Tooltip :delay-duration="100">
      <TooltipTrigger as-child>
        <slot />
      </TooltipTrigger>
      <TooltipContent
        class="text-white bg-slate-800 border-slate-800"
        :side="side"
        :align="align"
        :side-offset="sideOffset"
        :align-offset="alignOffset"
      >
        <p class="font-semibold capitalize">
          {{ label }}
        </p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
