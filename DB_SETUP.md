# DB Setup (Supabase Postgres + Prisma)

## 1) Create Supabase project
- Create a new project (region 가까운 곳)
- Copy **connection string** for Prisma:
  - Supabase dashboard → Project Settings → Database → Connection string
  - Use the **Transaction pooler** URL if you see connection-limit issues later.

## 2) Set env var
### Local
Create `apps/kr-hotstocks-web/.env.local`:

```bash
DATABASE_URL="<paste-your-supabase-postgres-url>"
```

### Vercel
Project → Settings → Environment Variables
- Add `DATABASE_URL` (same value)

Redeploy.

## 3) Create tables via Prisma
From `apps/kr-hotstocks-web`:

```bash
npx prisma db push
```

This will create the `reports` table.

## 4) Insert a sample report (for testing)
In Supabase SQL editor:

```sql
insert into reports (date, public_html, full_html, json)
values (
  '2026-02-10',
  '<h2>공개 미리보기</h2><p>비로그인: 근거 제목만 공개</p>',
  '<h2>전체 보기</h2><p>로그인: 링크/내일 체크까지</p>',
  '{"hello":"world"}'::jsonb
)
on conflict (date) do update set
  public_html = excluded.public_html,
  full_html = excluded.full_html,
  json = excluded.json;
```

Then open:
- `/reports`
- `/reports/2026-02-10`
