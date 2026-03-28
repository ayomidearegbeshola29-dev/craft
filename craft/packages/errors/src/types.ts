export enum ErrorCode {
  AUTH_UNAUTHORIZED = "AUTH_UNAUTHORIZED",
  AUTH_FORBIDDEN = "AUTH_FORBIDDEN",
  AUTH_TOKEN_EXPIRED = "AUTH_TOKEN_EXPIRED",
  AUTH_TOKEN_INVALID = "AUTH_TOKEN_INVALID",
  VALIDATION_FAILED = "VALIDATION_FAILED",
  VALIDATION_MISSING_FIELD = "VALIDATION_MISSING_FIELD",
  VALIDATION_INVALID_FORMAT = "VALIDATION_INVALID_FORMAT",
  NOT_FOUND_RESOURCE = "NOT_FOUND_RESOURCE",
  CONFLICT_DUPLICATE = "CONFLICT_DUPLICATE",
  CONFLICT_STATE = "CONFLICT_STATE",
  RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED",
  SERVER_INTERNAL = "SERVER_INTERNAL",
  SERVER_UNAVAILABLE = "SERVER_UNAVAILABLE",
  SERVER_TIMEOUT = "SERVER_TIMEOUT",
}

export interface ErrorContext {
  correlationId: string
  userId?: string
  requestPath?: string
  requestMethod?: string
  statusCode?: number
  timestamp?: string
  service?: string
  [key: string]: unknown
}

export interface ErrorResponse {
  code: ErrorCode
  message: string
  context?: ErrorContext
  stack?: string
}
