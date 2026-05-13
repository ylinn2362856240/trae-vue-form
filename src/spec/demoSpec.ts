// Spec 升级版（支持校验配置、默认值）
export const spec = {
  form: [
    { 
      type: 'input', 
      label: '姓名', 
      model: 'name',
      default: '',
      rules: [
        { required: true, message: '请输入姓名', trigger: 'blur' }
      ]
    },
    { 
      type: 'number', 
      label: '年龄', 
      model: 'age',
      default: 25,
      rules: [
        { required: true, message: '请输入年龄', trigger: 'blur' }
      ]
    },
    {
      type: 'select',
      label: '性别',
      model: 'gender',
      default: 1,
      options: [
        { label: '男', value: 1 },
        { label: '女', value: 2 }
      ],
      rules: [
        { required: true, message: '请选择性别', trigger: 'change' }
      ]
    }
  ],
  table: [
    { label: '姓名', prop: 'name' },
    { label: '年龄', prop: 'age' },
    { label: '性别', prop: 'gender' }
  ]
}
