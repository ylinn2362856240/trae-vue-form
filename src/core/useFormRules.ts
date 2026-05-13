/**
 * 动态生成 Element Plus 校验规则
 */
export function buildRules(schema: any[]) {
  const rules: Record<string, any[]> = {}

  schema.forEach(item => {
    if (item.rules) {
      rules[item.model] = item.rules
    }
  })

  return rules
}
