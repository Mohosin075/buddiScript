# Environment variables

The app uses Vite environment variables defined in a `.env` or `.env.local` file.

## Common variables and descriptions

- `VITE_API_BASE_URL` — Backend API base URL (e.g., `http://localhost:5000/api/v1`)
- `VITE_SOCKET_URL` — Socket server URL (e.g., `http://localhost:5000`)
- `VITE_GOOGLE_CLIENT_ID` — Google OAuth client ID used on the frontend

## Local development `.env` example

```
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_SOCKET_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

## Browser & Security

- Environment variables prefixed with `VITE_` are exposed to the browser.
- Avoid placing secrets (like private keys or secret API keys) in these env variables in production.
- For sensitive secrets, set them in your server or use secure secret storage.
