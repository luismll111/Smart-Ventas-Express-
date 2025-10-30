import { createClient } from "@supabase/supabase-js";

let client;

function assertEnv(name, value) {
  if (!value || typeof value !== "string") {
    throw new Error("Missing " + name + ". Add it to .env.local");
  }
  if (name === "NEXT_PUBLIC_SUPABASE_URL") {
    try { new URL(value); } catch {
      throw new Error("Invalid " + name + ': "' + String(value) + '"');
    }
    if (!value.startsWith("https://") || value.indexOf(".supabase.co") === -1) {
      throw new Error("Invalid " + name + ": must look like https://xxxx.supabase.co");
    }
  }
}

export function supabaseBrowser() {
  if (!client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    assertEnv("NEXT_PUBLIC_SUPABASE_URL", url);
    assertEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", anon);

    client = createClient(url, anon, { auth: { persistSession: false } });
  }
  return client;
}