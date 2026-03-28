import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { ErrorLogger } from "../logger"
import { ErrorCode } from "../types"
import { generateCorrelationId } from "../correlation"

describe("ErrorLogger", () => {
  let stderrSpy: ReturnType<typeof vi.spyOn>
  let stdoutSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    stderrSpy = vi.spyOn(process.stderr, "write").mockImplementation(() => true)
    stdoutSpy = vi.spyOn(process.stdout, "write").mockImplementation(() => true)
  })

  afterEach(() => {
    stderrSpy.mockRestore()
    stdoutSpy.mockRestore()
  })

  describe("logError", () => {
    it("logs error with correlation ID and context", () => {
      const correlationId = generateCorrelationId()
      const error = new Error("Test error")
      const context = {
        correlationId,
        userId: "user123",
        requestPath: "/api/test",
        requestMethod: "GET",
      }

      ErrorLogger.logError(error, context)

      expect(stderrSpy).toHaveBeenCalledOnce()
      const logged = JSON.parse(stderrSpy.mock.calls[0][0] as string)
      
      expect(logged.level).toBe("error")
      expect(logged.message).toBe("Test error")
      expect(logged.context.correlationId).toBe(correlationId)
      expect(logged.context.userId).toBe("user123")
      expect(logged.context.requestPath).toBe("/api/test")
      expect(logged.error.name).toBe("Error")
      expect(logged.error.stack).toBeDefined()
    })

    it("logs ErrorResponse with error code", () => {
      const correlationId = generateCorrelationId()
      const errorResponse = {
        code: ErrorCode.AUTH_UNAUTHORIZED,
        message: "Unauthorized",
        context: { correlationId },
      }

      ErrorLogger.logError(errorResponse, { correlationId })

      expect(stderrSpy).toHaveBeenCalledOnce()
      const logged = JSON.parse(stderrSpy.mock.calls[0][0] as string)
      
      expect(logged.error.code).toBe(ErrorCode.AUTH_UNAUTHORIZED)
      expect(logged.error.name).toBe("ErrorResponse")
    })

    it("includes timestamp in log entry", () => {
      const error = new Error("Test")
      const correlationId = generateCorrelationId()

      ErrorLogger.logError(error, { correlationId })

      const logged = JSON.parse(stderrSpy.mock.calls[0][0] as string)
      expect(logged.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/)
      expect(logged.context.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/)
    })
  })

  describe("logWarning", () => {
    it("logs warning to stderr", () => {
      const correlationId = generateCorrelationId()
      ErrorLogger.logWarning("Warning message", { correlationId })

      expect(stderrSpy).toHaveBeenCalledOnce()
      const logged = JSON.parse(stderrSpy.mock.calls[0][0] as string)
      
      expect(logged.level).toBe("warn")
      expect(logged.message).toBe("Warning message")
      expect(logged.context.correlationId).toBe(correlationId)
    })
  })

  describe("logInfo", () => {
    it("logs info to stdout", () => {
      const correlationId = generateCorrelationId()
      ErrorLogger.logInfo("Info message", { correlationId })

      expect(stdoutSpy).toHaveBeenCalledOnce()
      const logged = JSON.parse(stdoutSpy.mock.calls[0][0] as string)
      
      expect(logged.level).toBe("info")
      expect(logged.message).toBe("Info message")
      expect(logged.context.correlationId).toBe(correlationId)
    })
  })
})
