<script setup lang="ts">
defineProps({
  label: String,
  modelValue: Number
})

defineEmits(['update:modelValue'])
</script>

<template>
  <el-input-number
    :model-value="modelValue"
    v-bind="$attrs"
    @update:modelValue="$emit('update:modelValue', $event)"
  />
</template>
