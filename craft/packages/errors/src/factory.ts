import { ErrorCode, ErrorResponse, FieldError } from "./types"

interface BaseOptions {
  message?: string
  guidance?: string
  requestId?: string
  details?: Record<string, unknown>
}

function base(
  code: ErrorCode,
  retryable: boolean,
  defaults: { message: string; guidance?: string },
  opts: BaseOptions = {}
): ErrorResponse {
  return {
    code,
    message: opts.message ?? defaults.message,
    guidance: opts.guidance ?? defaults.guidance,
    details: opts.details,
    retryable,
    timestamp: new Date().toISOString(),
    requestId: opts.requestId,
  }
}

export function unauthorized(opts?: BaseOptions): ErrorResponse {
  return base(ErrorCode.AUTH_UNAUTHORIZED, false, {
    message: "Authentication is required to access this resource.",
    guidance: "Include a valid Bearer token in the Authorization header.",
  }, opts)
}

export function forbidden(opts?: BaseOptions): ErrorResponse {
  return base(ErrorCode.AUTH_FORBIDDEN, false, {
    message: "You do not have permission to perform this action.",
    guidance: "Contact your administrator if you believe this is a mistake.",
  }, opts)
}

export function tokenExpired(opts?: BaseOptions): ErrorResponse {
  return base(ErrorCode.AUTH_TOKEN_EXPIRED, false, {
    message: "Your session has expired.",
    guidance: "Re-authenticate to obtain a new token.",
  }, opts)
}

export function tokenInvalid(opts?: BaseOptions): ErrorResponse {
  return base(ErrorCode.AUTH_TOKEN_INVALID, false, {
    message: "The provided token is invalid.",
    guidance: "Ensure the token is correctly formatted and has not been tampered with.",
  }, opts)
}

export function validationFailed(
  fields: FieldError[],
  opts?: Omit<BaseOptions, "details">
): ErrorResponse {
  return {
    code: ErrorCode.VALIDATION_FAILED,
    message: opts?.message ?? "One or more fields failed validation.",
    guidance: opts?.guidance ?? "Review the details array and correct the indicated fields.",
    details: fields,
    retryable: false,
    timestamp: new Date().toISOString(),
    requestId: opts?.requestId,
  }
}

export function missingField(field: string, opts?: BaseOptions): ErrorResponse {
  return {
    code: ErrorCode.VALIDATION_MISSING_FIELD,
    message: opts?.message ?? `Required field '${field}' is missing.`,
    guidance: opts?.guidance ?? `Provide a value for '${field}'.`,
    details: [{ field, message: "This field is required." }] as FieldError[],
    retryable: false,
    timestamp: new Date().toISOString(),
    requestId: opts?.requestId,
  }
}

export function invalidFormat(field: string, expected: string, opts?: BaseOptions): ErrorResponse {
  return {
    code: ErrorCode.VALIDATION_INVALID_FORMAT,
    message: opts?.message ?? `Field '${field}' has an invalid format.`,
    guidance: opts?.guidance ?? `Expected format: ${expected}.`,
    details: [{ field, message: `Expected format: ${expected}.` }] as FieldError[],
    retryable: false,
    timestamp: new Date().toISOString(),
    requestId: opts?.requestId,
  }
}

export function notFound(resource: string, opts?: BaseOptions): ErrorResponse {
  return base(ErrorCode.NOT_FOUND_RESOURCE, false, {
    message: `${resource} not found.`,
    guidance: "Verify the identifier and try again.",
  }, opts)
}

export function duplicate(resource: string, opts?: BaseOptions): ErrorResponse {
  return base(ErrorCode.CONFLICT_DUPLICATE, false, {
    message: `A ${resource} with the provided identifier already exists.`,
    guidance: "Use a unique identifier or update the existing resource.",
  }, opts)
}

export function conflictState(opts?: BaseOptions): ErrorResponse {
  return base(ErrorCode.CONFLICT_STATE, false, {
    message: "The resource is in a state that does not allow this operation.",
    guidance: "Check the current state of the resource before retrying.",
  }, opts)
}

export function rateLimitExceeded(opts?: BaseOptions): ErrorResponse {
  return base(ErrorCode.RATE_LIMIT_EXCEEDED, true, {
    message: "Too many requests. Please slow down.",
    guidance: "Wait before retrying. Check the Retry-After response header.",
  }, opts)
}

export function internalError(opts?: BaseOptions): ErrorResponse {
  return base(ErrorCode.SERVER_INTERNAL, false, {
    message: "An unexpected error occurred.",
    guidance: "If the problem persists, contact support with your requestId.",
  }, opts)
}

export function serviceUnavailable(opts?: BaseOptions): ErrorResponse {
  return base(ErrorCode.SERVER_UNAVAILABLE, true, {
    message: "The service is temporarily unavailable.",
    guidance: "Retry after a short delay.",
  }, opts)
}

export function timeout(opts?: BaseOptions): ErrorResponse {
  return base(ErrorCode.SERVER_TIMEOUT, true, {
    message: "The request timed out.",
    guidance: "Retry the request. If the issue persists, contact support.",
  }, opts)
}
