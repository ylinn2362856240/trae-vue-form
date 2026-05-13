# Week 2: 赋予表单“灵魂”：校验与默认值

## 1. 本周目标
- 实现动态校验规则（Validation Rules）的生成。
- 掌握表单数据初始化逻辑（initFormData）。
- 实现“校验并提交”的完整闭环。

## 2. 核心挑战：动态规则
在 Element Plus 中，校验规则通常是静态定义的。但在配置驱动模式下，规则存储在 JSON 中。

**Spec 示例：**
```json
{
  "model": "name",
  "label": "姓名",
  "rules": [
    { "required": true, "message": "请输入姓名", "trigger": "blur" },
    { "min": 2, "max": 5, "message": "长度在 2 到 5 个字符", "trigger": "blur" }
  ]
}
```

## 3. 关键逻辑解析

### 3.1 规则提取：buildRules.ts
我们需要将 Spec 数组平铺成 Element Plus 识别的对象格式。
```typescript
export function buildRules(schema: any[]) {
  const rules: Record<string, any[]> = {}
  schema.forEach(item => {
    if (item.rules) {
      rules[item.model] = item.rules
    }
  })
  return rules
}
```

### 3.2 智能初始化：initFormData.ts
不能简单地给个空对象，否则 `v-model` 会因为缺少 key 而失去响应式，或者无法应用 `default` 默认值。
```typescript
export function initFormData(schema: any[]) {
  const data: Record<string, any> = {}
  schema.forEach(item => {
    // 优先级：配置默认值 > 类型默认值
    if (item.default !== undefined) {
      data[item.model] = item.default
    } else {
      data[item.model] = item.type === 'number' ? 0 : ''
    }
  })
  return data
}
```

## 4. 重点代码分析：FormRenderer 的 Expose
为了让父组件（如 Demo 页面）能触发校验，渲染器必须暴露 Element Plus 的 `validate` 方法。

```vue
<!-- FormRenderer.vue -->
<script setup lang="ts">
const formRef = ref<FormInstance>()

defineExpose({
  validate: () => formRef.value?.validate(),
  clearValidate: () => formRef.value?.clearValidate()
})
</script>
```

## 5. 避坑指南
- **Trigger 时机**：如果通过 AI 生成规则，建议默认设置 `trigger: 'blur'` 或 `trigger: 'change'`，否则校验可能不生效。
- **清除残留**：当 Spec 发生剧烈变动（比如从请假单切到入库单）时，必须调用 `clearValidate`，否则旧字段的校验提示会残留在新表单上。

## 6. 课后实战
- **任务**：为项目中的 `NumberField` 增加一个数值范围校验（min/max）。
- **验证**：在 Spec 中配置 `rules: [{ type: 'number', min: 18, message: '必须成年' }]`，测试提交时是否能拦截非法输入。
