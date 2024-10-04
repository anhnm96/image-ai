<script lang="ts" setup>
import { Chrome } from '@ckpack/vue-color'
import { rgbaObjectToString } from '../utils'

const props = defineProps<{ modelValue: string }>()
const emit = defineEmits(['update:modelValue'])
const color = useInternalValue(props, emit)

function update(val: any) {
  const formattedValue = rgbaObjectToString(val.rgba)
  color.value = formattedValue
}

const colors = [
  { name: 'red', color: 'rgb(239, 68, 68)' },
  { name: 'pink', color: 'rgb(236, 72, 153)' },
  { name: 'purple', color: 'rgb(168, 85, 247)' },
  { name: 'violet', color: 'rgb(139, 92, 246)' },
  { name: 'indigo', color: 'rgb(99, 102, 241)' },
  { name: 'blue', color: 'rgb(59, 130, 246)' },
  { name: 'sky', color: 'rgb(14, 165, 233)' },
  { name: 'cyan', color: 'rgb(6, 182, 212)' },
  { name: 'teal', color: 'rgb(20, 184, 166)' },
  { name: 'emerald', color: 'rgb(16, 185, 129)' },
  { name: 'green', color: 'rgb(34, 197, 94)' },
  { name: 'lime', color: 'rgb(132, 204, 22)' },
  { name: 'yellow', color: 'rgb(234, 179, 8)' },
  { name: 'amber', color: 'rgb(245, 158, 11)' },
  { name: 'orange', color: 'rgb(249, 115, 22)' },
  { name: 'neutral', color: 'rgb(115, 115, 115)' },
  { name: 'gray', color: 'rgb(107, 114, 128)' },
  { name: 'transparent', color: 'rgba(0, 0, 0, 0)' },
]
</script>

<template>
  <div class="w-full space-y-4">
    <Chrome
      :model-value="color"
      class="border rounded-lg"
      @update:model-value="update"
    />
    <div class="flex flex-wrap gap-3">
      <Hint v-for="(c, index) in colors" :key="c.name" :label="c.name" :side="index < 9 ? 'top' : 'bottom'" :side-offset="5">
        <div
          class="rounded-full size-6 border border-slate-200" :style="{ backgroundColor: c.color }"
          @click="color = c.color"
        />
      </Hint>
    </div>
  </div>
</template>
