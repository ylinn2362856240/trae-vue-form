// parser：解析 spec
// 现在先简单处理，后续可以加入校验、默认值等逻辑
export function parseSpec(spec: any) {
  return {
    form: spec.form || [],
    table: spec.table || []
  }
}
