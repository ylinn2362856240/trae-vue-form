<script setup lang="ts">
defineProps({
  label: String,
  modelValue: String
})

defineEmits(['update:modelValue'])
</script>

<template>
  <el-input
    :model-value="modelValue"
    v-bind="$attrs"
    @update:modelValue="$emit('update:modelValue', $event)"
  />
</template>
