import time
import requests
import json

def diagnostic():
    url = "http://127.0.0.1:8045/v1/chat/completions"
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer sk-5455869c2a834b538907d0a6ccb65f66"
    }
    payload = {
        "model": "gemini-3-flash",
        "messages": [{"role": "user", "content": "Hello"}],
        "stream": False
    }

    print(f"--- 代理诊断开始 ---")
    print(f"目标地址: {url}")
    
    start_time = time.time()
    try:
        # 使用 requests 绕过 OpenAI SDK，直接看原始 HTTP 响应
        response = requests.post(url, headers=headers, data=json.dumps(payload), timeout=20)
        duration = time.time() - start_time
        
        print(f"状态码: {response.status_code}")
        print(f"耗时: {duration:.2f}s")
        print(f"响应头: {dict(response.headers)}")
        
        if response.status_code == 200:
            print("响应内容:")
            print(json.dumps(response.json(), indent=2, ensure_ascii=False))
        else:
            print(f"错误内容: {response.text}")
            
    except requests.exceptions.Timeout:
        print("诊断结果: 请求超时！代理可能已挂起或无法访问上游模型。")
    except requests.exceptions.ConnectionError:
        print("诊断结果: 无法连接到代理！请确认 8045 端口的服务是否正在运行。")
    except Exception as e:
        print(f"诊断结果: 发生未知错误: {e}")

if __name__ == "__main__":
    diagnostic()
