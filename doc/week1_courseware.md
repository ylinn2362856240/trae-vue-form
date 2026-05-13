# Week 1: 从 0 到 1 构建配置驱动引擎

## 1. 本周目标
- 理解配置驱动（Config-Driven UI）的本质。
- 设计基础的 `Spec` JSON 协议。
- 实现动态表单（FormRenderer）与动态表格（TableRenderer）的初步渲染。
- 掌握 Vue 3 `componentMap` 映射机制。

## 2. 核心概念：什么是配置驱动？
传统的开发模式是 **“代码描述 UI”**（写死 HTML/Vue 模板）。
配置驱动则是 **“数据描述 UI”**。

**优点：**
- **灵活性**：无需修改代码，只需更新 JSON 即可改变页面布局。
- **可自动化**：后端或 AI 可以根据业务逻辑动态生成配置。
- **一致性**：强制复用标准组件。

## 3. 关键架构设计

### 3.1 Spec 协议定义
一切始于一份协议。我们定义 `form` 描述输入，`table` 描述输出。
```json
{
  "form": [
    { "type": "input", "label": "姓名", "model": "name" },
    { "type": "select", "label": "性别", "model": "gender", "options": [...] }
  ],
  "table": [
    { "label": "姓名", "prop": "name" },
    { "label": "状态", "prop": "status" }
  ]
}
```

### 3.2 映射中心：Component Map
这是“配置”转为“组件”的关键。我们在 `src/config/componentMap.ts` 中维护这个中心：
```typescript
import InputField from '@/components/form/fields/InputField.vue'
// ... 其他组件

export const componentMap: Record<string, any> = {
  input: InputField,
  select: SelectField,
  number: NumberField
}
```

### 3.3 渲染器逻辑：resolveComponent
通过 `resolveComponent` 函数，根据配置中的 `type` 动态获取 Vue 组件。
```typescript
export function resolveComponent(type: string) {
  return componentMap[type] || null
}
```

## 4. 重点代码分析：FormRenderer.vue
核心思想是利用 Vue 的 `<component :is="...">`。

```vue
<template>
  <el-form :model="model">
    <el-form-item v-for="item in schema" :label="item.label">
      <component
        :is="resolveComponent(item.type)"
        v-bind="item"
        v-model="model[item.model]"
      />
    </el-form-item>
  </el-form>
</template>
```
> [!TIP]
> 使用 `v-bind="item"` 可以将配置中的所有属性（如 placeholder, disabled）一键传递给底层组件。

## 5. 避坑指南
- **数据响应式**：如果 `model` 属性是动态增加的，确保使用 `ref` 或 `reactive` 深度代理，或者在渲染前完成 `initFormData`。
- **组件注册**：一定要确保 `componentMap` 中的 key 与 `Spec` 中的 `type` 严格对应。

## 6. 课后实战
- **任务**：在项目中新增一个 `DateField.vue` 组件，并在 `componentMap` 中注册它。
- **验证**：修改 `demoSpec.ts`，增加一个日期字段，观察页面是否能自动渲染出日期选择器。
