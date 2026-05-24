import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/** Project API URL only — e.g. https://abcdefgh.supabase.co (no trailing slash, no /storage/v1) */
export function getSupabaseProjectUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
    process.env.SUPABASE_URL?.trim() ||
    "";

  if (!raw) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL in Vercel (Project Settings → API → Project URL)."
    );
  }

  let url = raw.replace(/\/+$/, "");
  // Strip accidental storage path suffix if pasted from a file URL
  url = url.replace(/\/storage\/v1(\/object\/public\/.*)?$/i, "");

  if (!url.startsWith("https://") || !url.includes(".supabase.co")) {
    throw new Error(
      `NEXT_PUBLIC_SUPABASE_URL looks invalid: "${raw}". Use your Project URL from Supabase → Settings → API (e.g. https://xxxxx.supabase.co).`
    );
  }

  return url;
}

export function getSupabaseServiceRoleKey(): string {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!key) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set. Add it from Supabase → Settings → API → service_role (server-only)."
    );
  }
  return key;
}

export function getSupabaseAdmin(): SupabaseClient {
  return createClient(getSupabaseProjectUrl(), getSupabaseServiceRoleKey(), {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
