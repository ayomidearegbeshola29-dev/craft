import { describe, it, expect } from "vitest"
import { toErrorResponse } from "../utils"
import { HttpError } from "../http"
import { notFound, internalError } from "../factory"
import { ErrorCode } from "../types"

describe("toErrorResponse", () => {
  it("passes through HttpError body", () => {
    const r = notFound("User")
    const result = toErrorResponse(new HttpError(r))
    expect(result.code).toBe(ErrorCode.NOT_FOUND_RESOURCE)
  })
  it("wraps plain Error as SERVER_INTERNAL", () => {
    const result = toErrorResponse(new Error("db timeout"))
    expect(result.code).toBe(ErrorCode.SERVER_INTERNAL)
    expect(result.message).toBe("db timeout")
  })
  it("wraps unknown values as SERVER_INTERNAL", () => {
    expect(toErrorResponse(null).code).toBe(ErrorCode.SERVER_INTERNAL)
    expect(toErrorResponse(42).code).toBe(ErrorCode.SERVER_INTERNAL)
    expect(toErrorResponse("oops").code).toBe(ErrorCode.SERVER_INTERNAL)
  })
  it("attaches requestId when provided", () => {
    const result = toErrorResponse(new Error("fail"), "req-999")
    expect(result.requestId).toBe("req-999")
  })
  it("preserves retryable from HttpError body", () => {
    const r = internalError()
    expect(toErrorResponse(new HttpError(r)).retryable).toBe(false)
  })
})