import { ErrorCode, ErrorContext, ErrorResponse } from "./types"

export interface LogEntry {
  level: "error" | "warn" | "info" | "debug"
  message: string
  timestamp: string
  context: ErrorContext
  error?: {
    name: string
    message: string
    stack?: string
    code?: ErrorCode
  }
}

export class ErrorLogger {
  /**
   * Logs an error with full context including correlation ID, stack trace,
   * user context, and request metadata
   */
  static logError(error: Error | ErrorResponse, context: ErrorContext): void {
    const entry: LogEntry = {
      level: "error",
      message: error.message,
      timestamp: new Date().toISOString(),
      context: {
        ...context,
        timestamp: new Date().toISOString(),
      },
      error: {
        name: error instanceof Error ? error.name : "ErrorResponse",
        message: error.message,
        stack: error instanceof Error ? error.stack : undefined,
        code: "code" in error ? error.code : undefined,
      },
    }

    this.write(entry)
  }

  /**
   * Logs a warning with context
   */
  static logWarning(message: string, context: ErrorContext): void {
    const entry: LogEntry = {
      level: "warn",
      message,
      timestamp: new Date().toISOString(),
      context: {
        ...context,
        timestamp: new Date().toISOString(),
      },
    }

    this.write(entry)
  }

  /**
   * Logs an info message with context
   */
  static logInfo(message: string, context: ErrorContext): void {
    const entry: LogEntry = {
      level: "info",
      message,
      timestamp: new Date().toISOString(),
      context: {
        ...context,
        timestamp: new Date().toISOString(),
      },
    }

    this.write(entry)
  }

  private static write(entry: LogEntry): void {
    const line = JSON.stringify(entry)
    if (entry.level === "error" || entry.level === "warn") {
      process.stderr.write(line + "\n")
    } else {
      process.stdout.write(line + "\n")
    }
  }
}
