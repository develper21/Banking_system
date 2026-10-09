import {
  cn,
  formatAmount,
  formatDateTime,
  parseStringify,
  removeSpecialCharacters,
  formUrlQuery,
  getAccountTypeColors,
  countTransactionCategories,
  extractCustomerIdFromUrl,
  encryptId,
  decryptId,
  getTransactionStatus,
  authFormSchema,
} from "@/lib/utils";

describe("lib/utils", () => {
  describe("cn", () => {
    it("merges class names correctly", () => {
      expect(cn("bg-red-500", "text-white")).toBe("bg-red-500 text-white");
    });

    it("handles conditional classes and resolves conflicts with tailwind-merge", () => {
      const condition = false;
      expect(cn("p-4", condition && "p-2", "p-8")).toBe("p-8");
    });
  });

  describe("formatAmount", () => {
    it("formats positive numbers as USD currency", () => {
      expect(formatAmount(1234.56)).toBe("$1,234.56");
    });

    it("formats 0 as $0.00", () => {
      expect(formatAmount(0)).toBe("$0.00");
    });

    it("formats negative numbers correctly", () => {
      expect(formatAmount(-50)).toBe("-$50.00");
    });
  });

  describe("formatDateTime", () => {
    it("formats a date into expected string representations", () => {
      const date = new Date("2025-01-15T10:30:00Z");
      const result = formatDateTime(date);

      expect(result).toHaveProperty("dateTime");
      expect(result).toHaveProperty("dateDay");
      expect(result).toHaveProperty("dateOnly");
      expect(result).toHaveProperty("timeOnly");
      expect(typeof result.dateTime).toBe("string");
    });
  });

  describe("parseStringify", () => {
    it("serializes and deserializes values to create a deep copy", () => {
      const original = { id: "123", user: { name: "John" } };
      const parsed = parseStringify(original);

      expect(parsed).toEqual(original);
      expect(parsed).not.toBe(original);
    });
  });

  describe("removeSpecialCharacters", () => {
    it("removes special characters and keeps alphanumeric and spaces", () => {
      expect(removeSpecialCharacters("Uber *#$ Ride!!")).toBe("Uber  Ride");
      expect(removeSpecialCharacters("Coffee & Tea @ 10:00")).toBe("Coffee  Tea  1000");
    });
  });

  describe("formUrlQuery", () => {
    beforeEach(() => {
      window.history.pushState({}, "", "/dashboard");
    });

    it("appends and updates query parameters to the current URL pathname", () => {
      const result = formUrlQuery({
        params: "page=1&sort=asc",
        key: "page",
        value: "2",
      });

      expect(result).toBe("/dashboard?page=2&sort=asc");
    });
  });

  describe("getAccountTypeColors", () => {
    it("returns correct color styles for depository accounts", () => {
      const colors = getAccountTypeColors("depository");
      expect(colors.bg).toBe("bg-blue-25");
      expect(colors.title).toBe("text-blue-900");
    });

    it("returns correct color styles for credit accounts", () => {
      const colors = getAccountTypeColors("credit");
      expect(colors.bg).toBe("bg-success-25");
      expect(colors.title).toBe("text-success-900");
    });

    it("returns default color styles for unknown account types", () => {
      const colors = getAccountTypeColors("other" as any);
      expect(colors.bg).toBe("bg-green-25");
      expect(colors.title).toBe("text-green-900");
    });
  });

  describe("countTransactionCategories", () => {
    it("aggregates category counts and orders them in descending order", () => {
      const transactions = [
        { category: "Food" },
        { category: "Travel" },
        { category: "Food" },
        { category: "Food" },
        { category: "Travel" },
        { category: "Utilities" },
      ] as any[];

      const result = countTransactionCategories(transactions);

      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({ name: "Food", count: 3, totalCount: 6 });
      expect(result[1]).toEqual({ name: "Travel", count: 2, totalCount: 6 });
      expect(result[2]).toEqual({ name: "Utilities", count: 1, totalCount: 6 });
    });
  });

  describe("extractCustomerIdFromUrl", () => {
    it("extracts customer ID from the end of a URL path", () => {
      const url = "https://api-sandbox.dwolla.com/customers/cust_123456789";
      expect(extractCustomerIdFromUrl(url)).toBe("cust_123456789");
    });
  });

  describe("encryptId and decryptId", () => {
    it("encrypts and decrypts string identifiers accurately", () => {
      const originalId = "bank_account_uuid_9988";
      const encrypted = encryptId(originalId);

      expect(encrypted).not.toBe(originalId);
      expect(decryptId(encrypted)).toBe(originalId);
    });
  });

  describe("getTransactionStatus", () => {
    it("returns 'Processing' for transactions within the last two days", () => {
      const today = new Date();
      expect(getTransactionStatus(today)).toBe("Processing");
    });

    it("returns 'Success' for transactions older than two days", () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 10);
      expect(getTransactionStatus(pastDate)).toBe("Success");
    });
  });

  describe("authFormSchema", () => {
    it("validates sign-in credentials without requiring personal info", () => {
      const schema = authFormSchema("sign-in");
      const validSignIn = {
        email: "test@example.com",
        password: "securePassword123",
      };

      const result = schema.safeParse(validSignIn);
      expect(result.success).toBe(true);
    });

    it("fails sign-in credentials when password is too short", () => {
      const schema = authFormSchema("sign-in");
      const invalidSignIn = {
        email: "test@example.com",
        password: "short",
      };

      const result = schema.safeParse(invalidSignIn);
      expect(result.success).toBe(false);
    });

    it("requires additional fields for sign-up", () => {
      const schema = authFormSchema("sign-up");
      const incompleteSignUp = {
        email: "test@example.com",
        password: "securePassword123",
      };

      const result = schema.safeParse(incompleteSignUp);
      expect(result.success).toBe(false);
    });

    it("validates a complete and valid sign-up payload", () => {
      const schema = authFormSchema("sign-up");
      const validSignUp = {
        firstName: "John",
        lastName: "Doe",
        address1: "123 Main St",
        city: "New York",
        state: "NY",
        postalCode: "10001",
        dateOfBirth: "1990-01-01",
        ssn: "1234",
        email: "john.doe@example.com",
        password: "securePassword123",
      };

      const result = schema.safeParse(validSignUp);
      expect(result.success).toBe(true);
    });
  });
});
