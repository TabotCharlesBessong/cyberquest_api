# CyberQuest API — Testing Guide

Documents the **currently implemented** endpoints so you can test them directly. The
server runs at **`http://localhost:4000`** (override with `PORT` in `.env`).

> **Testing on Windows (PowerShell):** the `curl` examples below work in Git Bash / WSL.
> In PowerShell use `curl.exe` (note the `.exe`) and escape inner quotes with backticks,
> e.g. `` curl.exe -X POST http://localhost:4000/api/auth/login -H "Content-Type: application/json" -d "{`"email`":`"a@b.com`",`"password`":`"x`"}" ``. Or use
> `Invoke-RestMethod -Uri ... -Method Post -ContentType "application/json" -Body $json`.

---

## Prerequisites

1. PostgreSQL running and `cyberquest` (or `cyberquest_db`) DB exists.
2. `.env` configured (see `.env.example`). `DB_NAME` must match the DB you created.
3. Server running: `cd cyberquest_api && pnpm dev` (or `pnpm start`).
4. Tables auto-created on boot; seed lessons with `pnpm seed` (optional for auth tests).

### Health check (no auth)
```
GET /health
```
**Success (200):**
```json
{ "success": true, "message": "CyberQuest API is up" }
```

---

## Auth endpoints — base `/api/auth`

All auth endpoints are **JSON** (`Content-Type: application/json`).

### 1. Signup — `POST /api/auth/signup`
- **Auth:** none
- **Body fields:**

| Field | Type | Required | Notes |
|---|---|---|---|
| name | string | yes | |
| email | string | yes | must contain `@` |
| password | string | yes | min 6 chars |
| age | integer | no | 0–120 |
| avatar | string | no | JSON string of cosmetics |

- **Example:**
```bash
curl -X POST http://localhost:4000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Kid","email":"test@example.com","password":"secret123","age":10}'
```
- **Success (201):**
```json
{
  "success": true,
  "message": "Account created. Check your email for the 6-character verification code.",
  "data": {
    "user": {
      "id": "uuid", "name": "Test Kid", "email": "test@example.com",
      "age": 10, "avatar": null, "isVerified": false, "onboarded": false,
      "createdAt": "...", "updatedAt": "..."
    }
  }
}
```
  > The `password`, `verificationCode`, and reset codes are **never** returned.
- **Errors:** `400` missing/invalid fields; `409` email already registered.

### 2. Verify email — `POST /api/auth/verify`
- **Auth:** none · **Body:** `{ "email": string, "code": string }` (code = 6-char `A–Z0–9`, case-insensitive)
- **Example:**
```bash
curl -X POST http://localhost:4000/api/auth/verify \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","code":"QF76MR"}'
```
- **Success (200):** returns `message: "Email verified successfully."` + `data: { token, user }` (user `isVerified: true`).
- **Errors:** `400` missing fields / no pending verification / expired / invalid code.

### 3. Resend verification — `POST /api/auth/resend-verification`
- **Auth:** none · **Body:** `{ "email": string }`
- **Success (200):** `message: "A new verification code has been sent to your email."`
- **Errors:** `400` no account / already verified.

### 4. Login — `POST /api/auth/login`
- **Auth:** none · **Body:** `{ "email": string, "password": string }`
- **Example:**
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"secret123"}'
```
- **Success (200):** `message: "Logged in successfully."` + `data: { token, user }`.
- **Errors:** `401` invalid credentials; **`403`** `Please verify your email before logging in` (unverified accounts cannot log in).

### 5. Forgot password — `POST /api/auth/forgot-password`
- **Auth:** none · **Body:** `{ "email": string }`
- **Success (200):** always `message: "If an account exists for that email, a reset code has been sent."` (avoids leaking account existence). If the account exists, a `resetPasswordCode` is generated in the DB.

### 6. Reset password — `POST /api/auth/reset-password`
- **Auth:** none · **Body:** `{ "email": string, "code": string, "newPassword": string }` (newPassword min 6)
- **Success (200):** `message: "Password reset successful. You can now log in."`
- **Errors:** `400` missing fields / weak password / no pending reset / expired / invalid code.

### 7. Current user — `GET /api/auth/me`
- **Auth:** **required** · Header `Authorization: Bearer <token>` (from login/verify)
- **Example:**
```bash
curl http://localhost:4000/api/auth/me \
  -H "Authorization: Bearer <token>"
