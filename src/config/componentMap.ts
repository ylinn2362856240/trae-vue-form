import InputField from '@/components/form/fields/InputField.vue'
import NumberField from '@/components/form/fields/NumberField.vue'
import SelectField from '@/components/form/fields/SelectField.vue'
import DateField from '@/components/form/fields/DateField.vue'
import type { Component } from 'vue'

// 核心机制🔥：把“配置”映射成“组件”
// 以后扩展组件，只需要加这里，不用改主逻辑
export const componentMap: Record<string, Component> = {
  input: InputField,
  number: NumberField,
  select: SelectField,
  date: DateField
}
