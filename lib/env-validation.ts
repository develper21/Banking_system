import { z } from 'zod'

const envSchema = z.object({
  // Next.js
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),

  // Appwrite
  NEXT_PUBLIC_APPWRITE_ENDPOINT: z.string().url(),
  NEXT_PUBLIC_APPWRITE_PROJECT: z.string().min(1),
  NEXT_APPWRITE_KEY: z.string().min(1),
  APPWRITE_DATABASE_ID: z.string().min(1),
  APPWRITE_USER_COLLECTION_NAME: z.string().min(1),
  APPWRITE_BANK_COLLECTION_NAME: z.string().min(1),
  APPWRITE_ITEM_COLLECTION_NAME: z.string().min(1),
  APPWRITE_TRANSACTION_COLLECTION_NAME: z.string().min(1),

  // Plaid
  PLAID_CLIENT_ID: z.string().min(1),
  PLAID_SECRET: z.string().min(1),
  PLAID_ENV: z.enum(['sandbox', 'development', 'production']),
  PLAID_WEBHOOK_URL: z.string().url().optional(),
  PLAID_COUNTRY_CODES: z.string().optional(),

  // Dwolla
  DWOLLA_KEY: z.string().min(1),
  DWOLLA_SECRET: z.string().min(1),
  DWOLLA_BASE_URL: z.string().url(),
  DWOLLA_ENV: z.enum(['sandbox', 'production']),

  // Sentry
  SENTRY_AUTH_TOKEN: z.string().optional(),
  SENTRY_ORG: z.string().optional(),
  SENTRY_PROJECT: z.string().optional(),
})

type Env = z.infer<typeof envSchema>

let validatedEnv: Env

export function validateEnv(): Env {
  if (validatedEnv) {
    return validatedEnv
  }

  try {
    validatedEnv = envSchema.parse(process.env)
    return validatedEnv
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      throw new Error(`Environment validation failed:\n${missingVars.join('\n')}`)
    }
    throw error
  }
}

export function getEnv(): Env {
  if (!validatedEnv) {
    return validateEnv()
  }
  return validatedEnv
}

// Development helper to check if all required env vars are set
export function checkEnvVars(): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  try {
    validateEnv()
    return { valid: true, errors: [] }
  } catch (error: any) {
    return {
      valid: false,
      errors: error.message.split('\n').filter((line: string) => line.trim())
    }
  }
}
