import {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  DatabaseError,
  ExternalServiceError,
  handleApiError,
  createErrorResponse,
} from "@/lib/error-handler";

describe("lib/error-handler", () => {
  describe("Custom Error Classes", () => {
    it("creates an AppError with default status 500", () => {
      const error = new AppError("Internal error");
      expect(error.message).toBe("Internal error");
      expect(error.statusCode).toBe(500);
      expect(error.isOperational).toBe(true);
    });

    it("creates a ValidationError with status 400", () => {
      const error = new ValidationError("Invalid field");
      expect(error.message).toBe("Invalid field");
      expect(error.statusCode).toBe(400);
      expect(error.code).toBe("VALIDATION_ERROR");
      expect(error.name).toBe("ValidationError");
    });

    it("creates an AuthenticationError with status 401", () => {
      const error = new AuthenticationError();
      expect(error.message).toBe("Authentication failed");
      expect(error.statusCode).toBe(401);
      expect(error.code).toBe("AUTHENTICATION_ERROR");
    });

    it("creates an AuthorizationError with status 403", () => {
      const error = new AuthorizationError();
      expect(error.message).toBe("Access denied");
      expect(error.statusCode).toBe(403);
      expect(error.code).toBe("AUTHORIZATION_ERROR");
    });

    it("creates a NotFoundError with status 404", () => {
      const error = new NotFoundError("Account not found");
      expect(error.message).toBe("Account not found");
      expect(error.statusCode).toBe(404);
      expect(error.code).toBe("NOT_FOUND_ERROR");
    });

    it("creates a DatabaseError with status 500", () => {
      const error = new DatabaseError();
      expect(error.message).toBe("Database operation failed");
      expect(error.statusCode).toBe(500);
      expect(error.code).toBe("DATABASE_ERROR");
    });

    it("creates an ExternalServiceError with status 502", () => {
      const error = new ExternalServiceError("Plaid", "Token exchange failed");
      expect(error.message).toBe("Plaid: Token exchange failed");
      expect(error.statusCode).toBe(502);
      expect(error.code).toBe("EXTERNAL_SERVICE_ERROR");
    });
  });

  describe("handleApiError", () => {
    it("returns formatted error details for AppError", () => {
      const error = new ValidationError("Missing email");
      const result = handleApiError(error);

      expect(result).toEqual({
        statusCode: 400,
        message: "Missing email",
        code: "VALIDATION_ERROR",
      });
    });

    it("returns 500 INTERNAL_ERROR for generic Error instance", () => {
      const spy = jest.spyOn(console, "error").mockImplementation(() => {});
      const error = new Error("Uncaught runtime exception");
      const result = handleApiError(error);

      expect(result).toEqual({
        statusCode: 500,
        message: "Internal server error",
        code: "INTERNAL_ERROR",
      });
      spy.mockRestore();
    });

    it("returns 500 UNKNOWN_ERROR for non-Error object", () => {
      const spy = jest.spyOn(console, "error").mockImplementation(() => {});
      const result = handleApiError("string error");

      expect(result).toEqual({
        statusCode: 500,
        message: "Internal server error",
        code: "UNKNOWN_ERROR",
      });
      spy.mockRestore();
    });
  });

  describe("createErrorResponse", () => {
    it("creates standard failure response format", () => {
      const error = new NotFoundError("Transaction not found");
      const response = createErrorResponse(error);

      expect(response).toEqual({
        success: false,
        error: {
          statusCode: 404,
          message: "Transaction not found",
          code: "NOT_FOUND_ERROR",
        },
      });
    });
  });
});
