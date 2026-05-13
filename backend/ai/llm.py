import os
import json
import logging
from dotenv import load_dotenv
from openai import OpenAI
from .prompt import build_prompt

# 加载 .env 变量
load_dotenv()

# 配置日志
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# 从环境变量获取，不再硬编码默认值
API_KEY = os.getenv("OPENAI_API_KEY")
BASE_URL = os.getenv("OPENAI_BASE_URL")

if not API_KEY:
    logger.error("未找到 OPENAI_API_KEY，请检查 .env 文件")

# 初始化 OpenAI 客户端，增加默认超时时间 (15s)
client = OpenAI(
    api_key=API_KEY, 
    base_url=BASE_URL,
    timeout=15.0
)

def generate_spec(text: str):
    """
    调用真实的 LLM 接口生成表单和表格的 Spec 配置
    """
    try:
        logger.info(f"正在调用真实 LLM 模型接口 (Model: gemini-3-flash, URL: {BASE_URL})...")
        prompt = build_prompt(text)
        logger.info(f"正在发送请求至 LLM...")
        # 简化请求参数，部分代理不支持 system role 或 response_format
        full_prompt = f"系统指令：你是一个专业的 UI 配置专家，只输出 JSON 格式。\n\n用户需求：{prompt}"
        
        response = client.chat.completions.create(
            model="gemini-3-flash",
            messages=[
                {"role": "user", "content": full_prompt}
            ],
            # 暂时移除 response_format 以排除代理兼容性问题
            # response_format={ "type": "json_object" }
        )

        content = response.choices[0].message.content
        logger.info("LLM 接口调用成功。")
        return json.loads(content), True
    except Exception as e:
        logger.error(f"调用 LLM 接口失败: {e}")
        logger.warning("切换至 Mock 模拟逻辑。")
        return mock_generate(text), False

def mock_generate(text: str):
    """
    更真实的 Mock 逻辑：基于关键词匹配模拟 AI 的语义理解
    """
    # 1. 字段知识库
    field_dict = {
        "姓名": {"type": "input", "label": "姓名", "model": "name", "rules": [{"required": True, "message": "请输入姓名"}]},
        "年龄": {"type": "number", "label": "年龄", "model": "age", "default": 18},
        "性别": {"type": "select", "label": "性别", "model": "gender", "options": [{"label": "男", "value": "m"}, {"label": "女", "value": "f"}]},
        "邮箱": {"type": "input", "label": "电子邮箱", "model": "email"},
        "手机": {"type": "input", "label": "手机号", "model": "phone"},
        "商品名称": {"type": "input", "label": "商品名称", "model": "title", "rules": [{"required": True, "message": "请输入商品名称"}]},
        "价格": {"type": "number", "label": "单价", "model": "price", "default": 0},
        "数量": {"type": "number", "label": "数量", "model": "count", "default": 1},
        "日期": {"type": "date", "label": "日期", "model": "date"},
        "备注": {"type": "input", "label": "备注说明", "model": "remark"},
        "描述": {"type": "input", "label": "详细描述", "model": "description"},
        "地址": {"type": "input", "label": "详细地址", "model": "address"},
        "入职日期": {"type": "date", "label": "入职日期", "model": "joinDate"},
        "离职日期": {"type": "date", "label": "离职日期", "model": "leaveDate"},
        "请假原因": {"type": "input", "label": "请假原因", "model": "reason"},
    }

    # 2. 预定义场景
    scenarios = [
        {
            "keywords": ["用户", "员工", "人员", "注册", "转正", "请假"],
            "fields": ["姓名", "年龄", "性别", "手机", "日期"]
        },
        {
            "keywords": ["商品", "产品", "库存", "订单", "采购"],
            "fields": ["商品名称", "价格", "数量", "备注"]
        },
        {
            "keywords": ["反馈", "意见", "工单", "投诉"],
            "fields": ["姓名", "手机", "描述"]
        }
    ]

    result = {"form": [], "table": []}

    # 核心逻辑：
    # A. 提取明确提到的字段
    matched_fields = [k for k in field_dict.keys() if k in text]

    # B. 匹配业务场景
    matched_scenario = next((s for s in scenarios if any(kw in text for kw in s["keywords"])), None)

    # 组装字段列表
    if matched_scenario:
        # 如果匹配到场景，则使用场景预设字段，并合并用户额外提到的字段
        # 使用 list(dict.fromkeys(...)) 保持顺序并去重
        final_field_keys = list(dict.fromkeys(matched_scenario["fields"] + matched_fields))
    elif len(matched_fields) > 0:
        # 没有匹配场景但提到了字段
        final_field_keys = matched_fields
    else:
        # 兜底：提取输入的前几个字作为标题
        custom_label = text[:4] if len(text) > 2 else "自定义"
        result["form"] = [
            {"type": "input", "label": f"{custom_label}名称", "model": "title", "rules": [{"required": True, "message": "必填"}]},
            field_dict["备注"]
        ]
        result["table"] = [{"label": "名称", "prop": "title"}, {"label": "备注", "prop": "remark"}]
        return result

    # 填充结果
    for key in final_field_keys:
        # 如果是已知的中文 key，直接从 field_dict 取
        if key in field_dict:
            f = field_dict[key]
        else:
            # 否则，尝试映射常见的英文 model 名
            english_map = {"地址": "address", "标题": "title", "姓名": "name", "年龄": "age"}
            model_key = english_map.get(key, f"field_{len(result['form'])}")
            f = {"type": "input", "label": key, "model": model_key}
            
        result["form"].append(f)
        result["table"].append({"label": f["label"], "prop": f["model"]})

    return result
