/**
 * Standardized error response types for all API endpoints.
 * Every API error response MUST conform to the ErrorResponse shape.
 */

export const ErrorCode = {
  AUTH_UNAUTHORIZED: "AUTH_UNAUTHORIZED",
  AUTH_FORBIDDEN: "AUTH_FORBIDDEN",
  AUTH_TOKEN_EXPIRED: "AUTH_TOKEN_EXPIRED",
  AUTH_TOKEN_INVALID: "AUTH_TOKEN_INVALID",
  VALIDATION_FAILED: "VALIDATION_FAILED",
  VALIDATION_MISSING_FIELD: "VALIDATION_MISSING_FIELD",
  VALIDATION_INVALID_FORMAT: "VALIDATION_INVALID_FORMAT",
  NOT_FOUND_RESOURCE: "NOT_FOUND_RESOURCE",
  CONFLICT_DUPLICATE: "CONFLICT_DUPLICATE",
  CONFLICT_STATE: "CONFLICT_STATE",
  RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED",
  SERVER_INTERNAL: "SERVER_INTERNAL",
  SERVER_UNAVAILABLE: "SERVER_UNAVAILABLE",
  SERVER_TIMEOUT: "SERVER_TIMEOUT",
} as const

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode]

export interface FieldError {
  field: string
  message: string
  rejectedValue?: unknown
}

export interface ErrorResponse {
  code: ErrorCode
  message: string
  details?: FieldError[] | Record<string, unknown>
  guidance?: string
  retryable: boolean
  timestamp: string
  requestId?: string
}
