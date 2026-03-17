# Antigravity to OpenAI API Proxy

This project converts the Google Antigravity API into OpenAI-compatible endpoints. It supports streaming, tool calling, multi-account rotation, token refresh, image input, image generation, and an admin dashboard.

## Highlights

- OpenAI-compatible chat completions
- Gemini CLI and Claude-compatible request support
- Streaming and non-streaming responses
- Function calling
- Multi-account token rotation
- Token auto-refresh
- Image input and image generation
- Quota viewing and refresh
- SD WebUI-compatible image endpoints
- Admin dashboard for tokens, settings, logs, security, and Gemini CLI tokens

## Requirements

- Node.js 18+

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Create configuration files

If `.env` and `config.json` do not exist, the project will create defaults on first start. You can also copy the examples manually:

```bash
cp .env.example .env
cp config.json.example config.json
```

### 3. Configure environment variables

Typical `.env` values:

```env
API_KEY=sk-your-api-key
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
JWT_SECRET=change-this-secret
# PROXY=http://127.0.0.1:7890
# IMAGE_BASE_URL=http://your-domain.com
```

### 4. Log in to Google and obtain a token

```bash
npm run login
```

After authorization, tokens are stored in `data/accounts.json`.

### 5. Start the service

```bash
npm start
```

Default address:

```text
http://localhost:8045
```

## Useful Scripts

```bash
npm start
npm run login
```

There are also helper scripts in the repo:

- `setup.sh` / `setup.bat`
- `start.sh` / `start.bat`
- `update.sh` / `update.bat`

## Admin Dashboard

Open the web dashboard after startup and sign in with the admin credentials from `.env`.

Main sections:

- Token Management
- Gemini CLI Tokens
- Settings
- Logs
- Security

## API Endpoints

Common endpoints include:

- `POST /v1/chat/completions`
- `GET /v1/models`
- `POST /v1/messages`
- `POST /v1beta/models/:model:generateContent`
- `POST /sdapi/v1/txt2img`
- `POST /sdapi/v1/img2img`

See [API_EN.md](/Users/lu.t/Desktop/phd_files/proxy_antigravity/API_EN.md) for a compact English API guide.
See [MODEL_LIST_AND_SAMPLE_REQUEST.md](/Users/lu.t/Desktop/phd_files/proxy_antigravity/MODEL_LIST_AND_SAMPLE_REQUEST.md) for a quick copy-paste example covering model listing and a sample chat request.

## Notes

- Keep `.env`, `config.json`, and token files private.
- The dashboard now has an English-first UI in this translated workspace.
- The original Chinese docs are still available in `API.md` and `QUOTA_FEATURE.md`.
