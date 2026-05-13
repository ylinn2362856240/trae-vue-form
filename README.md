# 📢 一切皆可 Skill｜SOLO 技能创作赛参赛作品

## 🚀 项目名称：Vue 动态表单专家 (Vue Form Master)
本项目是一个基于 **Vue 3 + Element Plus** 的高级配置驱动 UI 引擎。其核心竞争力在于配套的 **Trae Skill**，它能深度理解业务需求并一键生成复杂的表单配置。

---

## ✨ 核心亮点：Vue 动态表单专家 (Skill)

在本项目中，我们不仅提供了一套渲染引擎，更通过 **Trae SOLO** 打造了一个极致提效的开发技能。

### 1. 为什么做这个 Skill？
前端开发中，手写动态表单的 JSON 配置（Schema）非常繁琐，尤其是：
- **组件匹配**：需要手动判断字段该用 Input, Select 还是 Number。
- **联动逻辑**：手写 `visible: "model.type === 'sick'"` 这种字符串表达式极易出错。
- **校验规则**：重复编写必填、长度等校验逻辑。

### 2. 这个 Skill 解决了什么？
通过本项目配套的 Skill，你只需一句话：
> “帮我做一个设备报修表单，当勾选‘加急’时显示‘加急原因’字段。”

AI 就会自动产出：
1. **符合规范的 JSON 配置**（包含精准的 `field`, `label`, `type`）。
2. **逻辑准确的联动表达式**（如 `visible: "model.isUrgent === true"`）。
3. **对应的 Vue 模板片段**。

---

## 🛠️ 项目底座介绍

本项目（`ai-form-demo`）是该技能的运行环境，包含：
- **Core Parser**：基于 `new Function` 的动态表达式解析器，支持极高灵活度的字段联动。
- **UI Components**：深度封装的 Element Plus 组件库，支持属性透传（v-bind="$attrs"）。
- **Mock & Validation**：完整的字段校验与数据 mock 链路。

---

## 📖 如何快速开始

### 1. 安装技能
- 将项目中的 `.trae/skills/vue-动态表单专家/` 目录放入你本地项目的 `.trae/skills/` 下。
- 在 Trae 的 SOLO 模式下输入 `/Vue 动态表单专家` 即可唤起。

### 2. 运行项目
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

---

## 🔗 相关资源
- **Skill 分享链接**：`[这里请替换为你从 Trae 导出的分享链接]`
- **GitHub 源码**：[ylinn2362856240/ai-form-demo](https://github.com/ylinn2362856240/ai-form-demo)
- **创作过程**：详见 `.trae/skills/vue-动态表单专家/README.md`

---

## 🙋 开发者
**YLinn** - 前端开发工程师。
致力于通过 AI 探索配置驱动 UI 的无限可能。欢迎点赞、Star 交流！
