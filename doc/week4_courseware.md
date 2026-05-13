# Week 4: 迈向全栈：后端集成与 Mock 策略

## 1. 本周目标
- 搭建基于 FastAPI 的 Python 后端。
- 设计 `/generate` 接口协议。
- 实现后端 Mock 逻辑（关键词匹配算法）。
- 完成前端 API 层的容错封装。

## 2. 核心架构：前后端分工
- **前端**：发送自然语言需求，接收 Spec 并渲染 UI。
- **后端**：解析需求（通过 AI 或 Mock），返回符合协议的 Spec。

## 3. 关键逻辑解析

### 3.1 FastAPI 后端骨架
使用 Python 的 FastAPI 框架，轻量且高性能。
```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class GenerateRequest(BaseModel):
    text: str

@app.post("/generate")
async def generate_ui(req: GenerateRequest):
    # 这里决定走真 AI 还是 Mock
    spec, is_ai = generate_logic(req.text)
    return {"success": True, "data": spec, "is_ai": is_ai}
```

### 3.2 后端 Mock 策略（关键词匹配）
在没有 AI 或 AI 挂掉时，Mock 是保证系统可用的关键。
```python
def mock_generate(text: str):
    # 简单的语义映射
    if "请假" in text:
        return {
            "form": [{"type": "input", "label": "姓名", "model": "name"}, ...],
            "table": [...]
        }
    # 兜底逻辑
    return default_spec
```

### 3.3 前端 API 容错：axios 封装
网络错误不应导致前端 Loading 永不停止。
```typescript
export async function generateByAI(prompt: str) {
  try {
    const res = await axios.post('/api/generate', { text: prompt })
    return res.data
  } catch (error) {
    // 捕获网络超时或 500 错误，给出友好提示
    throw new Error('服务暂时不可用，已自动切换到本地模式')
  }
}
```

## 4. 重点：环境变量管理
不要将 API Key 和后端地址硬编码在代码里。

- **后端**：使用 `.env` 文件配合 `python-dotenv`。
- **前端**：使用 `vite.config.ts` 中的 `define` 或 `.env.development`。

## 5. 避坑指南
- **CORS 跨域**：FastAPI 必须配置 `CORSMiddleware`，否则前端无法调用。
- **日志记录**：后端必须记录每一次请求的 `text`，这是后续优化 AI Prompt 的重要语料库。

## 6. 课后实战
- **任务**：在后端 `mock_generate` 中增加一个新的场景：输入“入库”，返回包含“商品名称”、“单价”、“数量”的表单。
- **验证**：在 Demo 页面输入“帮我做一个商品入库”，验证是否能触发该 Mock 场景。
