<script lang="ts" setup>
const props = defineProps<{ modelValue: number }>()
const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const val = useInternalValue(props, emit)
function handleChange(e: string | number) {
  val.value = Number(e)
}
</script>

<template>
  <div class="flex items-center">
    <Button
      variant="outline"
      class="p-2 rounded-r-none border-r-0"
      size="icon"
      @click="$emit('update:modelValue', modelValue - 1)"
    >
      <Icon name="lucide:minus" />
    </Button>
    <Input
      :model-value="val"
      class="w-[50px] h-8 focus-visible:ring-offset-0 focus-visible:ring-0 rounded-none"
      @update:model-value="handleChange"
    />
    <Button
      variant="outline"
      class="p-2 rounded-l-none border-l-0"
      size="icon"
      @click="$emit('update:modelValue', modelValue + 1)"
    >
      <Icon name="lucide:plus" />
    </Button>
  </div>
</template>
