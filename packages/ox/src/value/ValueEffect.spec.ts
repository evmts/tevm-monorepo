import { describe, it, expect } from 'vitest'
import { Effect } from 'effect'
import { ValueEffectTag, ValueEffectLive, ValueEffectLayer } from './ValueEffect.js'
import { BaseErrorEffect } from '../errors/ErrorsEffect.js'

describe('ValueEffect', () => {
  describe('formatEffect', () => {
    it('should format a bigint value to string', async () => {
      const program = Effect.provideService(
        ValueEffectTag,
        ValueEffectLive
      )(Effect.flatMap(
        ValueEffectTag,
        (valueEffect) => valueEffect.formatEffect(420_000_000_000n, 9)
      ))

      const result = await Effect.runPromise(program)
      expect(result).toBe('420')
    })

    it('should format a bigint value with default decimals', async () => {
      const program = Effect.provideService(
        ValueEffectTag,
        ValueEffectLive
      )(Effect.flatMap(
        ValueEffectTag,
        (valueEffect) => valueEffect.formatEffect(420n)
      ))

      const result = await Effect.runPromise(program)
      expect(result).toBe('420')
    })
  })

  describe('formatEtherEffect', () => {
    it('should format wei to ether', async () => {
      const program = Effect.provideService(
        ValueEffectTag,
        ValueEffectLive
      )(Effect.flatMap(
        ValueEffectTag,
        (valueEffect) => valueEffect.formatEtherEffect(1_000_000_000_000_000_000n)
      ))

      const result = await Effect.runPromise(program)
      expect(result).toBe('1')
    })

    it('should format gwei to ether', async () => {
      const program = Effect.provideService(
        ValueEffectTag,
        ValueEffectLive
      )(Effect.flatMap(
        ValueEffectTag,
        (valueEffect) => valueEffect.formatEtherEffect(1_000_000_000n, 'gwei')
      ))

      const result = await Effect.runPromise(program)
      expect(result).toBe('1')
    })
  })

  describe('formatGweiEffect', () => {
    it('should format wei to gwei', async () => {
      const program = Effect.provideService(
        ValueEffectTag,
        ValueEffectLive
      )(Effect.flatMap(
        ValueEffectTag,
        (valueEffect) => valueEffect.formatGweiEffect(1_000_000_000n)
      ))

      const result = await Effect.runPromise(program)
      expect(result).toBe('1')
    })
  })

  describe('fromEffect', () => {
    it('should parse a string to bigint', async () => {
      const program = Effect.provideService(
        ValueEffectTag,
        ValueEffectLive
      )(Effect.flatMap(
        ValueEffectTag,
        (valueEffect) => valueEffect.fromEffect('420', 9)
      ))

      const result = await Effect.runPromise(program)
      expect(result).toBe(420_000_000_000n)
    })

    it('should handle invalid decimal numbers', async () => {
      const program = Effect.provideService(
        ValueEffectTag,
        ValueEffectLive
      )(Effect.flatMap(
        ValueEffectTag,
        (valueEffect) => valueEffect.fromEffect('123.456.789')
      ))

      try {
        await Effect.runPromise(program)
        // If it doesn't throw, fail the test
        expect(true).toBe(false)
      } catch (error) {
        expect(error).toBeInstanceOf(BaseErrorEffect)
        expect(error.message).toContain('Value `123.456.789` is not a valid decimal number')
      }
    })
  })

  describe('fromEtherEffect', () => {
    it('should parse ether to wei', async () => {
      const program = Effect.provideService(
        ValueEffectTag,
        ValueEffectLive
      )(Effect.flatMap(
        ValueEffectTag,
        (valueEffect) => valueEffect.fromEtherEffect('1')
      ))

      const result = await Effect.runPromise(program)
      expect(result).toBe(1_000_000_000_000_000_000n)
    })

    it('should parse ether to gwei', async () => {
      const program = Effect.provideService(
        ValueEffectTag,
        ValueEffectLive
      )(Effect.flatMap(
        ValueEffectTag,
        (valueEffect) => valueEffect.fromEtherEffect('1', 'gwei')
      ))

      const result = await Effect.runPromise(program)
      expect(result).toBe(1_000_000_000n)
    })
  })

  describe('fromGweiEffect', () => {
    it('should parse gwei to wei', async () => {
      const program = Effect.provideService(
        ValueEffectTag,
        ValueEffectLive
      )(Effect.flatMap(
        ValueEffectTag,
        (valueEffect) => valueEffect.fromGweiEffect('1')
      ))

      const result = await Effect.runPromise(program)
      expect(result).toBe(1_000_000_000n)
    })
  })

  describe('Layer', () => {
    it('should provide the ValueEffectService', async () => {
      const program = Effect.provideLayer(
        ValueEffectLayer
      )(Effect.flatMap(
        ValueEffectTag,
        (valueEffect) => valueEffect.formatEtherEffect(1_000_000_000_000_000_000n)
      ))

      const result = await Effect.runPromise(program)
      expect(result).toBe('1')
    })
  })
})