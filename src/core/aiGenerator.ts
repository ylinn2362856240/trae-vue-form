/**
 * 模拟 AI 生成 Spec
 * 这里通过关键词识别 + 规则组合，模拟大模型对自然语言的理解
 */
export function generateSpecByText(desc: string) {
  const result: any = { form: [], table: [] }

  // 1. 预设字段知识库 (Field Knowledge Base)
  const fieldDict: Record<string, any> = {
    '姓名': { type: 'input', label: '姓名', model: 'name', rules: [{ required: true, message: '请输入姓名', trigger: 'blur' }] },
    '名字': { type: 'input', label: '名字', model: 'name', rules: [{ required: true, message: '请输入名字' }] },
    '年龄': { type: 'number', label: '年龄', model: 'age', default: 18 },
    '性别': { type: 'select', label: '性别', model: 'gender', options: [{ label: '男', value: 'male' }, { label: '女', value: 'female' }] },
    '邮箱': { type: 'input', label: '邮箱', model: 'email', rules: [{ required: true, message: '请输入邮箱' }] },
    '手机': { type: 'input', label: '手机号', model: 'phone' },
    '电话': { type: 'input', label: '联系电话', model: 'phone' },
    '地址': { type: 'input', label: '地址', model: 'address' },
    '商品名称': { type: 'input', label: '商品名称', model: 'title', rules: [{ required: true, message: '名称必填' }] },
    '产品名称': { type: 'input', label: '产品名称', model: 'title', rules: [{ required: true, message: '名称必填' }] },
    '价格': { type: 'number', label: '价格', model: 'price', default: 9.9 },
    '金额': { type: 'number', label: '金额', model: 'amount', default: 0 },
    '数量': { type: 'number', label: '数量', model: 'count', default: 1 },
    '库存': { type: 'number', label: '库存量', model: 'stock', default: 100 },
    '备注': { type: 'input', label: '备注', model: 'remark' },
    '描述': { type: 'input', label: '详细描述', model: 'description' }
  }

  // 2. 提取明确提到的字段
  const matchedFields = Object.keys(fieldDict).filter(key => desc.includes(key))

  // 3. 基于场景的推断模板
  const scenarios = [
    {
      keywords: ['用户', '员工', '人员', '注册', '账号'],
      defaultFields: ['姓名', '年龄', '性别', '手机']
    },
    {
      keywords: ['商品', '产品', '库存', '订单'],
      defaultFields: ['商品名称', '价格', '库存', '备注']
    },
    {
      keywords: ['反馈', '投诉', '建议', '意见', '工单'],
      defaultFields: ['姓名', '手机', '描述']
    }
  ]

  // 核心智能逻辑：优先相信用户的直接指令（如果指定了 2 个以上明确字段）
  if (matchedFields.length > 1) {
    matchedFields.forEach(key => {
      const fieldConfig = { ...fieldDict[key] }
      result.form.push(fieldConfig)
      result.table.push({ label: fieldConfig.label, prop: fieldConfig.model })
    })
    return result
  }

  // 否则，尝试匹配业务场景模板
  let matchedScenario = scenarios.find(s => s.keywords.some(kw => desc.includes(kw)))
  
  if (matchedScenario) {
    // 组装模板字段，如果文本里碰巧也提到了其它字典字段，一并加上
    const fieldsToGenerate = new Set([...matchedScenario.defaultFields, ...matchedFields])
    
    fieldsToGenerate.forEach(key => {
      const fieldConfig = { ...fieldDict[key] }
      result.form.push(fieldConfig)
      result.table.push({ label: fieldConfig.label, prop: fieldConfig.model })
    })
  } else {
    // 4. 万能兜底逻辑（当完全无法匹配时，尝试基于输入内容生成定制字段）
    const customTitle = desc.length > 2 && desc.length < 8 ? desc : '自定义'
    
    result.form = [
      { type: 'input', label: customTitle + '名称', model: 'customName', rules: [{ required: true, message: '必填项' }] },
      { type: 'number', label: '数值', model: 'customNum', default: 0 },
      fieldDict['备注']
    ]
    result.table = [
      { label: '名称', prop: 'customName' },
      { label: '数值', prop: 'customNum' }
    ]
  }

  return result
}

