# Google Auth setup (NextAuth)

## 1) Google Cloud Console
- Create OAuth Client ID (Web application)
- Authorized redirect URIs:
  - Local: `http://localhost:3000/api/auth/callback/google`
  - If dev runs on 3001: `http://localhost:3001/api/auth/callback/google`
  - Vercel (production): `https://<your-domain>/api/auth/callback/google`

## 2) Env vars
### Local (`.env.local`)
Add:
```
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3001
```

Generate secret:
```
openssl rand -base64 32
```

### Vercel
Project → Settings → Environment Variables
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL` (e.g. `https://kr-hotstocks-web.vercel.app`)

Redeploy.

## 3) Smoke test
- Open `/` and click **Google로 로그인**
- Check `/reports/[date]` shows fullHtml when logged in.
