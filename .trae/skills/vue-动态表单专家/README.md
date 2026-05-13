# Vue 动态表单专家 (Trae Skill)

这是一个专为 Vue 3 + Element Plus 环境设计的 Trae Skill，旨在通过 AI 驱动 Schema 配置生成，彻底解决前端表单开发中的重复劳动。

## 🌟 核心功能
- **智能映射**：自动识别后端接口字段类型，并精准匹配为 `input`, `number`, `select`, `date`, `switch` 等组件。
- **联动逻辑 (Visible Logic)**：能够理解自然语言描述的业务联动（例如：“当 A 为病假时显示附件”），自动生成符合 `new Function` 解析要求的 JS 字符串表达式。
- **属性透传**：支持自动推导并生成 `placeholder`, `rows`, `min/max` 等原生 Element Plus 属性。
- **项目对齐**：通过 Knowledge 深度对齐 `ai-form-demo` 项目的 Spec 规范，输出即用。

## 📖 如何安装
1. 下载本文件夹（或 Clone 整个仓库）。
2. 将 `.trae/skills/vue-动态表单专家/` 目录放入你项目的 `.trae/skills/` 目录下。
3. 在 Trae 编辑器的 SOLO 模式中，通过 `/Vue 动态表单专家` 即可唤起。

## 🚀 示例
**输入**：
> "帮我生成一个‘请假申请’表单，包含姓名、天数（数字）。如果天数大于3天，显示‘上传附件’字段。"

**输出**：
```json
[
  { "field": "name", "label": "姓名", "type": "input", "required": true },
  { "field": "days", "label": "请假天数", "type": "number", "min": 1 },
  { 
    "field": "attachment", 
    "label": "上传附件", 
    "type": "input", 
    "visible": "model.days > 3" 
  }
]
```
