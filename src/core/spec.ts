/**
 * 示例 Spec 定义
 * 这个文件是整个系统的"配置入口"——只要改这里，页面就会跟着变
 *
 * NOTE: 这正是「配置驱动 UI」的核心思想：
 *   - 业务人员描述"要什么"（Spec）
 *   - 引擎负责"怎么做"（渲染组件）
 */

import type { PageSpec } from './types'

export const demoSpec: PageSpec = {
  title: '员工信息管理',
  description: '通过配置生成的表单与表格，无需手写重复代码',

  // 表单配置：每一项描述一个输入字段
  form: [
    {
      field: 'name',
      label: '姓名',
      type: 'input',
      required: true,
      placeholder: '请输入员工姓名',
    },
    {
      field: 'age',
      label: '年龄',
      type: 'number',
      required: true,
      min: 18,
      max: 65,
      placeholder: '请输入年龄',
    },
    {
      field: 'department',
      label: '部门',
      type: 'select',
      required: true,
      options: [
        { label: '技术部', value: 'tech' },
        { label: '产品部', value: 'product' },
        { label: '设计部', value: 'design' },
        { label: '市场部', value: 'marketing' },
      ],
    },
    {
      field: 'salary',
      label: '薪资（元）',
      type: 'number',
      min: 0,
      placeholder: '请输入月薪',
    },
    {
      field: 'joinDate',
      label: '入职日期',
      type: 'date',
    },
    {
      field: 'remark',
      label: '备注',
      type: 'textarea',
      rows: 3,
      placeholder: '请输入备注信息（选填）',
    },
  ],

  // 表格配置：每一列描述如何展示数据
  table: [
    { field: 'name', label: '姓名', width: 120 },
    { field: 'age', label: '年龄', width: 80, align: 'center' },
    { field: 'department', label: '部门', width: 120 },
    { field: 'salary', label: '薪资（元）', width: 140, align: 'right' },
    { field: 'joinDate', label: '入职日期', width: 140 },
    { field: 'remark', label: '备注' },
  ],
}
