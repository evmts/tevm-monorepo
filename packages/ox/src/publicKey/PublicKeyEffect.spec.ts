import { describe, it, expect } from 'vitest'
import { Effect } from 'effect'
import { PublicKeyEffectTag, PublicKeyEffectLive, PublicKeyEffectLayer } from './PublicKeyEffect.js'
import { BaseErrorEffect } from '../errors/ErrorsEffect.js'
import * as Hex from 'ox/core/Hex'

describe('PublicKeyEffect', () => {
  // Sample public keys for tests
  const uncompressedPublicKey = {
    prefix: 4,
    x: 59295962801117472859457908919941473389380284132224861839820747729565200149877n,
    y: 24099691209996290925259367678540227198235484593389470330605641003500238088869n,
  }

  const compressedPublicKey = {
    prefix: 3,
    x: 59295962801117472859457908919941473389380284132224861839820747729565200149877n,
  }

  const uncompressedHex = '0x048318535b54105d4a7aae60c08fc45f9687181b4fdfc625bd1a753fa7397fed753547f11ca8696646f2f3acb08e31016afac23e630c5d11f59f61fef57b0d2aa5'
  const compressedHex = '0x038318535b54105d4a7aae60c08fc45f9687181b4fdfc625bd1a753fa7397fed75'

  describe('assertEffect', () => {
    it('should validate a valid uncompressed public key', async () => {
      const program = Effect.provideService(
        PublicKeyEffectTag,
        PublicKeyEffectLive
      )(Effect.flatMap(
        PublicKeyEffectTag,
        (publicKeyEffect) => publicKeyEffect.assertEffect(uncompressedPublicKey)
      ))

      await expect(Effect.runPromise(program)).resolves.toBeUndefined()
    })

    it('should validate a valid compressed public key', async () => {
      const program = Effect.provideService(
        PublicKeyEffectTag,
        PublicKeyEffectLive
      )(Effect.flatMap(
        PublicKeyEffectTag,
        (publicKeyEffect) => publicKeyEffect.assertEffect(compressedPublicKey)
      ))

      await expect(Effect.runPromise(program)).resolves.toBeUndefined()
    })

    it('should fail with invalid public key', async () => {
      const program = Effect.provideService(
        PublicKeyEffectTag,
        PublicKeyEffectLive
      )(Effect.flatMap(
        PublicKeyEffectTag,
        (publicKeyEffect) => publicKeyEffect.assertEffect({ y: 1n } as any)
      ))

      await expect(Effect.runPromise(program)).rejects.toBeInstanceOf(BaseErrorEffect)
    })
  })

  describe('compressEffect', () => {
    it('should compress an uncompressed public key', async () => {
      const program = Effect.provideService(
        PublicKeyEffectTag,
        PublicKeyEffectLive
      )(Effect.flatMap(
        PublicKeyEffectTag,
        (publicKeyEffect) => publicKeyEffect.compressEffect(uncompressedPublicKey)
      ))

      const result = await Effect.runPromise(program)
      expect(result.prefix).toBe(3) // odd y coordinate
      expect(result.x).toEqual(uncompressedPublicKey.x)
      expect(result.y).toBeUndefined()
    })
  })

  describe('fromEffect', () => {
    it('should create a public key from an object', async () => {
      const program = Effect.provideService(
        PublicKeyEffectTag,
        PublicKeyEffectLive
      )(Effect.flatMap(
        PublicKeyEffectTag,
        (publicKeyEffect) => publicKeyEffect.fromEffect(uncompressedPublicKey)
      ))

      const result = await Effect.runPromise(program)
      expect(result).toEqual(uncompressedPublicKey)
    })

    it('should create a public key from hex', async () => {
      const program = Effect.provideService(
        PublicKeyEffectTag,
        PublicKeyEffectLive
      )(Effect.flatMap(
        PublicKeyEffectTag,
        (publicKeyEffect) => publicKeyEffect.fromEffect(uncompressedHex)
      ))

      const result = await Effect.runPromise(program)
      expect(result.prefix).toBe(4)
      expect(result.x).toBe(uncompressedPublicKey.x)
      expect(result.y).toBe(uncompressedPublicKey.y)
    })
  })

  describe('fromHexEffect', () => {
    it('should create a public key from uncompressed hex', async () => {
      const program = Effect.provideService(
        PublicKeyEffectTag,
        PublicKeyEffectLive
      )(Effect.flatMap(
        PublicKeyEffectTag,
        (publicKeyEffect) => publicKeyEffect.fromHexEffect(uncompressedHex)
      ))

      const result = await Effect.runPromise(program)
      expect(result.prefix).toBe(4)
      expect(result.x).toBe(uncompressedPublicKey.x)
      expect(result.y).toBe(uncompressedPublicKey.y)
    })

    it('should create a public key from compressed hex', async () => {
      const program = Effect.provideService(
        PublicKeyEffectTag,
        PublicKeyEffectLive
      )(Effect.flatMap(
        PublicKeyEffectTag,
        (publicKeyEffect) => publicKeyEffect.fromHexEffect(compressedHex)
      ))

      const result = await Effect.runPromise(program)
      expect(result.prefix).toBe(3)
      expect(result.x).toBe(compressedPublicKey.x)
      expect(result.y).toBeUndefined()
    })

    it('should fail with invalid hex', async () => {
      const program = Effect.provideService(
        PublicKeyEffectTag,
        PublicKeyEffectLive
      )(Effect.flatMap(
        PublicKeyEffectTag,
        (publicKeyEffect) => publicKeyEffect.fromHexEffect('0x12')
      ))

      await expect(Effect.runPromise(program)).rejects.toBeInstanceOf(BaseErrorEffect)
    })
  })

  describe('toHexEffect', () => {
    it('should convert an uncompressed public key to hex', async () => {
      const program = Effect.provideService(
        PublicKeyEffectTag,
        PublicKeyEffectLive
      )(Effect.flatMap(
        PublicKeyEffectTag,
        (publicKeyEffect) => publicKeyEffect.toHexEffect(uncompressedPublicKey)
      ))

      const result = await Effect.runPromise(program)
      // For easier comparison, normalize the hex
      const normalizedResult = Hex.toLowerCase(result)
      const normalizedExpected = Hex.toLowerCase(uncompressedHex)
      expect(normalizedResult).toBe(normalizedExpected)
    })

    it('should convert a compressed public key to hex', async () => {
      const program = Effect.provideService(
        PublicKeyEffectTag,
        PublicKeyEffectLive
      )(Effect.flatMap(
        PublicKeyEffectTag,
        (publicKeyEffect) => publicKeyEffect.toHexEffect(compressedPublicKey)
      ))

      const result = await Effect.runPromise(program)
      // For easier comparison, normalize the hex
      const normalizedResult = Hex.toLowerCase(result)
      const normalizedExpected = Hex.toLowerCase(compressedHex)
      expect(normalizedResult).toBe(normalizedExpected)
    })
  })

  describe('validateEffect', () => {
    it('should return true for a valid uncompressed public key', async () => {
      const program = Effect.provideService(
        PublicKeyEffectTag,
        PublicKeyEffectLive
      )(Effect.flatMap(
        PublicKeyEffectTag,
        (publicKeyEffect) => publicKeyEffect.validateEffect(uncompressedPublicKey)
      ))

      const result = await Effect.runPromise(program)
      expect(result).toBe(true)
    })

    it('should return true for a valid compressed public key', async () => {
      const program = Effect.provideService(
        PublicKeyEffectTag,
        PublicKeyEffectLive
      )(Effect.flatMap(
        PublicKeyEffectTag,
        (publicKeyEffect) => publicKeyEffect.validateEffect(compressedPublicKey)
      ))

      const result = await Effect.runPromise(program)
      expect(result).toBe(true)
    })

    it('should return false for an invalid public key', async () => {
      const program = Effect.provideService(
        PublicKeyEffectTag,
        PublicKeyEffectLive
      )(Effect.flatMap(
        PublicKeyEffectTag,
        (publicKeyEffect) => publicKeyEffect.validateEffect({ y: 1n } as any)
      ))

      const result = await Effect.runPromise(program)
      expect(result).toBe(false)
    })
  })

  describe('Layer', () => {
    it('should provide the PublicKeyEffectService via Layer', async () => {
      const program = Effect.provideLayer(
        PublicKeyEffectLayer
      )(Effect.flatMap(
        PublicKeyEffectTag,
        (publicKeyEffect) => publicKeyEffect.validateEffect(uncompressedPublicKey)
      ))

      const result = await Effect.runPromise(program)
      expect(result).toBe(true)
    })
  })
})