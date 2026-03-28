import { describe, it, expect } from "vitest"
import { HttpError, HTTP_STATUS } from "../http"
import { ErrorCode } from "../types"
import { notFound, unauthorized, rateLimitExceeded, internalError } from "../factory"

describe("HTTP_STATUS map", () => {
  it("covers every ErrorCode", () => {
    for (const code of Object.values(ErrorCode)) {
      expect(HTTP_STATUS[code as keyof typeof HTTP_STATUS]).toBeTypeOf("number")
    }
  })
  it("maps auth codes correctly", () => {
    expect(HTTP_STATUS[ErrorCode.AUTH_UNAUTHORIZED]).toBe(401)
    expect(HTTP_STATUS[ErrorCode.AUTH_FORBIDDEN]).toBe(403)
  })
  it("maps server codes correctly", () => {
    expect(HTTP_STATUS[ErrorCode.SERVER_INTERNAL]).toBe(500)
    expect(HTTP_STATUS[ErrorCode.SERVER_UNAVAILABLE]).toBe(503)
  })
})

describe("HttpError", () => {
  it("sets status from HTTP_STATUS", () => {
    expect(new HttpError(notFound("Order")).status).toBe(404)
  })
  it("sets body to the ErrorResponse", () => {
    const r = unauthorized()
    const e = new HttpError(r)
    expect(e.body).toBe(r)
    expect(e.body.code).toBe(ErrorCode.AUTH_UNAUTHORIZED)
  })
  it("is instanceof Error", () => {
    expect(new HttpError(internalError())).toBeInstanceOf(Error)
  })
  it("retryable errors get correct status", () => {
    expect(new HttpError(rateLimitExceeded()).status).toBe(429)
  })
  it("name is HttpError", () => {
    expect(new HttpError(internalError()).name).toBe("HttpError")
  })
})
