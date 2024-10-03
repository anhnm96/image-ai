<script lang="ts" setup>
import { Chrome } from '@ckpack/vue-color'
import { rgbaObjectToString } from '../utils'

defineProps<{ modelValue: string }>()
const color = defineModel<string>()
function update(val: any) {
  const formattedValue = rgbaObjectToString(val.rgba)
  color.value = formattedValue
}
</script>

<template>
  <div class="w-full space-y-4">
    <Chrome
      :model-value="color"
      class="border rounded-lg"
      @update:model-value="update"
    />
  </div>
</template>
