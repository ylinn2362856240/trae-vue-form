/**
 * 后端 AI 生成接口对接
 */
export async function generateByAI(text: string) {
  try {
    const response = await fetch('http://localhost:8000/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text })
    })

    // 1. 检查 HTTP 状态码
    if (!response.ok) {
      // 尝试获取后端返回的错误详情（如果是 JSON）
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        const errJson = await response.json()
        throw new Error(errJson.detail || errJson.message || `请求失败: ${response.status}`)
      }
      throw new Error(`网络请求失败 (HTTP ${response.status})`)
    }

    // 2. 确保返回的是 JSON
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('后端返回了非 JSON 格式的内容')
    }

    const resData = await response.json()
    
    if (resData.success) {
      return {
        spec: resData.data,
        isAi: resData.is_ai
      }
    } else {
      throw new Error(resData.message || '生成失败')
    }
  } catch (error: any) {
    // NOTE: 移除 console.error 以防止触发 Vite 的 HMR 报错死循环
    // 如果是 fetch 导致的 Network Error，给出明确提示
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      throw new Error('无法连接到后端 AI 服务，请确认 Python 服务已启动（默认 8000 端口）')
    }
    throw error
  }
}
