import {ErrorCode,ErrorResponse} from "./types"

export const HTTP_STATUS={
  [ErrorCode.AUTH_UNAUTHORIZED]:401,
  [ErrorCode.AUTH_FORBIDDEN]:403,
  [ErrorCode.AUTH_TOKEN_EXPIRED]:401,
  [ErrorCode.AUTH_TOKEN_INVALID]:401,
  [ErrorCode.VALIDATION_FAILED]:400,
  [ErrorCode.VALIDATION_MISSING_FIELD]:400,
  [ErrorCode.VALIDATION_INVALID_FORMAT]:400,
  [ErrorCode.NOT_FOUND_RESOURCE]:404,
  [ErrorCode.CONFLICT_DUPLICATE]:409,
  [ErrorCode.CONFLICT_STATE]:409,
  [ErrorCode.RATE_LIMIT_EXCEEDED]:429,
  [ErrorCode.SERVER_INTERNAL]:500,
  [ErrorCode.SERVER_UNAVAILABLE]:503,
  [ErrorCode.SERVER_TIMEOUT]:503,
} as const
export class HttpError extends Error {
  readonly status: number
  readonly body: ErrorResponse
  constructor(response: ErrorResponse) {
    super(response.message)
    this.name = 'HttpError'
    this.body = response
    this.status = HTTP_STATUS[response.code] ?? 500
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

/** Type guard — narrows an unknown caught value to HttpError. */
export function isHttpError(err: unknown): err is HttpError {
  return err instanceof HttpError
}
