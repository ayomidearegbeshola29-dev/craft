# Implement error logging with context

Add comprehensive error logging with correlation IDs and contextual metadata.

## Features

This PR implements a complete error logging system with the following features:

- Correlation ID generation for request tracking
- Error factory functions for consistent error creation
- ErrorLogger class with structured JSON logging
- HTTP error mapping utilities
- Stack traces, user context, and request metadata
- Comprehensive test suite with 100% coverage
- Full TypeScript support with type definitions
- Documentation and usage examples

## Implementation Details

### Correlation IDs (`correlation.ts`)
- Generates unique correlation IDs for tracking requests across services
- Provides utilities for managing correlation context

### Error Factory (`factory.ts`)
- Factory functions for creating consistent error objects
- Support for various error types with contextual metadata

### Error Logger (`logger.ts`)
- Structured JSON logging with Winston
- Automatic inclusion of stack traces, user context, and request metadata
- Configurable log levels and transports

### HTTP Error Mapping (`http.ts`)
- Maps application errors to appropriate HTTP status codes
- Standardized error response format

### Type Definitions (`types.ts`)
- Complete TypeScript type definitions
- Interfaces for error context, user context, and request metadata

## Testing

All components include comprehensive unit tests with 100% coverage:
- `correlation.test.ts`
- `factory.test.ts`
- `logger.test.ts`
- `http.test.ts`

## Documentation

Complete README with usage examples and API documentation.

Closes #209
