<script setup lang="ts">
/**
 * Demo 主页面
 * 把 Spec、SpecForm、SpecTable 串起来，演示完整的「配置驱动 UI」流程：
 *
 * 1. 从 spec 读取配置（不需要写 template，不需要写 props）
 * 2. SpecForm 根据 spec.form 渲染输入界面
 * 3. 用户填写并提交后，数据进入 tableData
 * 4. SpecTable 根据 spec.table 把数据展示出来
 */

import { ref } from 'vue'
import { demoSpec } from '../core/spec'
import { validateForm } from '../core/validator'
import type { FieldError } from '../core/validator'
import SpecForm from '../components/SpecForm.vue'
import SpecTable from '../components/SpecTable.vue'

// NOTE: 必须用 ref 而不是 reactive。
// v-model 编译后是 `formData = $event`（替换整个对象引用），
// const reactive 无法被重新赋值，导致字段值永远写不进来。
const formData = ref<Record<string, unknown>>({})

// 校验错误列表
const errors = ref<FieldError[]>([])

// 已提交的数据列表（表格数据源）
const tableData = ref<Record<string, unknown>[]>([])

// 是否显示成功提示
const showSuccess = ref(false)

// 处理表单提交
function handleSubmit() {
  // 执行校验
  const validationErrors = validateForm(demoSpec.form, formData.value)
  errors.value = validationErrors

  if (validationErrors.length > 0) return

  // 校验通过：把数据复制一份存入表格
  tableData.value.push({ ...formData.value })

  // 重置表单（替换为新空对象，触发 SpecForm 输入框清空）
  formData.value = {}
  errors.value = []

  // 显示短暂的成功提示
  showSuccess.value = true
  setTimeout(() => {
    showSuccess.value = false
  }, 2000)
}
</script>

<template>
  <div class="demo-page">
    <!-- 页头 -->
    <header class="page-header">
      <div class="header-content">
        <div class="header-badge">配置驱动 UI · Demo</div>
        <h1 class="page-title">{{ demoSpec.title }}</h1>
        <p class="page-desc">{{ demoSpec.description }}</p>
      </div>
      <!-- Spec 可视化区域 -->
      <div class="spec-badge-group">
        <span class="spec-badge">
          <span class="badge-dot form-dot" />
          {{ demoSpec.form.length }} 个表单字段
        </span>
        <span class="spec-badge">
          <span class="badge-dot table-dot" />
          {{ demoSpec.table.length }} 个表格列
        </span>
      </div>
    </header>

    <main class="page-main">
      <!-- 左侧：表单区域 -->
      <section class="panel form-panel">
        <div class="panel-header">
          <h2 class="panel-title">📝 添加数据</h2>
          <span class="panel-hint">配置即渲染，无需手写模板</span>
        </div>
        <div class="panel-body">
          <!-- 成功提示 -->
          <Transition name="toast">
            <div v-if="showSuccess" class="success-toast">
              ✅ 提交成功！数据已添加到表格
            </div>
          </Transition>

          <!-- 核心：只需传入 spec.form，表单自动渲染 -->
          <SpecForm :fields="demoSpec.form" :errors="errors" v-model="formData" @submit="handleSubmit" />
        </div>
      </section>

      <!-- 右侧：Spec 代码展示 -->
      <aside class="panel spec-panel">
        <div class="panel-header">
          <h2 class="panel-title">⚙️ 当前 Spec 配置</h2>
          <span class="panel-hint">改这里，页面自动变</span>
        </div>
        <div class="panel-body spec-code-wrap">
          <pre class="spec-code"><code>// core/spec.ts
export const spec = {
  title: "{{ demoSpec.title }}",

  form: [
<template v-for="f in demoSpec.form" :key="f.field">
    { field: "{{ f.field }}",
      label: "{{ f.label }}",
      type: "{{ f.type }}"{{ f.required ? ',\n      required: true' : '' }} },
</template>
],

table: [
<template v-for="c in demoSpec.table" :key="c.field">
    { field: "{{ c.field }}",
      label: "{{ c.label }}" },
</template>
]
}</code></pre>
        </div>
      </aside>
    </main>

    <!-- 表格区域 -->
    <section class="panel table-panel">
      <div class="panel-header">
        <h2 class="panel-title">
          📊 数据列表
          <span class="count-badge">{{ tableData.length }} 条</span>
        </h2>
        <span class="panel-hint">配置即渲染，无需手写列定义</span>
      </div>
      <div class="panel-body">
        <!-- 核心：只需传入 spec.table，表格自动渲染 -->
        <SpecTable :columns="demoSpec.table" :data="tableData" />
      </div>
    </section>

    <!-- 底部说明 -->
    <footer class="page-footer">
      <p>🚀 本 Demo 由 <strong>Spec 配置</strong>驱动生成，表单与表格均无手写模板</p>
      <p class="footer-sub">第一周 MVP · 下周计划：AI 对话生成 Spec</p>
    </footer>
  </div>
</template>

<style scoped>
.demo-page {
  min-height: 100vh;
  padding: 40px 24px 60px;
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

/* ── 页头 ── */
.page-header {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.header-badge {
  display: inline-flex;
  align-items: center;
  background: var(--color-primary-light);
  color: var(--color-primary);
  font-size: 12px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 100px;
  width: fit-content;
  letter-spacing: 0.5px;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  letter-spacing: -0.5px;
}

.page-desc {
  color: var(--color-text-muted);
  font-size: 15px;
  margin: 0;
}

.spec-badge-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.spec-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--color-text-secondary);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  padding: 4px 12px;
  border-radius: 100px;
}

.badge-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.form-dot {
  background: var(--color-primary);
}

.table-dot {
  background: var(--color-accent);
}

/* ── 主区域 ── */
.page-main {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 24px;
  align-items: start;
}

/* ── 面板通用 ── */
.panel {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: var(--shadow-panel);
}

.panel-header {
  padding: 16px 24px;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--color-surface-raised);
}

.panel-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.panel-hint {
  font-size: 12px;
  color: var(--color-text-muted);
  font-style: italic;
}

.panel-body {
  padding: 24px;
}

/* ── 成功提示 ── */
.success-toast {
  background: #d1fae5;
  color: #065f46;
  border: 1px solid #6ee7b7;
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 20px;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* ── Spec 代码展示 ── */
.spec-code-wrap {
  padding: 0;
  height: 100%;
}

.spec-code {
  margin: 0;
  padding: 20px;
  font-size: 12px;
  line-height: 1.7;
  color: var(--color-code-text);
  background: var(--color-code-bg);
  overflow-x: auto;
  font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
  min-height: 100%;
  white-space: pre-wrap;
  word-break: break-all;
}

/* ── 表格面板 ── */
.table-panel .panel-body {
  padding: 0;
}

.count-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary);
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 100px;
  min-width: 28px;
}

/* ── 底部 ── */
.page-footer {
  text-align: center;
  color: var(--color-text-muted);
  font-size: 13px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-top: 12px;
  border-top: 1px solid var(--color-border);
}

.page-footer strong {
  color: var(--color-primary);
}

.footer-sub {
  font-size: 12px;
  opacity: 0.6;
}

/* ── 响应式 ── */
@media (max-width: 900px) {
  .page-main {
    grid-template-columns: 1fr;
  }

  .spec-panel {
    order: -1;
  }

  .page-title {
    font-size: 24px;
  }
}
</style>
