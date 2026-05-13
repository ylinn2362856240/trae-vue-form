<script setup lang="ts">
/**
 * SpecTable —— 根据 Spec 自动渲染数据表格
 *
 * 核心思路：columns 定义"有哪些列、怎么显示"，data 提供"具体数据"
 * 两者完全解耦，只通过 field 名称关联
 */

import type { TableColumn } from '../core/types'

interface Props {
  columns: TableColumn[]
  data: Record<string, unknown>[]
}

defineProps<Props>()

// 把 department 的 value 转回 label（简单映射）
// TODO: 后续可以从 spec.form 的 options 中自动反查，实现更通用的 label 显示
const DEPT_MAP: Record<string, string> = {
  tech: '技术部',
  product: '产品部',
  design: '设计部',
  marketing: '市场部',
}

function formatCellValue(field: string, value: unknown): string {
  if (value === undefined || value === null || value === '') return '-'

  // NOTE: 部门字段做特殊处理，后续可用 valueFormatter 配置替代
  if (field === 'department' && typeof value === 'string') {
    return DEPT_MAP[value] ?? value
  }

  // 薪资字段格式化为千位分隔
  if (field === 'salary' && typeof value === 'number') {
    return value.toLocaleString('zh-CN')
  }

  return String(value)
}
</script>

<template>
  <div class="spec-table-wrapper">
    <table v-if="data.length > 0" class="spec-table">
      <thead>
        <tr>
          <th
            v-for="col in columns"
            :key="col.field"
            :style="{ width: col.width ? `${col.width}px` : 'auto' }"
            :class="`align-${col.align ?? 'left'}`"
          >
            {{ col.label }}
          </th>
          <th class="action-col">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in data" :key="rowIndex" class="table-row">
          <td
            v-for="col in columns"
            :key="col.field"
            :class="`align-${col.align ?? 'left'}`"
          >
            {{ formatCellValue(col.field, row[col.field]) }}
          </td>
          <td class="action-col">
            <button class="action-btn delete-btn">删除</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 空状态 -->
    <div v-else class="empty-state">
      <div class="empty-icon">📋</div>
      <p class="empty-text">暂无数据，请通过上方表单添加</p>
    </div>
  </div>
</template>

<style scoped>
.spec-table-wrapper {
  overflow-x: auto;
  border-radius: 12px;
  border: 1px solid var(--color-border);
}

.spec-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

thead {
  background: var(--color-table-head);
}

th {
  padding: 12px 16px;
  font-weight: 600;
  color: var(--color-text-secondary);
  font-size: 13px;
  border-bottom: 1px solid var(--color-border);
  white-space: nowrap;
}

td {
  padding: 12px 16px;
  color: var(--color-text);
  border-bottom: 1px solid var(--color-border-light);
}

.table-row:last-child td {
  border-bottom: none;
}

.table-row {
  transition: background 0.15s;
}

.table-row:hover {
  background: var(--color-row-hover);
}

.align-left { text-align: left; }
.align-center { text-align: center; }
.align-right { text-align: right; }

.action-col {
  width: 80px;
  text-align: center;
}

.action-btn {
  height: 28px;
  padding: 0 12px;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.delete-btn {
  background: var(--color-danger-light);
  color: var(--color-danger);
}

.delete-btn:hover {
  background: var(--color-danger);
  color: #fff;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 12px;
}

.empty-icon {
  font-size: 48px;
  opacity: 0.4;
}

.empty-text {
  color: var(--color-text-muted);
  font-size: 14px;
  margin: 0;
}
</style>
