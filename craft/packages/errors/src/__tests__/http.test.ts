import { describe, it, expect } from "vitest"
import { HttpError, HTTP_STATUS } from "../http"
import { ErrorCode } from "../types"
import { notFound, unauthorized, rateLimitExceeded, internalError } from "../factory"

describe("HTTP_STATUS map", () => {
  it("covers every ErrorCode", () => {
    for (const code of Object.values(ErrorCode)) {
      expect(HTTP_STATUS[code]).toBeTypeOf("number")
    }
  })

  it("maps auth codes to 401/403", () => {
    expect(HTTP_STATUS[ErrorCode.AUTH_UNAUTHORIZED]).toBe(401)
    expect(HTTP_STATUS[ErrorCode.AUTH_FORBIDDEN]).toBe(403)
    expect(HTTP_STATUS[ErrorCode.AUTH_TOKEN_EXPIRED]).toBe(401)
  })

  it("maps validation codes to 400", () => {
    expect(HTTP_STATUS[ErrorCode.VALIDATION_FAILED]).toBe(400)
    expect(HTTP_STATUS[ErrorCode.VALIDATION_MISSING_FIELD]).toBe(400)
    expect(HTTP_STATUS[ErrorCode.VALIDATION_INVALID_FORMAT]).toBe(400)
  })

  it("maps server codes correctly", () => {
    expect(HTTP_STATUS[ErrorCode.SERVER_INTERNAL]).toBe(500)
    expect(HTTP_STATUS[ErrorCode.SERVER_UNAVAILABLE]).toBe(503)
    expect(HTTP_STATUS[ErrorCode.SERVER_TIMEOUT]).toBe(503)
  })
})

describe("HttpError", () => {
  it("sets status from HTTP_STATUS map", () => {
    const err = new HttpError(notFound("Order"))
    expect(err.status).toBe(404)
  })

  it("sets body to the full ErrorResponse", () => {
    const response = unauthorized()
    const err = new HttpError(response)
    expect(err.body).toBe(response)
    expect(err.body.code).toBe(ErrorCode.AUTH_UNAUTHORIZED)
  })

  it("is an instance of Error", () => {
    expect(new HttpError(internalError())).toBeInstanceOf(Error)
  })

  it("sets message from ErrorResponse.message", () => {
    const err = new HttpError(rateLimitExceeded())
    expect(err.message).toBe("Too many requests. Please slow down.")
  })

  it("name is HttpError", () => {
    expect(new HttpError(internalError()).name).toBe("HttpError")
  })
})
