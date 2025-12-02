import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

/**
 * Type-safe environment variables for database tooling
 *
 * Used by seed scripts and migration tools that need direct
 * database access via Supabase service role.
 *
 * @see https://env.t3.gg/docs/core
 */
export const env = createEnv({
  server: {
    SUPABASE_URL: z
      .string()
      .url()
      .describe(
        "Supabase project URL (e.g., http://127.0.0.1:54321 for local)"
      ),

    SUPABASE_SERVICE_ROLE_KEY: z
      .string()
      .min(1)
      .describe("Supabase service role key with admin privileges"),
  },

  runtimeEnv: {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  },

  emptyStringAsUndefined: true,

  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
