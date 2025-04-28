import { Effect } from 'effect'
import * as Bytes from 'ox/core/Bytes'
import * as Hex from 'ox/core/Hex'
import { describe, expect, it } from 'vitest'
import * as Blobs from './Blobs.js'

describe('Blobs', () => {
  // Create a sample blob for testing
  const createTestBlob = () => {
    // Create a blob filled with zeros
    return new Uint8Array(131072).fill(0)
  }

  describe('fromBytes', () => {
    it('should convert Bytes to a Blob', async () => {
      const bytes = createTestBlob()
      const program = Blobs.fromBytes(bytes)
      const result = await Effect.runPromise(program)
      expect(result).toBeDefined()
    })

    it('should handle errors correctly', async () => {
      // Invalid blob - too small
      const invalidBytes = new Uint8Array(10).fill(0)
      const program = Blobs.fromBytes(invalidBytes)

      try {
        await Effect.runPromise(program)
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error).toBeInstanceOf(Blobs.FromBytesError)
        expect(error._tag).toBe('FromBytesError')
      }
    })
  })

  describe('fromHex', () => {
    it('should convert Hex to a Blob', async () => {
      const bytes = createTestBlob()
      const hex = Hex.fromBytes(bytes)
      const program = Blobs.fromHex(hex)
      const result = await Effect.runPromise(program)
      expect(result).toBeDefined()
    })

    it('should handle errors correctly', async () => {
      // Invalid hex
      const invalidHex = '0x1234'
      const program = Blobs.fromHex(invalidHex)

      try {
        await Effect.runPromise(program)
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error).toBeInstanceOf(Blobs.FromHexError)
        expect(error._tag).toBe('FromHexError')
      }
    })
  })

  describe('toBytes', () => {
    it('should convert a Blob to Bytes', async () => {
      const bytes = createTestBlob()
      const blob = await Effect.runPromise(Blobs.fromBytes(bytes))
      const program = Blobs.toBytes(blob)
      const result = await Effect.runPromise(program)
      expect(result).toBeInstanceOf(Uint8Array)
    })
  })

  describe('toHex', () => {
    it('should convert a Blob to Hex', async () => {
      const bytes = createTestBlob()
      const blob = await Effect.runPromise(Blobs.fromBytes(bytes))
      const program = Blobs.toHex(blob)
      const result = await Effect.runPromise(program)
      expect(result).toMatch(/^0x/)
    })
  })

  describe('isBlob', () => {
    it('should verify if Bytes is a valid blob format', async () => {
      const bytes = createTestBlob()
      const program = Blobs.isBlob(bytes)
      const result = await Effect.runPromise(program)
      expect(typeof result).toBe('boolean')
    })
  })

  describe('isValid', () => {
    it('should verify if blob is a valid 4844 blob', async () => {
      const bytes = createTestBlob()
      const program = Blobs.isValid(bytes)
      const result = await Effect.runPromise(program)
      expect(typeof result).toBe('boolean')
    })
  })

  describe('toVersionedHash', () => {
    it('should create a versioned hash from a commitment', async () => {
      // Create a sample commitment (32 bytes)
      const commitment = new Uint8Array(32).fill(1)
      const program = Blobs.toVersionedHash(commitment)
      const result = await Effect.runPromise(program)
      expect(result).toBeInstanceOf(Uint8Array)
      expect(result.length).toBe(32)
    })

    it('should handle errors correctly', async () => {
      // Invalid commitment (wrong length)
      const invalidCommitment = new Uint8Array(10).fill(1) // Too short
      const program = Blobs.toVersionedHash(invalidCommitment)

      try {
        await Effect.runPromise(program)
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error).toBeInstanceOf(Blobs.ToVersionedHashError)
        expect(error._tag).toBe('ToVersionedHashError')
      }
    })
  })
})