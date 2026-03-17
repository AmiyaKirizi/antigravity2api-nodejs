# Model List And Sample Request

This short guide shows how to:

1. get the available model list
2. send a simple chat request

Default local server:

```text
http://localhost:8045
```

## Authentication

Send your API key in the `Authorization` header:

```http
Authorization: Bearer YOUR_API_KEY
```

## Get Model List

### cURL

```bash
curl http://localhost:8045/v1/models \
  -H "Authorization: Bearer YOUR_API_KEY"
```


### PowerShell

```powershell
IwR -Uri "http://localhost:8045/v1/models" `
  -Headers @{ Authorization = "Bearer YOUR_API_KEY" }
```

### Example Response

```json
{
  "object": "list",
  "data": [
    {
      "id": "gemini-2.5-pro",
      "object": "model",
      "created": 0,
      "owned_by": "antigravity"
    }
  ]
}
```

## Send A Sample Chat Request

### cURL

```bash
curl http://localhost:8045/v1/chat/completions \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-2.5-pro",
    "messages": [
      { "role": "user", "content": "Hello, give me a short introduction." }
    ],
    "stream": false
  }'
```

### PowerShell

```powershell
$body = @{
  model = "gemini-2.5-pro"
  messages = @(
    @{ role = "user"; content = "Hello, give me a short introduction." }
  )
  stream = $false
} | ConvertTo-Json -Depth 5

Invoke-RestMethod -Uri "http://localhost:8045/v1/chat/completions" `
  -Method Post `
  -Headers @{
    Authorization = "Bearer YOUR_API_KEY"
    "Content-Type" = "application/json"
  } `
  -Body $body
```

### Example Response

```json
{
  "id": "chatcmpl-xxx",
  "object": "chat.completion",
  "created": 1234567890,
  "model": "gemini-2.5-pro",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Hello! I am an OpenAI-compatible proxy backed by Antigravity."
      },
      "finish_reason": "stop"
    }
  ]
}
```

## Notes

- Use `GET /v1/models` to inspect the exact model IDs your server currently exposes.
- Use one of those returned model IDs in the `model` field of your chat request.
- If you changed the port or host in config, replace `http://localhost:8045` with your actual address.
