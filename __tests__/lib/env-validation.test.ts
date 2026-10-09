import { checkEnvVars } from "@/lib/env-validation";

describe("lib/env-validation", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("returns errors when required environment variables are absent", () => {
    // Empty out critical env variables
    process.env = { NODE_ENV: "test" };

    const status = checkEnvVars();
    expect(status.valid).toBe(false);
    expect(status.errors.length).toBeGreaterThan(0);
  });

  it("identifies valid environment when all required variables are set", () => {
    process.env = {
      NODE_ENV: "test",
      NEXT_PUBLIC_APPWRITE_ENDPOINT: "https://nyc.cloud.appwrite.io/v1",
      NEXT_PUBLIC_APPWRITE_PROJECT: "proj_123",
      NEXT_APPWRITE_KEY: "appwrite_key",
      APPWRITE_DATABASE_ID: "db_123",
      APPWRITE_USER_COLLECTION_NAME: "users",
      APPWRITE_BANK_COLLECTION_NAME: "banks",
      APPWRITE_ITEM_COLLECTION_NAME: "items",
      APPWRITE_TRANSACTION_COLLECTION_NAME: "transactions",
      PLAID_CLIENT_ID: "plaid_id",
      PLAID_SECRET: "plaid_sec",
      PLAID_ENV: "sandbox",
      DWOLLA_KEY: "dwolla_k",
      DWOLLA_SECRET: "dwolla_s",
      DWOLLA_BASE_URL: "https://api-sandbox.dwolla.com",
      DWOLLA_ENV: "sandbox",
    };

    const status = checkEnvVars();
    expect(status.valid).toBe(true);
    expect(status.errors).toHaveLength(0);
  });
});
