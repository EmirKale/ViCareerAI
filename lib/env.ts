import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(10),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(10).optional(),
  OPENAI_API_KEY: z.string().min(10).optional(),
  RAPIDAPI_KEY: z.string().min(10).optional(),
  LEMONSQUEEZY_API_KEY: z.string().min(10).optional(),
  LEMONSQUEEZY_STORE_ID: z.string().min(1).optional(),
  LEMONSQUEEZY_WEBHOOK_SECRET: z.string().min(10).optional(),
  NEXT_PUBLIC_LEMONSQUEEZY_PRO_MONTHLY_VARIANT_ID: z.string().min(1).optional(),
});

const parseResult = envSchema.safeParse(process.env);

if (!parseResult.success) {
  console.error("❌ Invalid environment variables on startup:", JSON.stringify(parseResult.error.format(), null, 2));
}

export const env = parseResult.success ? parseResult.data : null;
