import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

/**
 * Type-safe environment variables for the Housing Association CRM
 * 
 * This validates all environment variables at build time and runtime,
 * ensuring the application fails fast if configuration is missing or invalid.
 * 
 * @see https://env.t3.gg/docs/nextjs
 */
export const env = createEnv({
  /**
   * Server-side environment variables
   * Never exposed to the client
   */
  server: {
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
    
    // Optional: Service role key for server-side Supabase operations
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  },

  /**
   * Client-side environment variables
   * Exposed to the browser (must be prefixed with NEXT_PUBLIC_)
   */
  client: {
    NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
  },

  /**
   * Runtime environment mapping
   * Must manually destructure process.env for Next.js tree-shaking
   */
  runtimeEnv: {
    // Server
    NODE_ENV: process.env.NODE_ENV,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    
    // Client
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  },

  /**
   * Treat empty strings as undefined
   * Prevents accidentally passing empty string as valid value
   */
  emptyStringAsUndefined: true,

  /**
   * Skip validation during build if running in CI without env vars
   * Only disable this if you're using a separate env validation step
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
