import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

/**
 * Type-safe environment variables for AWS CDK infrastructure
 *
 * Validates CDK-specific and Supabase environment variables required
 * for deploying the Amplify stack.
 *
 * @see https://env.t3.gg/docs/core
 */
export const env = createEnv({
  server: {
    // AWS CDK environment
    CDK_DEFAULT_ACCOUNT: z
      .string()
      .optional()
      .describe("AWS account ID - auto-detected if not provided"),

    CDK_DEFAULT_REGION: z
      .string()
      .default("eu-west-2")
      .describe("AWS region for deployment"),

    // Supabase configuration to pass to Amplify
    NEXT_PUBLIC_SUPABASE_URL: z
      .string()
      .url()
      .describe("Supabase project URL for the Next.js app"),

    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z
      .string()
      .min(1)
      .describe("Supabase publishable key for the Next.js app"),
  },

  runtimeEnv: {
    CDK_DEFAULT_ACCOUNT: process.env.CDK_DEFAULT_ACCOUNT,
    CDK_DEFAULT_REGION: process.env.CDK_DEFAULT_REGION,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  },

  emptyStringAsUndefined: true,

  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
