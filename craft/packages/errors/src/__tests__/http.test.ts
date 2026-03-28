import { describe, it, expect } from "vitest"
import { HttpError, HTTP_STATUS, isHttpError } from "../http"
import { ErrorCode } from "../types"
import { notFound, unauthorized, rateLimitExceeded, internalError } from "../factory"

describe("HTTP_STATUS map", () => {
  it("covers every ErrorCode", () => {
    for (const code of Object.values(ErrorCode)) {
      expect(HTTP_STATUS[code]).toBeTypeOf("number")
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

describe("isHttpError", () => {
  it("returns true for HttpError", () => {
    expect(isHttpError(new HttpError(internalError()))).toBe(true)
  })
  it("returns false for plain Error", () => {
    expect(isHttpError(new Error("oops"))).toBe(false)
  })
  it("returns false for non-errors", () => {
    expect(isHttpError(null)).toBe(false)
    expect(isHttpError(42)).toBe(false)
  })
})