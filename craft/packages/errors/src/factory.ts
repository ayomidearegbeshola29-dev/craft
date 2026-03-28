import { ErrorCode, ErrorResponse, ErrorContext } from "./types"
import { generateCorrelationId } from "./correlation"

function createError(
  code: ErrorCode,
  message: string,
  context?: Partial<ErrorContext>
): ErrorResponse {
  return {
    code,
    message,
    context: {
      correlationId: context?.correlationId || generateCorrelationId(),
      timestamp: new Date().toISOString(),
      ...context,
    },
  }
}

export function unauthorized(context?: Partial<ErrorContext>): ErrorResponse {
  return createError(ErrorCode.AUTH_UNAUTHORIZED, "Unauthorized access", context)
}

export function forbidden(context?: Partial<ErrorContext>): ErrorResponse {
  return createError(ErrorCode.AUTH_FORBIDDEN, "Access forbidden", context)
}

export function notFound(resource: string, context?: Partial<ErrorContext>): ErrorResponse {
  return createError(ErrorCode.NOT_FOUND_RESOURCE, `${resource} not found`, context)
}

export function validationFailed(message: string, context?: Partial<ErrorContext>): ErrorResponse {
  return createError(ErrorCode.VALIDATION_FAILED, message, context)
}

export function internalError(context?: Partial<ErrorContext>): ErrorResponse {
  return createError(ErrorCode.SERVER_INTERNAL, "Internal server error", context)
}

export function rateLimitExceeded(context?: Partial<ErrorContext>): ErrorResponse {
  return createError(ErrorCode.RATE_LIMIT_EXCEEDED, "Too many requests. Please slow down.", context)
}
