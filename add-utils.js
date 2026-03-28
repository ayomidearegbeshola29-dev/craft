const fs=require('fs')
const base='C:/Users/user/Desktop/DRIPS/craft/craft/packages/errors'
const src=base+'/src'
const utils=[
  'import { ErrorResponse, ErrorCode } from "./types"',
  'import { internalError } from "./factory"',
  'import { HttpError } from "./http"',
  '',
  '/**',
  ' * Normalizes any unknown caught value into an ErrorResponse.',
  ' * Use this at error boundaries to guarantee a consistent response shape.',
  ' *',
  ' * @example',
  ' *   try { ... } catch (err) {',
  ' *     return res.status(status).json(toErrorResponse(err))',
  ' *   }',
  ' */',
  'export function toErrorResponse(err: unknown, requestId?: string): ErrorResponse {',
  '  if (err instanceof HttpError) return { ...err.body, requestId: requestId ?? err.body.requestId }',
  '  if (err instanceof Error) {',
  '    return { ...internalError({ message: err.message, requestId }), code: ErrorCode.SERVER_INTERNAL }',
  '  }',
  '  return internalError({ requestId })',
  '}',
].join('\n')
fs.writeFileSync(src+'/utils.ts', utils, 'utf8')
const idx=[
  'export * from "./types"',
  'export * from "./factory"',
  'export * from "./http"',
  'export * from "./utils"',
].join('\n')
fs.writeFileSync(src+'/index.ts', idx, 'utf8')
const tests=[
  'import { describe, it, expect } from "vitest"',
  'import { toErrorResponse } from "../utils"',
  'import { HttpError } from "../http"',
  'import { notFound, internalError } from "../factory"',
  'import { ErrorCode } from "../types"',
  '',
  'describe("toErrorResponse", () => {',
  '  it("passes through HttpError body", () => {',
  '    const r = notFound("User")',
  '    const result = toErrorResponse(new HttpError(r))',
  '    expect(result.code).toBe(ErrorCode.NOT_FOUND_RESOURCE)',
  '  })',
  '  it("wraps plain Error as SERVER_INTERNAL", () => {',
  '    const result = toErrorResponse(new Error("db timeout"))',
  '    expect(result.code).toBe(ErrorCode.SERVER_INTERNAL)',
  '    expect(result.message).toBe("db timeout")',
  '  })',
  '  it("wraps unknown values as SERVER_INTERNAL", () => {',
  '    expect(toErrorResponse(null).code).toBe(ErrorCode.SERVER_INTERNAL)',
  '    expect(toErrorResponse(42).code).toBe(ErrorCode.SERVER_INTERNAL)',
  '    expect(toErrorResponse("oops").code).toBe(ErrorCode.SERVER_INTERNAL)',
  '  })',
  '  it("attaches requestId when provided", () => {',
  '    const result = toErrorResponse(new Error("fail"), "req-999")',
  '    expect(result.requestId).toBe("req-999")',
  '  })',
  '  it("preserves retryable from HttpError body", () => {',
  '    const r = internalError()',
  '    expect(toErrorResponse(new HttpError(r)).retryable).toBe(false)',
  '  })',
  '})',
].join('\n')
fs.writeFileSync(src+'/__tests__/utils.test.ts', tests, 'utf8')
console.log('done')
