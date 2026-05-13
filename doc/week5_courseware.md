# Week 5: AI 赋能：让自然语言生成 UI

## 1. 本周目标
- 掌握针对 UI 生成的 Prompt Engineering（提示词工程）。
- 实现 LLM 接口调用与 JSON 解析。
- 建立 AI 调用的稳定性保障机制（Timeout & Fallback）。
- 优化前端交互：提示词示例与一键生成。

## 2. 核心灵魂：Prompt Engineering
AI 能否生成正确的 Spec，取决于你如何“调教”它。

**一个完美的 Prompt 应包含：**
1. **角色设定**：你是专业的 UI 配置专家。
2. **任务描述**：将用户的自然语言需求转为 JSON Spec。
3. **约束条件**：必须符合定义的 Schema，只能使用特定的 `type`（input, select, date...）。
4. **输出格式**：只返回纯 JSON，不要包含 Markdown 代码块。

## 3. 关键逻辑解析

### 3.1 后端 LLM 调用与解析
```python
def generate_spec_real(text):
    prompt = f"你是一个 UI 专家... 用户需求：{text}"
    # 调用 OpenAI/Gemini 接口
    response = client.chat.completions.create(
        model="gemini-3-flash",
        messages=[{"role": "user", "content": prompt}]
    )
    # 解析 JSON
    content = response.choices[0].message.content
    return json.loads(content)
```

### 3.2 稳定性保障：双保险机制
AI 接口可能超时或被限流，系统必须足够强壮。
```python
def generate_spec(text):
    try:
        # 第一层：设定 15s 超时
        return call_real_llm(text, timeout=15), True
    except Exception:
        # 第二层：失败后自动降级到 Mock
        return mock_generate(text), False
```

## 4. 前端交互优化
在 `Demo.vue` 中添加“推荐尝试”标签，降低用户的上手难度。
```vue
<el-tag 
  v-for="tag in suggestions" 
  @click="handleSuggestionClick(tag.value)"
>
  {{ tag.label }}
</el-tag>
```

## 5. 避坑指南
- **JSON 截断**：如果 Prompt 太长或 Max Tokens 太短，JSON 可能被截断导致解析报错。
- **幻觉问题**：AI 可能会胡乱发明组件类型（比如 `color-picker`），前端必须在渲染层有兜底处理。
- **代理死锁**：使用本地代理请求模型时，注意连接池管理，防止大量并发导致端口积压。

## 6. 课程总结与展望
至此，我们已经构建了一个完整的 **“自然语言 -> AI 解析 -> 配置下发 -> 动态渲染”** 的全链路闭环。

**未来方向：**
- **双向编辑**：渲染出 UI 后，用户手动修改，反向同步给 AI。
- **多语言支持**：让 AI 支持多国语言的 Spec 生成。
- **性能监控**：记录 AI 生成的 Spec 准确率，持续微调 Prompt。

---
恭喜您完成了全部课程！
