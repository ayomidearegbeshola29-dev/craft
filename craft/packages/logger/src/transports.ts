import { LogEntry, LogTransport } from './types'

/** Writes structured JSON to stdout (info/debug) or stderr (warn/error). */
export class ConsoleTransport implements LogTransport {
  write(entry: LogEntry): void {
    const line = JSON.stringify(entry)
    if (entry.level === 'error' || entry.level === 'warn') {
      process.stderr.write(line + '\n')
    } else {
      process.stdout.write(line + '\n')
    }
  }
}

/** Captures entries in memory - useful for testing. */
export class MemoryTransport implements LogTransport {
  readonly entries: LogEntry[] = []
  write(entry: LogEntry): void { this.entries.push(entry) }
  clear(): void { this.entries.length = 0 }
}