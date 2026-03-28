export type LogLevel = 'debug' | 'info' | 'warn' | 'error'
export type CorrelationId = string

export interface LogContext {
  correlationId: CorrelationId
  service?: string
  userId?: string
  requestPath?: string
  requestMethod?: string
  statusCode?: number
  durationMs?: number
  [key: string]: unknown
}

export interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  context: LogContext
  error?: { name: string; message: string; stack?: string }
}

export interface LogTransport {
  write(entry: LogEntry): void
}