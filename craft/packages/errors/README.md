# @craft/errors

Comprehensive error handling package with contextual logging, correlation IDs, and structured error responses.

## Features

- **Correlation IDs**: Automatic generation and tracking of request correlation IDs for distributed tracing
- **Contextual Error Logging**: Log errors with stack traces, user context, and request metadata
- **Structured Logging**: JSON-formatted logs with consistent structure
- **HTTP Error Mapping**: Automatic mapping of error codes to HTTP status codes
- **Type-Safe**: Full TypeScript support with strict typing

## Installation

```bash
npm install @craft/errors
```

## Usage

### Creating Errors with Context

```typescript
import { unauthorized, notFound, ErrorLogger, generateCorrelationId } from '@craft/errors'

// Generate or extract correlation ID
const correlationId = generateCorrelationId()

// Create error with context
const error = unauthorized({
  correlationId,
  userId: 'user123',
  requestPath: '/api/protected',
  requestMethod: 'GET'
})

// Log the error with full context
ErrorLogger.logError(new Error('Authentication failed'), {
  correlationId,
  userId: 'user123',
  requestPath: '/api/protected',
  requestMethod: 'GET',
  statusCode: 401
})
```

### HTTP Error Handling

```typescript
import { HttpError, notFound } from '@craft/errors'

// In your route handler
try {
  const user = await findUser(id)
  if (!user) {
    throw new HttpError(notFound('User', { 
      correlationId,
      userId: id 
    }))
  }
} catch (error) {
  if (error instanceof HttpError) {
    // error.status contains the HTTP status code (404)
    // error.body contains the full ErrorResponse
    res.status(error.status).json(error.body)
  }
}
```

### Correlation ID Resolution

```typescript
import { resolveCorrelationId } from '@craft/errors'

// Extract from request header or generate new
const correlationId = resolveCorrelationId(req.headers['x-correlation-id'])

// Use throughout the request lifecycle
ErrorLogger.logInfo('Request started', {
  correlationId,
  requestPath: req.path,
  requestMethod: req.method
})
```

## API Reference

### Error Factory Functions

- `unauthorized(context?)`: Creates AUTH_UNAUTHORIZED error
- `forbidden(context?)`: Creates AUTH_FORBIDDEN error
- `notFound(resource, context?)`: Creates NOT_FOUND_RESOURCE error
- `validationFailed(message, context?)`: Creates VALIDATION_FAILED error
- `internalError(context?)`: Creates SERVER_INTERNAL error
- `rateLimitExceeded(context?)`: Creates RATE_LIMIT_EXCEEDED error

### ErrorLogger

- `ErrorLogger.logError(error, context)`: Logs error with full context and stack trace
- `ErrorLogger.logWarning(message, context)`: Logs warning message
- `ErrorLogger.logInfo(message, context)`: Logs info message

### Correlation Functions

- `generateCorrelationId()`: Generates a unique correlation ID
- `resolveCorrelationId(header?)`: Extracts correlation ID from header or generates new one

## Error Codes

All error codes are defined in the `ErrorCode` enum:

- `AUTH_UNAUTHORIZED`, `AUTH_FORBIDDEN`, `AUTH_TOKEN_EXPIRED`, `AUTH_TOKEN_INVALID`
- `VALIDATION_FAILED`, `VALIDATION_MISSING_FIELD`, `VALIDATION_INVALID_FORMAT`
- `NOT_FOUND_RESOURCE`
- `CONFLICT_DUPLICATE`, `CONFLICT_STATE`
- `RATE_LIMIT_EXCEEDED`
- `SERVER_INTERNAL`, `SERVER_UNAVAILABLE`, `SERVER_TIMEOUT`

## Testing

```bash
npm test
```

## License

MIT
