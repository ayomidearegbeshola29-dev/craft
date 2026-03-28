# @craft/errors

Standardized error response types, factory functions, and HTTP utilities for all API endpoints.

## Install

```sh
npm install @craft/errors
```

## Usage

### Return an error response

```ts
import { validationFailed, notFound } from "@craft/errors"

// 400 with field-level details
return res.status(400).json(validationFailed([{ field: "email", message: "Invalid email." }]))

// 404
return res.status(404).json(notFound("User"))
```

### Throw and catch with HttpError

```ts
import { HttpError, isHttpError, unauthorized } from "@craft/errors"

// throw
throw new HttpError(unauthorized())

// catch at boundary
try { await handler(req, res) } catch (err) {
  if (isHttpError(err)) return res.status(err.status).json(err.body)
  return res.status(500).json(internalError())
}
```

## Error shape

```json
{
  "code": "VALIDATION_FAILED",
  "message": "One or more fields failed validation.",
  "guidance": "Review the details array and correct the indicated fields.",
  "details": [{ "field": "email", "message": "Invalid email." }],
  "retryable": false,
  "timestamp": "2026-03-28T11:00:00.000Z",
  "requestId": "req_abc123"
}
```

See [ERROR_CODES.md](./ERROR_CODES.md) for the full code reference.
