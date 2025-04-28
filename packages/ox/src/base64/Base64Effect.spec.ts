import { describe, it, expect } from 'vitest'
import { Effect } from 'effect'
import * as Bytes from 'ox/core/Bytes'
import * as Hex from 'ox/core/Hex'
import { Base64EffectLive } from './Base64Effect.js'

describe('Base64Effect', () => {
  describe('fromBytesEffect', () => {
    it('should encode Bytes to a Base64 string', async () => {
      const bytes = Bytes.fromString('hello world')
      const program = Base64EffectLive.fromBytesEffect(bytes)
      const result = await Effect.runPromise(program)
      expect(result).toBe('aGVsbG8gd29ybGQ=')
    })

    it('should encode with no padding option', async () => {
      const bytes = Bytes.fromString('hello world')
      const program = Base64EffectLive.fromBytesEffect(bytes, { pad: false })
      const result = await Effect.runPromise(program)
      expect(result).toBe('aGVsbG8gd29ybGQ')
    })

    it('should encode with URL-safe option', async () => {
      const bytes = Bytes.fromString('hello world')
      const program = Base64EffectLive.fromBytesEffect(bytes, { url: true })
      const result = await Effect.runPromise(program)
      expect(result).toBe('aGVsbG8gd29ybGQ=')  // This string doesn't have characters that need URL-safe encoding
    })
  })

  describe('fromHexEffect', () => {
    it('should encode Hex to a Base64 string', async () => {
      const hex = Hex.fromString('hello world')
      const program = Base64EffectLive.fromHexEffect(hex)
      const result = await Effect.runPromise(program)
      expect(result).toBe('aGVsbG8gd29ybGQ=')
    })
  })

  describe('fromStringEffect', () => {
    it('should encode a string to a Base64 string', async () => {
      const program = Base64EffectLive.fromStringEffect('hello world')
      const result = await Effect.runPromise(program)
      expect(result).toBe('aGVsbG8gd29ybGQ=')
    })
  })

  describe('toBytesEffect', () => {
    it('should decode a Base64 string to Bytes', async () => {
      const program = Base64EffectLive.toBytesEffect('aGVsbG8gd29ybGQ=')
      const result = await Effect.runPromise(program)
      expect(result).toBeInstanceOf(Uint8Array)
      expect(Bytes.toString(result)).toBe('hello world')
    })
  })

  describe('toHexEffect', () => {
    it('should decode a Base64 string to Hex', async () => {
      const program = Base64EffectLive.toHexEffect('aGVsbG8gd29ybGQ=')
      const result = await Effect.runPromise(program)
      expect(result).toBe('0x68656c6c6f20776f726c64')
    })
  })

  describe('toStringEffect', () => {
    it('should decode a Base64 string to a string', async () => {
      const program = Base64EffectLive.toStringEffect('aGVsbG8gd29ybGQ=')
      const result = await Effect.runPromise(program)
      expect(result).toBe('hello world')
    })
  })
})