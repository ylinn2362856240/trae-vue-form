<script setup lang="ts">
import { ref, computed } from 'vue'
import { resolveComponent } from '@/core/renderer'
import { buildRules } from '@/core/useFormRules'
import type { FormInstance } from 'element-plus'

const props = defineProps({
  schema: {
    type: Array as () => any[],
    default: () => []
  },
  model: {
    type: Object as () => Record<string, any>,
    default: () => ({})
  }
})

// 1. 动态生成校验规则
const rules = computed(() => buildRules(props.schema))

// 2. 暴露表单引用，供外部调用 validate
const formRef = ref<FormInstance>()

defineExpose({
  validate: () => formRef.value?.validate(),
  clearValidate: () => formRef.value?.clearValidate()
})
</script>

<template>
  <!-- 动态组件渲染容器 -->
  <el-form ref="formRef" :model="model" :rules="rules" label-width="100px" :validate-on-rule-change="false">
    <template v-for="item in schema" :key="item.model">
      <!-- 重点：使用 el-form-item 包裹，实现校验提示 -->
      <el-form-item :label="item.label" :prop="item.model">
        <!-- 核心：通过 componentMap 决定渲染哪个组件 -->
        <component
          :is="resolveComponent(item.type)"
          v-bind="item"
          v-model="model[item.model]"
        />
      </el-form-item>
    </template>
  </el-form>
</template>
