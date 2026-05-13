/**
 * Spec 系统的核心类型定义
 * 这是整个配置驱动系统的"语言"——定义了如何描述一个页面
 */

// 表单字段支持的类型
export type FieldType = 'input' | 'number' | 'select' | 'date' | 'textarea'

// 选项（用于 select 类型）
export interface FieldOption {
  label: string
  value: string | number
}

// 校验规则
export interface ValidationRule {
  required?: boolean
  message?: string
  min?: number
  max?: number
  pattern?: string | RegExp
  trigger?: 'blur' | 'change'
}

// 单个表单字段描述
export interface FormField {
  model: string           // 绑定的数据字段名 (替换 field)
  label: string           // 显示标签
  type: FieldType         // 渲染组件类型
  rules?: ValidationRule[] // 校验规则
  default?: any           // 默认值
  placeholder?: string    // 占位符
  options?: FieldOption[] // select 类型的选项
  min?: number            // number 类型的最小值 (legacy)
  max?: number            // number 类型的最大值 (legacy)
  rows?: number           // textarea 的行数
}

// 表格列描述
export interface TableColumn {
  field: string           // 数据字段名
  label: string           // 列标题
  width?: number          // 列宽
  align?: 'left' | 'center' | 'right'
  // NOTE: 后续可扩展 valueType 支持格式化（如 thousandth）
}

// 整个页面的 Spec 描述
export interface PageSpec {
  title: string           // 页面标题
  description?: string    // 页面描述
  form: FormField[]       // 表单配置
  table: TableColumn[]    // 表格配置
}
