from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from ai.llm import generate_spec

app = FastAPI()

# 配置跨域，允许 Vue 开发环境访问
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # 生产环境建议指定具体域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class GenerateRequest(BaseModel):
    text: str

@app.post("/generate")
async def generate(req: GenerateRequest):
    spec, is_ai = generate_spec(req.text)
    return {
        "success": True,
        "is_ai": is_ai,
        "data": spec
    }

if __name__ == "__main__":
    import uvicorn
    # 启动服务器 (开启 reload 以便代码修改后自动重启)
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
