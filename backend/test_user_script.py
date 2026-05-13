from openai import OpenAI

client = OpenAI(
    base_url="http://127.0.0.1:8045/v1",
    api_key="sk-5455869c2a834b538907d0a6ccb65f66"
)

try:
    print("Testing with user's script...")
    response = client.chat.completions.create(
        model="gemini-3-flash",
        messages=[{"role": "user", "content": "Hello"}],
        timeout=10
    )
    print("Response received:")
    print(response.choices[0].message.content)
except Exception as e:
    print(f"Error: {e}")
