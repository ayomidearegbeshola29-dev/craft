import { ErrorResponse, ErrorCode } from "./types"
import { internalError } from "./factory"
import { HttpError } from "./http"

/**
 * Normalizes any unknown caught value into an ErrorResponse.
 * Use this at error boundaries to guarantee a consistent response shape.
 *
 * @example
 *   try { ... } catch (err) {
 *     return res.status(status).json(toErrorResponse(err))
 *   }
 */
export function toErrorResponse(err: unknown, requestId?: string): ErrorResponse {
  if (err instanceof HttpError) return { ...err.body, requestId: requestId ?? err.body.requestId }
  if (err instanceof Error) {
    return { ...internalError({ message: err.message, requestId }), code: ErrorCode.SERVER_INTERNAL }
  }
  return internalError({ requestId })
}