import { z } from "zod";

/**
 * Server-only environment variables schema.
 * These will never be bundled into or exposed on the client.
 */
export const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().url().optional(),
  DIRECT_URL: z.string().url().optional(),
  NEXTAUTH_SECRET: z.string().min(16).optional(),
  NEXTAUTH_URL: z.string().url().optional(),
  RESEND_API_KEY: z.string().startsWith("re_").optional(),
  RESEND_FROM_EMAIL: z.string().email().optional(),
  CLOUDFLARE_R2_ACCOUNT_ID: z.string().optional(),
  CLOUDFLARE_R2_ACCESS_KEY_ID: z.string().optional(),
  CLOUDFLARE_R2_SECRET_ACCESS_KEY: z.string().optional(),
  CLOUDFLARE_R2_BUCKET_NAME: z.string().optional(),
});

/**
 * Client-exposed environment variables schema (must have NEXT_PUBLIC_ prefix).
 */
export const clientEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().optional(),
});

export function validateEnv() {
  const isServer = typeof window === "undefined";

  let server = undefined;
  if (isServer) {
    const parsedServer = serverEnvSchema.safeParse(process.env);
    if (!parsedServer.success) {
      console.warn("Server environment warning:", parsedServer.error.format());
    } else {
      server = parsedServer.data;
    }
  }

  const parsedClient = clientEnvSchema.safeParse({
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
  });

  if (!parsedClient.success) {
    throw new Error(`Invalid client environment: ${JSON.stringify(parsedClient.error.format())}`);
  }

  return {
    isServer,
    client: parsedClient.data,
    server,
  };
}

export const env = validateEnv();

