/**
 * Ensures Place.images and Review.images exist in production.
 * Runs during Vercel build when DATABASE_URL is set.
 * DDL may require a direct connection — set DIRECT_DATABASE_URL if the pooler fails.
 */
import pg from "pg";

const SQL = `
ALTER TABLE "Place" ADD COLUMN IF NOT EXISTS "images" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "Review" ADD COLUMN IF NOT EXISTS "images" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
`;

const MANUAL_HELP = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Database is missing the "images" columns. Fix in Supabase:

1. Open your project → SQL Editor → New query
2. Paste and run:

ALTER TABLE "Place" ADD COLUMN IF NOT EXISTS "images" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "Review" ADD COLUMN IF NOT EXISTS "images" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

3. Redeploy (or refresh the site)

Optional: add DIRECT_DATABASE_URL in Vercel (Supabase direct URI, port 5432)
so future builds can apply this automatically.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

function connectionCandidates() {
  const urls = [];

  if (process.env.DIRECT_DATABASE_URL) {
    urls.push({ label: "DIRECT_DATABASE_URL", url: process.env.DIRECT_DATABASE_URL });
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (databaseUrl) {
    urls.push({ label: "DATABASE_URL", url: databaseUrl });

    // Supabase transaction pooler (6543) often cannot run DDL — try session/direct port
    try {
      const parsed = new URL(databaseUrl);
      if (parsed.port === "6543" || databaseUrl.includes("pgbouncer=true")) {
        const direct = new URL(databaseUrl);
        direct.port = "5432";
        direct.searchParams.delete("pgbouncer");
        urls.push({ label: "DATABASE_URL (port 5432)", url: direct.toString() });
      }
    } catch {
      // ignore invalid URL
    }
  }

  return urls;
}

async function columnsExist(client) {
  const { rows } = await client.query(
    `SELECT table_name, column_name
     FROM information_schema.columns
     WHERE table_schema = 'public'
       AND table_name IN ('Place', 'Review')
       AND column_name = 'images'`
  );
  const tables = new Set(rows.map((r) => r.table_name));
  return tables.has("Place") && tables.has("Review");
}

async function tryEnsure(label, connectionString) {
  const pool = new pg.Pool({ connectionString, max: 1 });
  const client = await pool.connect();
  try {
    if (await columnsExist(client)) {
      console.log(`[db-setup] images columns already exist (${label})`);
      return true;
    }
    console.log(`[db-setup] Adding images columns via ${label}...`);
    await client.query(SQL);
    if (await columnsExist(client)) {
      console.log(`[db-setup] images columns created (${label})`);
      return true;
    }
    return false;
  } finally {
    client.release();
    await pool.end();
  }
}

async function main() {
  const candidates = connectionCandidates();

  if (candidates.length === 0) {
    console.warn("[db-setup] DATABASE_URL not set — skipping column setup");
    console.warn("[db-setup] Run the SQL in Supabase before using image uploads.");
    return;
  }

  const errors = [];

  for (const { label, url } of candidates) {
    try {
      if (await tryEnsure(label, url)) {
        return;
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      errors.push(`${label}: ${message}`);
      console.warn(`[db-setup] ${label} failed: ${message}`);
    }
  }

  console.error(MANUAL_HELP);
  if (errors.length > 0) {
    console.error("[db-setup] Attempts:\n", errors.map((e) => `  - ${e}`).join("\n"));
  }

  // Fail build so the issue is visible; app cannot run without these columns
  process.exit(1);
}

main();
