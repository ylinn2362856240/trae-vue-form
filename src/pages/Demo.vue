<script setup lang="ts">
import { ref, reactive, nextTick } from 'vue'
import { parseSpec } from '@/core/parser'
import { initFormData } from '@/core/initFormData'
import { generateByAI } from '@/api/ai'
import FormRenderer from '@/components/form/FormRenderer.vue'
import TableRenderer from '@/components/table/TableRenderer.vue'
import { spec as initialSpec } from '@/spec/demoSpec'
import { ElMessage } from 'element-plus'

// 1. 响应式 Spec 解析
const currentSpec = ref(initialSpec)
const form = ref(parseSpec(currentSpec.value).form)
const table = ref(parseSpec(currentSpec.value).table)

// 2. 初始化数据
const formData = ref(initFormData(form.value))
const tableData = reactive<any[]>([])

// 3. AI 生成逻辑
const aiInput = ref('')
const isAiLoading = ref(false)
const lastSourceIsAi = ref<boolean | null>(null)

// 示例提示词
const suggestionTags = [
  { label: '请假申请单', value: '生成一个请假申请单，包含姓名、原因和日期' },
  { label: '商品入库', value: '帮我做一个商品入库登记，需要名称、价格、数量和备注' },
  { label: '员工登记', value: '我需要一个员工注册表，包含姓名、年龄、性别和手机号' },
  { label: '自定义业务', value: '做一个带有详细地址和入职日期的业务表单' }
]

const handleSuggestionClick = (val: string) => {
  aiInput.value = val
  handleAiGenerate()
}

const handleAiGenerate = async () => {
  if (!aiInput.value.trim()) return
  
  isAiLoading.value = true
  try {
    // 调用真实后端接口
    const result = await generateByAI(aiInput.value)
    
    // 更新当前页面 schema
    const parsed = parseSpec(result.spec)
    form.value = parsed.form
    if (parsed.table && parsed.table.length > 0) {
      table.value = parsed.table
    }
    
    // 记录来源
    lastSourceIsAi.value = result.isAi
    
    // 重新初始化数据对象
    formData.value = initFormData(form.value)

    // 重点：在下一帧清空校验信息，防止新生成的 Spec 立即触发校验提示
    nextTick(() => {
      formRendererRef.value?.clearValidate()
    })

    const sourceText = result.isAi ? '真实 AI' : 'Mock 模拟'
    ElMessage.success(`AI 已成功生成 Spec (${sourceText})`)
  } catch (error: any) {
    // NOTE: 这里的 error 已经过 api/ai.ts 包装，包含友好的中文提示
    ElMessage.error(error.message || 'AI 生成失败，请稍后重试')
  } finally {
    isAiLoading.value = false
  }
}

// 4. 表单引用与提交校验
const formRendererRef = ref()
const handleSubmit = async () => {
  if (!formRendererRef.value) return
  
  try {
    // 调用子组件暴露的校验方法
    await formRendererRef.value.validate()
    
    // 校验通过：保存数据
    tableData.push(JSON.parse(JSON.stringify(formData.value)))
    ElMessage.success('添加成功')
    
    // 重置表单为初始值
    formData.value = initFormData(form.value)
    
    // 重点：在下一帧清空校验信息，防止重置后的空值触发校验提示
    nextTick(() => {
      formRendererRef.value?.clearValidate()
    })
  } catch (error) {
    ElMessage.error('请完善表单信息')
  }
}
</script>

<template>
  <div class="demo-container">
    <div class="header-section">
      <h2>第5周：真 AI 深度驱动与业务赋能</h2>
      <p class="subtitle">自然语言解析 | 动态表单联动 | 复杂业务场景支持</p>
    </div>

    <!-- AI 助手入口 -->
    <el-card class="ai-card" shadow="never">
      <div class="ai-input-wrap">
        <el-input 
          v-model="aiInput" 
          placeholder="试试输入：生成一个请假申请单..." 
          @keyup.enter="handleAiGenerate"
        >
          <template #prefix>✨</template>
          <template #suffix v-if="lastSourceIsAi !== null">
            <el-tag :type="lastSourceIsAi ? 'success' : 'info'" size="small" effect="plain" class="source-tag">
              {{ lastSourceIsAi ? 'Real AI' : 'Mock Mode' }}
            </el-tag>
          </template>
        </el-input>
        <el-button 
          type="primary" 
          :loading="isAiLoading"
          @click="handleAiGenerate"
        >
          AI 生成 Spec
        </el-button>
      </div>
      
      <!-- 新增：提示词示例 -->
      <div class="ai-suggestions">
        <span class="suggestion-label">推荐尝试：</span>
        <el-tag
          v-for="tag in suggestionTags"
          :key="tag.label"
          class="suggestion-tag"
          size="small"
          effect="light"
          round
          @click="handleSuggestionClick(tag.value)"
        >
          {{ tag.label }}
        </el-tag>
      </div>
    </el-card>
    
    <el-row :gutter="20" class="main-content">
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>📝 动态表单 (FormRenderer)</span>
            </div>
          </template>
          <!-- 表单核心：传入 schema, model, 并获取 ref -->
          <FormRenderer 
            ref="formRendererRef"
            :schema="form" 
            :model="formData" 
          />
          
          <div class="actions">
            <el-button type="primary" @click="handleSubmit">校验并提交</el-button>
          </div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>📊 数据列表 (TableRenderer)</span>
            </div>
          </template>
          <TableRenderer :columns="table" :data="tableData" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.demo-container {
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #f8fafc;
  min-height: 100vh;
}

.header-section {
  margin-bottom: 30px;
  text-align: center;
}

.header-section h2 {
  font-size: 28px;
  color: #1e293b;
  margin-bottom: 8px;
}

.subtitle {
  color: #64748b;
  font-size: 16px;
}

.ai-card {
  margin-bottom: 30px;
  border: 1px dashed #3b82f6;
  background-color: #eff6ff;
}

.ai-input-wrap {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.ai-suggestions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.suggestion-label {
  font-size: 13px;
  color: #64748b;
}

.suggestion-tag {
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.suggestion-tag:hover {
  background-color: #3b82f6 !important;
  color: white !important;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
}

.main-content {
  margin-top: 20px;
}

.card-header {
  font-weight: 600;
  color: #334155;
}

.actions {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;
  text-align: right;
}
</style>
