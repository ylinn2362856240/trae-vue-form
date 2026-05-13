<script setup lang="ts">
defineProps({
  label: String,
  modelValue: String,
  placeholder: {
    type: String,
    default: '请选择日期'
  }
})

defineEmits(['update:modelValue'])
</script>

<template>
  <el-date-picker
    :model-value="modelValue"
    type="date"
    v-bind="$attrs"
    value-format="YYYY-MM-DD"
    style="width: 100%"
    @update:model-value="$emit('update:modelValue', $event)"
  />
</template>
