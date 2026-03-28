import { describe, it, expect } from "vitest";
import {
  unauthorized,
  forbidden,
  tokenExpired,
  tokenInvalid,
  validationFailed,
  missingField,
  invalidFormat,
  notFound,
  duplicate,
  conflictState,
  rateLimitExceeded,
  internalError,
  serviceUnavailable,
  timeout,
} from "../factory";
import { ErrorCode } from "../types";

// Helper: assert the shape every ErrorResponse must have
function assertBaseShape(err: ReturnType<typeof unauthorized>) {
  expect(err).toHaveProperty("code");
  expect(err).toHaveProperty("message");
  expect(err).toHaveProperty("retryable");
  expect(err).toHaveProperty("timestamp");
  expect(new Date(err.timestamp).toISOString()).toBe(err.timestamp);
}

describe("Auth error factories", () => {
  it("unauthorized returns correct code and is not retryable", () => {
    const err = unauthorized();
    assertBaseShape(err);
    expect(err.code).toBe(ErrorCode.AUTH_UNAUTHORIZED);
    expect(err.retryable).toBe(false);
  });

  it("forbidden returns correct code", () => {
    const err = forbidden();
    expect(err.code).toBe(ErrorCode.AUTH_FORBIDDEN);
    expect(err.retryable).toBe(false);
  });

  it("tokenExpired returns correct code", () => {
    expect(tokenExpired().code).toBe(ErrorCode.AUTH_TOKEN_EXPIRED);
  });

  it("tokenInvalid returns correct code", () => {
    expect(tokenInvalid().code).toBe(ErrorCode.AUTH_TOKEN_INVALID);
  });

  it("accepts custom message and requestId overrides", () => {
    const err = unauthorized({ message: "Custom msg", requestId: "req-123" });
    expect(err.message).toBe("Custom msg");
    expect(err.requestId).toBe("req-123");
  });
});

describe("Validation error factories", () => {
  it("validationFailed includes field errors in details", () => {
    const fields = [{ field: "email", message: "Invalid email." }];
    const err = validationFailed(fields);
    assertBaseShape(err);
    expect(err.code).toBe(ErrorCode.VALIDATION_FAILED);
    expect(err.retryable).toBe(false);
    expect(err.details).toEqual(fields);
  });

  it("missingField sets field name in details", () => {
    const err = missingField("username");
    expect(err.code).toBe(ErrorCode.VALIDATION_MISSING_FIELD);
    expect(Array.isArray(err.details)).toBe(true);
    const details = err.details as Array<{ field: string }>;
    expect(details[0].field).toBe("username");
  });

  it("invalidFormat includes expected format in guidance", () => {
    const err = invalidFormat("dob", "YYYY-MM-DD");
    expect(err.code).toBe(ErrorCode.VALIDATION_INVALID_FORMAT);
    expect(err.guidance).toContain("YYYY-MM-DD");
  });
});

describe("Not found / conflict factories", () => {
  it("notFound includes resource name in message", () => {
    const err = notFound("User");
    expect(err.code).toBe(ErrorCode.NOT_FOUND_RESOURCE);
    expect(err.message).toContain("User");
    expect(err.retryable).toBe(false);
  });

  it("duplicate includes resource name in message", () => {
    const err = duplicate("email");
    expect(err.code).toBe(ErrorCode.CONFLICT_DUPLICATE);
    expect(err.message).toContain("email");
  });

  it("conflictState returns correct code", () => {
    expect(conflictState().code).toBe(ErrorCode.CONFLICT_STATE);
  });
});

describe("Rate limit and server error factories", () => {
  it("rateLimitExceeded is retryable", () => {
    const err = rateLimitExceeded();
    expect(err.code).toBe(ErrorCode.RATE_LIMIT_EXCEEDED);
    expect(err.retryable).toBe(true);
  });

  it("internalError is not retryable", () => {
    const err = internalError();
    expect(err.code).toBe(ErrorCode.SERVER_INTERNAL);
    expect(err.retryable).toBe(false);
  });

  it("serviceUnavailable is retryable", () => {
    const err = serviceUnavailable();
    expect(err.code).toBe(ErrorCode.SERVER_UNAVAILABLE);
    expect(err.retryable).toBe(true);
  });

  it("timeout is retryable", () => {
    const err = timeout();
    expect(err.code).toBe(ErrorCode.SERVER_TIMEOUT);
    expect(err.retryable).toBe(true);
  });
});
