import { describe, it, expect } from "vitest"
import { generateCorrelationId, resolveCorrelationId } from "../correlation"

describe("correlation", () => {
  describe("generateCorrelationId", () => {
    it("generates a unique ID", () => {
      const id1 = generateCorrelationId()
      const id2 = generateCorrelationId()
      
      expect(id1).toBeTruthy()
      expect(id2).toBeTruthy()
      expect(id1).not.toBe(id2)
    })

    it("generates ID with correct format", () => {
      const id = generateCorrelationId()
      expect(id).toMatch(/^[a-z0-9-]+$/)
      expect(id.length).toBeGreaterThan(20)
    })
  })

  describe("resolveCorrelationId", () => {
    it("returns existing string header", () => {
      const existingId = "existing-correlation-id"
      expect(resolveCorrelationId(existingId)).toBe(existingId)
    })

    it("returns first element from array header", () => {
      const existingId = "array-correlation-id"
      expect(resolveCorrelationId([existingId, "other"])).toBe(existingId)
    })

    it("generates new ID when header is undefined", () => {
      const id = resolveCorrelationId(undefined)
      expect(id).toBeTruthy()
      expect(id.length).toBeGreaterThan(20)
    })

    it("generates new ID when header is empty string", () => {
      const id = resolveCorrelationId("")
      expect(id).toBeTruthy()
      expect(id.length).toBeGreaterThan(20)
    })

    it("generates new ID when header is empty array", () => {
      const id = resolveCorrelationId([])
      expect(id).toBeTruthy()
      expect(id.length).toBeGreaterThan(20)
    })
  })
})
