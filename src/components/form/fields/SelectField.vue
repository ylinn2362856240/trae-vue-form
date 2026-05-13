<script setup lang="ts">
defineProps({
  label: String,
  modelValue: [String, Number],
  options: Array as () => { label: string; value: string | number }[]
})

defineEmits(['update:modelValue'])
</script>

<template>
  <el-select
    :model-value="modelValue"
    v-bind="$attrs"
    @update:modelValue="$emit('update:modelValue', $event)"
  >
    <el-option
      v-for="opt in options"
      :key="opt.value"
      :label="opt.label"
      :value="opt.value"
    />
  </el-select>
</template>
