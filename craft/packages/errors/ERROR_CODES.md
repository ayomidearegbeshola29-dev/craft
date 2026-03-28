# Error Codes Reference

All API errors return an `ErrorResponse` body. This document lists every `ErrorCode`, its HTTP status, `retryable` flag, and when to use it.

## Shape

```ts
interface ErrorResponse {
  code: ErrorCode;       // machine-readable identifier
  message: string;       // human-readable summary (safe for UI)
  details?: FieldError[] | Record<string, unknown>;
  guidance?: string;     // how the caller can resolve the error
  retryable: boolean;    // true → caller may retry the same request
  timestamp: string;     // ISO-8601
  requestId?: string;    // correlation ID for tracing
}
```

---

## Auth

| Code | HTTP | Retryable | When to use |
|---|---|---|---|
| `AUTH_UNAUTHORIZED` | 401 | false | No credentials provided |
| `AUTH_FORBIDDEN` | 403 | false | Credentials valid but insufficient permissions |
| `AUTH_TOKEN_EXPIRED` | 401 | false | JWT / session token has expired |
| `AUTH_TOKEN_INVALID` | 401 | false | Token is malformed or tampered |

## Validation

| Code | HTTP | Retryable | When to use |
|---|---|---|---|
| `VALIDATION_FAILED` | 400 | false | One or more fields failed validation; `details` is `FieldError[]` |
| `VALIDATION_MISSING_FIELD` | 400 | false | A required field was absent |
| `VALIDATION_INVALID_FORMAT` | 400 | false | A field value does not match the expected format |

## Not Found

| Code | HTTP | Retryable | When to use |
|---|---|---|---|
| `NOT_FOUND_RESOURCE` | 404 | false | The requested resource does not exist |

## Conflict

| Code | HTTP | Retryable | When to use |
|---|---|---|---|
| `CONFLICT_DUPLICATE` | 409 | false | A resource with the same unique key already exists |
| `CONFLICT_STATE` | 409 | false | The resource's current state disallows the operation |

## Rate Limiting

| Code | HTTP | Retryable | When to use |
|---|---|---|---|
| `RATE_LIMIT_EXCEEDED` | 429 | true | Caller has exceeded the allowed request rate; set `Retry-After` header |

## Server

| Code | HTTP | Retryable | When to use |
|---|---|---|---|
| `SERVER_INTERNAL` | 500 | false | Unexpected server error; include `requestId` in response |
| `SERVER_UNAVAILABLE` | 503 | true | Service is temporarily down |
| `SERVER_TIMEOUT` | 503 | true | Upstream or internal timeout |

---

## Example responses

### 400 Validation failure

```json
{
  "code": "VALIDATION_FAILED",
  "message": "One or more fields failed validation.",
  "guidance": "Review the `details` array and correct the indicated fields.",
  "details": [
    { "field": "email", "message": "Must be a valid email address." },
    { "field": "dob", "message": "Expected format: YYYY-MM-DD.", "rejectedValue": "31-12-1990" }
  ],
  "retryable": false,
  "timestamp": "2026-03-28T10:00:00.000Z",
  "requestId": "req_abc123"
}
```

### 401 Token expired

```json
{
  "code": "AUTH_TOKEN_EXPIRED",
  "message": "Your session has expired.",
  "guidance": "Re-authenticate to obtain a new token.",
  "retryable": false,
  "timestamp": "2026-03-28T10:00:00.000Z",
  "requestId": "req_abc124"
}
```

### 429 Rate limit

```json
{
  "code": "RATE_LIMIT_EXCEEDED",
  "message": "Too many requests. Please slow down.",
  "guidance": "Wait before retrying. Check the Retry-After response header.",
  "retryable": true,
  "timestamp": "2026-03-28T10:00:00.000Z",
  "requestId": "req_abc125"
}
```

### 500 Internal error

```json
{
  "code": "SERVER_INTERNAL",
  "message": "An unexpected error occurred.",
  "guidance": "If the problem persists, contact support with your requestId.",
  "retryable": false,
  "timestamp": "2026-03-28T10:00:00.000Z",
  "requestId": "req_abc126"
}
```

---

## Adding a new error code

1. Add the value to `ErrorCode` in `src/types.ts` following the `DOMAIN_REASON` convention.
2. Add a factory function in `src/factory.ts`.
3. Export it from `src/index.ts` (already re-exported via `export * from "./factory"`).
4. Add a row to this table.
5. Add a test case in `src/__tests__/factory.test.ts`.
