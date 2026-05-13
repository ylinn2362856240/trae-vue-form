import { componentMap } from '@/config/componentMap'

// 核心调度🔥：根据类型获取对应的组件
// 所有“类型判断”，只在这里发生
export function resolveComponent(type: string) {
  return componentMap[type] || null
}
