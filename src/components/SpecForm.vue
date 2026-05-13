<script setup lang="ts">
/**
 * SpecForm —— 根据 Spec 自动渲染表单
 *
 * 核心思路：遍历 spec.form，根据每个字段的 type 决定渲染什么组件
 * 这样新增一个组件类型，只需要：
 *   1. 在 FieldType 里加一个枚举值
 *   2. 这里加一个 v-else-if 分支
 */

import type { FormField } from '../core/types'
import type { FieldError } from '../core/validator'
import { getFieldError } from '../core/validator'

interface Props {
  fields: FormField[]
  modelValue: Record<string, unknown>
  errors?: FieldError[]
}

const props = withDefaults(defineProps<Props>(), {
  errors: () => [],
})

const emit = defineEmits<{
  'update:modelValue': [value: Record<string, unknown>]
  submit: []
}>()

// 当某个字段值变化时，更新整个表单数据对象
function handleFieldChange(fieldName: string, value: unknown) {
  emit('update:modelValue', {
    ...props.modelValue,
    [fieldName]: value,
  })
}

// 通过字段名拿到当前值（统一入口，方便后续扩展）
function getFieldValue(fieldName: string): unknown {
  return props.modelValue[fieldName] ?? ''
}
</script>

<template>
  <form class="spec-form" @submit.prevent="emit('submit')">
    <div v-for="field in fields" :key="field.field" class="form-item"
      :class="{ 'has-error': getFieldError(errors, field.field) }">
      <!-- 字段标签 -->
      <label class="form-label">
        <span v-if="field.required" class="required-mark">*</span>
        {{ field.label }}
      </label>

      <!-- 根据 type 渲染不同输入组件 -->
      <div class="form-control">
        <!-- Day 3: input 类型 -->
        <input v-if="field.type === 'input'" :id="`field-${field.field}`" class="input" type="text"
          :placeholder="field.placeholder" :value="String(getFieldValue(field.field))"
          @input="handleFieldChange(field.field, ($event.target as HTMLInputElement).value)" />

        <!-- Day 4: number 类型 -->
        <input v-else-if="field.type === 'number'" :id="`field-${field.field}`" class="input" type="number"
          :placeholder="field.placeholder" :min="field.min" :max="field.max"
          :value="getFieldValue(field.field) as number"
          @input="handleFieldChange(field.field, Number(($event.target as HTMLInputElement).value))" />

        <!-- 周末: select 类型 -->
        <select v-else-if="field.type === 'select'" :id="`field-${field.field}`" class="input select"
          :value="String(getFieldValue(field.field))"
          @change="handleFieldChange(field.field, ($event.target as HTMLSelectElement).value)">
          <option value="" disabled>请选择</option>
          <option v-for="opt in field.options" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>

        <!-- 周末: date 类型 -->
        <input v-else-if="field.type === 'date'" :id="`field-${field.field}`" class="input" type="date"
          :value="String(getFieldValue(field.field))"
          @input="handleFieldChange(field.field, ($event.target as HTMLInputElement).value)" />

        <!-- 周末: textarea 类型 -->
        <textarea v-else-if="field.type === 'textarea'" :id="`field-${field.field}`" class="input textarea"
          :placeholder="field.placeholder" :rows="field.rows ?? 3" :value="String(getFieldValue(field.field))"
          @input="handleFieldChange(field.field, ($event.target as HTMLTextAreaElement).value)" />
      </div>

      <!-- 校验错误提示 -->
      <p v-if="getFieldError(errors, field.field)" class="error-msg">
        {{ getFieldError(errors, field.field) }}
      </p>
    </div>

    <!-- 提交按钮 -->
    <div class="form-actions">
      <button type="submit" class="btn btn-primary">
        提 交
      </button>
    </div>
  </form>
</template>

<style scoped>
.spec-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  gap: 4px;
}

.required-mark {
  color: var(--color-danger);
  font-size: 16px;
  line-height: 1;
}

.form-control {
  position: relative;
}

.input {
  width: 100%;
  height: 40px;
  padding: 0 12px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-input-bg);
  color: var(--color-text);
  font-size: 14px;
  font-family: inherit;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
  outline: none;
  appearance: none;
  -webkit-appearance: none;
}

.input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.select {
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 36px;
}

.textarea {
  height: auto;
  padding: 10px 12px;
  resize: vertical;
  line-height: 1.5;
}

/* 有错误时边框变红 */
.has-error .input {
  border-color: var(--color-danger);
}

.has-error .input:focus {
  box-shadow: 0 0 0 3px var(--color-danger-light);
}

.error-msg {
  font-size: 12px;
  color: var(--color-danger);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 4px;
}

.error-msg::before {
  content: '⚠';
}

.form-actions {
  padding-top: 8px;
  display: flex;
  justify-content: flex-end;
}

.btn {
  height: 40px;
  padding: 0 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.btn-primary {
  background: var(--color-primary);
  color: #fff;
}

.btn-primary:hover {
  background: var(--color-primary-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px var(--color-primary-shadow);
}

.btn-primary:active {
  transform: translateY(0);
}
</style>
