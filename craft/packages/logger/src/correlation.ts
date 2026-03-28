import { CorrelationId } from './types'

const CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789'

/** Generates a URL-safe correlation ID. Uses crypto.randomUUID when available. */
export function generateCorrelationId(): CorrelationId {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  let id = ''
  for (let i = 0; i < 32; i++) {
    id += CHARS[Math.floor(Math.random() * CHARS.length)]
    if (i === 7 || i === 11 || i === 15 || i === 19) id += '-'
  }
  return id
}

/** Extracts a correlation ID from a request header, or generates a new one. */
export function resolveCorrelationId(header?: string | string[]): CorrelationId {
  if (typeof header === 'string' && header.length > 0) return header
  if (Array.isArray(header) && header[0]) return header[0]
  return generateCorrelationId()
}