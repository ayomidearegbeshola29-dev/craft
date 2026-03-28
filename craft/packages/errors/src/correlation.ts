/** Generates a unique correlation ID for request tracking */
export function generateCorrelationId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let id = ''
  for (let i = 0; i < 32; i++) {
    id += chars[Math.floor(Math.random() * chars.length)]
    if (i === 7 || i === 11 || i === 15 || i === 19) id += '-'
  }
  return id
}

/** Extracts correlation ID from request header or generates new one */
export function resolveCorrelationId(header?: string | string[]): string {
  if (typeof header === 'string' && header.length > 0) return header
  if (Array.isArray(header) && header[0]) return header[0]
  return generateCorrelationId()
}
