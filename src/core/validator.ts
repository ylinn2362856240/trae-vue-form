/**
 * 表单校验引擎
 * 根据 Spec 中的 required / min / max 等规则进行校验
 *
 * NOTE: 这里只做「简单版」校验，后续可以扩展更复杂的规则（正则、自定义函数等）
 */

import type { FormField } from './types'

// 单个字段的校验结果
export interface FieldError {
  field: string
  message: string
}

/**
 * 校验整个表单数据
 * @param fields Spec 中的表单字段配置
 * @param data 当前表单的数据对象
 * @returns 校验错误列表，空数组表示通过
 */
export function validateForm(
  fields: FormField[],
  data: Record<string, unknown>,
): FieldError[] {
  const errors: FieldError[] = []

  for (const field of fields) {
    const value = data[field.field]

    // 必填校验
    if (field.required) {
      const isEmpty =
        value === undefined ||
        value === null ||
        value === '' ||
        (typeof value === 'string' && value.trim() === '')

      if (isEmpty) {
        errors.push({
          field: field.field,
          message: `${field.label}不能为空`,
        })
        // 必填未通过就不继续校验该字段的其他规则
        continue
      }
    }

    // number 类型的范围校验
    if (field.type === 'number' && value !== '' && value !== undefined && value !== null) {
      const num = Number(value)

      if (field.min !== undefined && num < field.min) {
        errors.push({
          field: field.field,
          message: `${field.label}不能小于 ${field.min}`,
        })
      }

      if (field.max !== undefined && num > field.max) {
        errors.push({
          field: field.field,
          message: `${field.label}不能大于 ${field.max}`,
        })
      }
    }
  }

  return errors
}

/**
 * 从错误列表中取出某个字段的错误信息
 * @returns 错误信息字符串，无错误返回 undefined
 */
export function getFieldError(
  errors: FieldError[],
  fieldName: string,
): string | undefined {
  return errors.find((e) => e.field === fieldName)?.message
}
