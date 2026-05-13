/**
 * 自动根据 spec 初始化表单数据
 */
export function initFormData(schema: any[]) {
  const data: Record<string, any> = {}

  schema.forEach(item => {
    // 根据字段类型设置默认值
    if (item.default !== undefined) {
      data[item.model] = item.default
    } else {
      // 这里的 type 对应 spec 中的类型
      data[item.model] = item.type === 'number' ? 0 : ''
    }
  })

  return data
}
