# Week 3: 灵动交互：动态显示与组件扩展

## 1. 本周目标
- 实现基于表达式的字段联动（Visible Logic）。
- 掌握如何通过 `v-bind` 透传属性。
- 扩展多行文本（Textarea）等基础组件。

## 2. 核心概念：联动逻辑
业务中常见场景：只有当“请假类型”选为“病假”时，才显示“上传医院证明”字段。

在 Spec 中，我们使用字符串表达式描述这种关系：
```json
{
  "model": "certificate",
  "label": "证明文件",
  "visible": "model.type === 'sick'"
}
```

## 3. 关键逻辑解析

### 3.1 表达式执行：evalVisible
在 Vue 模板中，我们需要一个安全的方式来解析这个字符串。
```typescript
// 简化版逻辑
export function checkVisible(visibleExpr: string | undefined, model: any) {
  if (!visibleExpr) return true
  try {
    // 利用 new Function 创建沙箱环境执行表达式
    const func = new Function('model', `return ${visibleExpr}`)
    return func(model)
  } catch (e) {
    console.error('表达式解析错误:', e)
    return true // 出错默认显示，保证表单可用
  }
}
```

### 3.2 渲染器集成
在 `FormRenderer.vue` 中应用 `v-if`：
```vue
<template v-for="item in schema" :key="item.model">
  <el-form-item 
    v-if="checkVisible(item.visible, model)"
    :label="item.label"
  >
    <component :is="..." v-bind="item" />
  </el-form-item>
</template>
```

## 4. 重点：属性透传（Attribute Passthrough）
为了让 AI 生成的任意配置都能生效，组件内部必须使用 `v-bind="$attrs"`。

**InputField.vue 示例：**
```vue
<template>
  <!-- $attrs 包含了父组件传来的所有非 props 属性，如 placeholder, disabled, rows 等 -->
  <el-input
    v-bind="$attrs"
    :model-value="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
  />
</template>
```

## 5. 避坑指南
- **表达式依赖**：Vue 的响应式系统会自动追踪 `new Function` 中访问到的 `model` 属性。确保 `model` 对象在初始化时已经具备了所有可能被引用的 key。
- **性能问题**：如果表单极大（100+ 字段），频繁触发 `eval` 可能有性能损耗。可以考虑缓存解析结果或使用 `jsep` 等轻量级解析库。

## 6. 课后实战
- **任务**：实现一个联动：当“年龄”大于 60 时，显示一个“紧急联系人”输入框。
- **验证**：在 Demo 页面切换年龄数值，观察联系人字段是否能灵敏地显示/隐藏。
