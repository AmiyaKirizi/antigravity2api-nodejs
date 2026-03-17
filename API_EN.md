# API Guide

This service exposes OpenAI-compatible and related endpoints backed by Antigravity.

## Base URL

```text
http://localhost:8045
```

## Authentication

Send your API key in the request headers:

```http
Authorization: Bearer YOUR_API_KEY
```

## Core Endpoints

### List models

```http
GET /v1/models
```

### OpenAI chat completions

```http
POST /v1/chat/completions
```

Example:

```json
{
  "model": "gemini-2.5-pro",
  "messages": [
    { "role": "user", "content": "Hello" }
  ],
  "stream": false
}
```

### Claude-compatible messages

```http
POST /v1/messages
```

### Gemini-compatible generateContent

```http
POST /v1beta/models/:model:generateContent
```

### SD WebUI-compatible image generation

```http
POST /sdapi/v1/txt2img
POST /sdapi/v1/img2img
```

## Supported Features

- Streaming responses
- Non-stream responses
- Function calling / tools
- Image input
- Image generation
- Thinking / reasoning budget controls
- Token rotation and retry handling

## Common Parameters

- `model`
- `messages`
- `stream`
- `temperature`
- `top_p`
- `top_k`
- `max_tokens`
- `thinking_budget`
- `reasoning_effort`
- `tools`

## Admin API

The admin API uses JWT/cookie authentication from the dashboard login flow.

Typical areas:

- token management
- Gemini CLI token management
- quota refresh
- rotation strategy updates
- config updates
- logs
- IP block list / whitelist

## Error Codes

- `200` success
- `400` invalid request
- `401` invalid or missing API key
- `429` rate limited
- `500` internal server error

## Notes

- Model lists may be cached based on config.
- Some reasoning features depend on the upstream model.
- Generated images are stored under `public/images/` when enabled.
