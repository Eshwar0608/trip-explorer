# Weekend Plans

A full-stack travel review platform (TripAdvisor-style) built with **Next.js 14**, **TailwindCSS**, **shadcn/ui**, **Prisma**, **Supabase PostgreSQL**, and **NextAuth**.

## Features

### Customer
- Register & login (credentials)
- Cascading **State → District → City** selection
- Submit popular places for admin approval
- View approved places and add reviews (rating + comment)

### Admin
- Admin dashboard with pending / approved places
- Approve or reject submissions
- View and delete reviews
- Delete any place

### Public
- Home, browse approved places, place details with reviews

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Styling | TailwindCSS + shadcn/ui |
| Database | Supabase PostgreSQL |
| ORM | Prisma |
| Auth | NextAuth (Credentials) |

## Getting Started

### 1. Supabase database

1. Create a project at [supabase.com](https://supabase.com).
2. Go to **Project Settings → Database**.
3. Copy the **Connection string (URI)**. Use the **Transaction** pooler URL for serverless (recommended for Vercel), or **Direct** for local migrations.
4. Replace `[YOUR-PASSWORD]` with your database password.

### 2. Environment variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Fill in:

```env
DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
NEXTAUTH_SECRET="your-random-secret"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_SUPABASE_URL="https://YOUR_PROJECT.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

Create a public Storage bucket named `trip-images` in Supabase (see deploy section).

Generate `NEXTAUTH_SECRET`:

```bash
openssl rand -base64 32
```

### 3. Install & migrate

```bash
npm install
npx prisma migrate dev --name init
npm run db:seed
```

**Alternative (quick sync without migration history):**

```bash
npm run db:push
npm run db:seed
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Default admin account

After seeding:

| Email | Password |
|-------|----------|
| `admin@weekendplans.com` | `admin123` |

## Deploy to Vercel

### 1. Push to GitHub

Push this repository to GitHub.

### 2. Import on Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**.
2. Import your GitHub repository.
3. Framework preset: **Next.js** (auto-detected).

### 3. Environment variables (Vercel)

In **Project Settings → Environment Variables**, add:

| Name | Value |
|------|--------|
| `DATABASE_URL` | Supabase **Transaction pooler** URI (`?pgbouncer=true`) |
| `DIRECT_DATABASE_URL` | Supabase **Direct** URI (port 5432; used for `prisma migrate deploy` on build) |
| `NEXTAUTH_SECRET` | Same secret as local |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` |
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL (Settings → API) |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (server-only; never expose to client) |

### 4. Supabase Storage (image uploads)

1. In Supabase → **Storage**, create a **public** bucket named `trip-images`.
2. Under bucket policies, allow public read (or use Supabase’s public bucket default).
3. Add `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to `.env` and Vercel.

Customers can attach up to **6 images** (JPEG, PNG, WebP, GIF; 5 MB each) when adding a place or writing a review.

### 5. Run migrations on production

**If you see** `Column (not available) does not exist` / `P2022` on Vercel, the `images` columns were never added. Fix it using one of these:

**Option A — Supabase SQL editor** (fastest):

```sql
ALTER TABLE "Place" ADD COLUMN IF NOT EXISTS "images" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "Review" ADD COLUMN IF NOT EXISTS "images" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
```

**Option B — Prisma CLI** (use the **direct** connection string, not the pooler):

```bash
npx prisma migrate deploy
```

**Option C — Redeploy on Vercel** after setting `DIRECT_DATABASE_URL` (see env table above). The build script runs `prisma migrate deploy` automatically.

Then seed if needed:

```bash
npm run db:seed
```

### 6. Deploy

Vercel runs `npm run build`, which runs `prisma generate`, `prisma migrate deploy`, then `next build`.

## Prisma commands

| Command | Description |
|---------|-------------|
| `npm run db:migrate` | Create & apply migrations (dev) |
| `npm run db:migrate:deploy` | Apply migrations (production) |
| `npm run db:push` | Push schema without migration files |
| `npm run db:seed` | Seed admin user |
| `npm run db:studio` | Open Prisma Studio |

## Project structure

```
src/
├── app/
│   ├── api/          # REST API routes
│   ├── dashboard/
│   │   ├── admin/    # Admin dashboard
│   │   └── customer/ # Customer dashboard
│   ├── places/       # Public browse & detail
│   ├── login/
│   └── register/
├── actions/          # Server actions
├── components/       # UI & feature components
└── lib/              # Auth, Prisma, locations
prisma/
├── schema.prisma
└── seed.ts
```

## API routes

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/register` | Customer registration |
| GET/POST | `/api/places` | List / create places |
| GET/PATCH/DELETE | `/api/places/[id]` | Place CRUD |
| GET/POST | `/api/reviews` | List (admin) / create review |
| DELETE | `/api/reviews/[id]` | Delete review (admin) |
| GET | `/api/locations` | States, districts, cities |

## License

MIT
