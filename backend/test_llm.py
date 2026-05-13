import os
import json
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

API_KEY = os.getenv("OPENAI_API_KEY")
BASE_URL = os.getenv("OPENAI_BASE_URL")

import sys

def log(msg):
    print(msg)
    sys.stdout.flush()

log(f"API_KEY: {API_KEY[:10]}...")
log(f"BASE_URL: {BASE_URL}")

import socket

def check_port(url):
    try:
        from urllib.parse import urlparse
        parsed = urlparse(url)
        host = parsed.hostname
        port = parsed.port or (80 if parsed.scheme == 'http' else 443)
        log(f"Checking if {host}:{port} is reachable...")
        with socket.create_connection((host, port), timeout=3):
            log("Port is reachable.")
            return True
    except Exception as e:
        log(f"Port is NOT reachable: {e}")
        return False

if check_port(BASE_URL):
    client = OpenAI(api_key=API_KEY, base_url=BASE_URL)
    # ... rest of the code
else:
    log("Skipping LLM call because port is unreachable.")
    sys.exit(1)

try:
    log("Testing LLM connection (Simplified)...")
    full_prompt = f"系统指令：你是一个专业的 UI 配置专家，只输出 JSON 格式。\n\n用户需求：Hello"
    response = client.chat.completions.create(
        model="gemini-3-flash",
        messages=[
            {"role": "user", "content": full_prompt}
        ],
        timeout=10
    )
    log("Response received:")
    log(response.choices[0].message.content)
except Exception as e:
    log(f"Error: {e}")
