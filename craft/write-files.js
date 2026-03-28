const fs = require('fs')
const path = require('path')
const src = path.join(__dirname, 'craft/packages/errors/src')

// ── http.ts ──────────────────────────────────────────────────────────────────
fs.writeFileSync(path.join(src, 'http.ts'), `import { ErrorCode, ErrorResponse } from "./types"

/** Maps each ErrorCode to its canonical HTTP status code. */
export const HTTP_STATUS: Record<ErrorCode, number> = {
  [ErrorCode.AUTH_UNAUTHORIZED]:         401,
  [ErrorCode.AUTH_FORBIDDEN]:            403,
  [ErrorCode.AUTH_TOKEN_EXPIRED]:        401,
  [ErrorCode.AUTH_TOKEN_INVALID]:        401,
  [ErrorCode.VALIDATION_FAILED]:         400,
  [ErrorCode.VALIDATION_MISSING_FIELD]:  400,
  [ErrorCode.VALIDATION_INVALID_FORMAT]: 400,
  [ErrorCode.NOT_FOUND_RESOURCE]:        404,
  [ErrorCode.CONFLICT_DUPLICATE]:        409,
  [ErrorCode.CONFLICT_STATE]:            409,
  [ErrorCode.RATE_LIMIT_EXCEEDED]:       429,
  [ErrorCode.SERVER_INTERNAL]:           500,
  [ErrorCode.SERVER_UNAVAILABLE]:        503,
  [ErrorCode.SERVER_TIMEOUT]:            503,
}

/**
 * Error subclass that carries a full ErrorResponse payload.
 * Throw this in service/controller code; catch at the boundary
 * and serialize .body as the JSON response.
 *
 * @example
 *   throw new HttpError(notFound("User"))
 *   // HTTP 404  { code: "NOT_FOUND_RESOURCE", ... }
 */
export class HttpError extends Error {
  readonly status: number
  readonly body: ErrorResponse

  constructor(response: ErrorResponse) {
    super(response.message)
    this.name = "HttpError"
    this.body = response
    this.status = HTTP_STATUS[response.code] ?? 500
    Object.setPrototypeOf(this, new.target.prototype)
  }
}
`)

// ── index.ts (update to include http exports) ────────────────────────────────
fs.writeFileSync(path.join(src, 'index.ts'), `export * from "./types"
export * from "./factory"
export * from "./http"
`)

// ── __tests__/http.test.ts ───────────────────────────────────────────────────
const tests = path.join(src, '__tests__')
fs.writeFileSync(path.join(tests, 'http.test.ts'), `import { describe, it, expect } from "vitest"
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
`)

console.log('All files written.')