```
- **Success (200):** `{ "success": true, "data": { "user": { ... } } }`
- **Errors:** `401` missing/invalid/expired token.

---

## Lecture endpoints — base `/api/lectures`

### 8. List all lectures — `GET /api/lectures`
- **Auth:** none · **Query params:** none
- **Success (200):**
```json
{
  "success": true,
  "data": {
    "lectures": [
      {
        "id": "uuid", "slug": "cybersafe-world", "title": "CyberSafe World",
        "subtitle": "Your adventure begins", "icon": "🌍", "color": "#4D96FF",
        "badge": "🗺️", "badgeName": "Explorer", "order": 1,
        "lessons": [
          { "id":"uuid", "lectureId":"uuid", "stepId":"intro-story", "type":"story",
            "title":"Welcome, hero!", "text":"...", "question":null, "options":null,
            "answer":null, "explanation":null, "icon":"🌍", "mascot":"🦸",
            "speech":"Hi! I'm Captain Cyber...", "order":1, "createdAt":"...", "updatedAt":"..." },
          { "id":"uuid", "lectureId":"uuid", "stepId":"intro-quiz-1", "type":"quiz",
            "title":"", "text":null, "question":"The internet is like…",
            "options":["A boring book","A big world to explore safely","A place only for grown-ups"],
            "answer":1, "explanation":"...", "icon":"🧭", "mascot":null, "speech":null,
            "order":2, "createdAt":"...", "updatedAt":"..." }
        ]
      }
    ]
  }
}
```
- Seeded lectures: `cybersafe-world`, `bully-blocker`, `phishing-fisher`, `password-castle`,
  `privacy-shield` (5 lectures, 3 lessons each).

### 9. Get lecture by slug — `GET /api/lectures/:slug`
- **Auth:** **required** (Bearer token) · **Path param:** `slug` (e.g. `password-castle`)
- **Example:**
```bash
curl http://localhost:4000/api/lectures/password-castle \
  -H "Authorization: Bearer <token>"
```
- **Success (200):** `{ "success": true, "data": { "lecture": { ...same shape as above... } } }`
- **Errors:** `401` no token; `404` `Lecture not found` for unknown slug.

---

## How to get the verification / reset code (SMTP not configured)

By default `EMAIL_*` is unset, so **emails are NOT sent** — the code is only stored in the
DB. To complete signup → verify → login (or forgot → reset) tests, read the code:

```bash
# PostgreSQL (psql) — column names are camelCase:
psql -U postgres -h 127.0.0.1 -d <DB_NAME> \
  -c "SELECT \"verificationCode\", \"resetPasswordCode\" FROM users WHERE email='test@example.com';"
```

Then use that 6-character code in `verify` / `reset-password`.

---

## End-to-end happy path (copy/paste)

```bash
# 1) Signup
curl -X POST http://localhost:4000/api/auth/signup -H "Content-Type: application/json" \
  -d '{"name":"Kid","email":"kid@example.com","password":"secret123","age":9}'

# 2) Get the code from the DB (see section above), then verify
curl -X POST http://localhost:4000/api/auth/verify -H "Content-Type: application/json" \
  -d '{"email":"kid@example.com","code":"<CODE>"}'
# -> returns { data: { token, user } }

# 3) Login (capture the token)
curl -X POST http://localhost:4000/api/auth/login -H "Content-Type: application/json" \
  -d '{"email":"kid@example.com","password":"secret123"}'
# -> returns token

# 4) Use token for protected routes
curl http://localhost:4000/api/auth/me -H "Authorization: Bearer <TOKEN>"
curl http://localhost:4000/api/lectures/password-castle -H "Authorization: Bearer <TOKEN>"
```

---

## Error response shape

All errors return:
```json
{ "success": false, "message": "<human-readable reason>" }
```
with appropriate HTTP status (`400` bad request, `401` unauthorized, `403` forbidden,
`404` not found, `409` conflict, `500` server error).
