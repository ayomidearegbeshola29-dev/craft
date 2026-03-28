import { describe, it, expect } from "vitest"
import { unauthorized, forbidden, notFound, validationFailed, internalError, rateLimitExceeded } from "../factory"
import { ErrorCode } from "../types"

describe("Error Factory", () => {
  describe("unauthorized", () => {
    it("creates unauthorized error", () => {
      const error = unauthorized()
      expect(error.code).toBe(ErrorCode.AUTH_UNAUTHORIZED)
      expect(error.message).toBe("Unauthorized access")
      expect(error.context?.correlationId).toBeTruthy()
    })

    it("includes custom context", () => {
      const error = unauthorized({ userId: "user123" })
      expect(error.context?.userId).toBe("user123")
    })
  })

  describe("forbidden", () => {
    it("creates forbidden error", () => {
      const error = forbidden()
      expect(error.code).toBe(ErrorCode.AUTH_FORBIDDEN)
      expect(error.message).toBe("Access forbidden")
    })
  })

  describe("notFound", () => {
    it("creates not found error with resource name", () => {
      const error = notFound("User")
      expect(error.code).toBe(ErrorCode.NOT_FOUND_RESOURCE)
      expect(error.message).toBe("User not found")
    })
  })

  describe("validationFailed", () => {
    it("creates validation error with custom message", () => {
      const error = validationFailed("Email is required")
      expect(error.code).toBe(ErrorCode.VALIDATION_FAILED)
      expect(error.message).toBe("Email is required")
    })
  })

  describe("internalError", () => {
    it("creates internal server error", () => {
      const error = internalError()
      expect(error.code).toBe(ErrorCode.SERVER_INTERNAL)
      expect(error.message).toBe("Internal server error")
    })
  })

  describe("rateLimitExceeded", () => {
    it("creates rate limit error", () => {
      const error = rateLimitExceeded()
      expect(error.code).toBe(ErrorCode.RATE_LIMIT_EXCEEDED)
      expect(error.message).toBe("Too many requests. Please slow down.")
    })
  })

  describe("context handling", () => {
    it("generates correlation ID if not provided", () => {
      const error = unauthorized()
      expect(error.context?.correlationId).toBeTruthy()
      expect(error.context?.correlationId.length).toBeGreaterThan(20)
    })

    it("uses provided correlation ID", () => {
      const correlationId = "custom-correlation-id"
      const error = unauthorized({ correlationId })
      expect(error.context?.correlationId).toBe(correlationId)
    })

    it("includes timestamp", () => {
      const error = unauthorized()
      expect(error.context?.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/)
    })

    it("merges additional context fields", () => {
      const error = unauthorized({
        userId: "user123",
        requestPath: "/api/protected",
        requestMethod: "POST",
      })
      expect(error.context?.userId).toBe("user123")
      expect(error.context?.requestPath).toBe("/api/protected")
      expect(error.context?.requestMethod).toBe("POST")
    })
  })
})
