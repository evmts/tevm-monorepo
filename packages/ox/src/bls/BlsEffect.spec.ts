import { describe, it, expect } from 'vitest'
import { Effect } from 'effect'
import { BlsEffectLive } from './BlsEffect.js'
import * as Bls from 'ox/core/Bls'
import { BaseErrorEffect } from '../errors/ErrorsEffect.js'

describe('BlsEffect', () => {
  it('should wrap randomPrivateKey correctly', async () => {
    const program = BlsEffectLive.randomPrivateKeyEffect()
    const result = await Effect.runPromise(program)
    expect(result).toBeInstanceOf(Uint8Array)
    expect(result.length).toBe(32) // BLS private keys are 32 bytes
  })

  it('should wrap getPublicKey correctly', async () => {
    const privateKey = await Effect.runPromise(BlsEffectLive.randomPrivateKeyEffect())
    const program = BlsEffectLive.getPublicKeyEffect(privateKey)
    const result = await Effect.runPromise(program)
    expect(result).toBeDefined()
  })

  it('should wrap sign and verify correctly', async () => {
    const privateKey = await Effect.runPromise(BlsEffectLive.randomPrivateKeyEffect())
    const publicKey = await Effect.runPromise(BlsEffectLive.getPublicKeyEffect(privateKey))
    const message = new Uint8Array([1, 2, 3, 4, 5])
    
    const signature = await Effect.runPromise(BlsEffectLive.signEffect(message, privateKey))
    const isValid = await Effect.runPromise(BlsEffectLive.verifyEffect(message, signature, publicKey))
    
    expect(isValid).toBe(true)
  })

  it('should wrap aggregate correctly', async () => {
    const privateKey1 = await Effect.runPromise(BlsEffectLive.randomPrivateKeyEffect())
    const privateKey2 = await Effect.runPromise(BlsEffectLive.randomPrivateKeyEffect())
    
    const publicKey1 = await Effect.runPromise(BlsEffectLive.getPublicKeyEffect(privateKey1))
    const publicKey2 = await Effect.runPromise(BlsEffectLive.getPublicKeyEffect(privateKey2))
    
    const program = BlsEffectLive.aggregateEffect([publicKey1, publicKey2])
    const aggregatedKey = await Effect.runPromise(program)
    
    expect(aggregatedKey).toBeDefined()
  })

  it('should handle errors correctly', async () => {
    // Create an invalid private key (wrong length)
    const invalidPrivateKey = new Uint8Array([1, 2, 3]) // Too short
    
    const program = BlsEffectLive.getPublicKeyEffect(invalidPrivateKey)
    
    try {
      await Effect.runPromise(program)
      expect.fail('Should have thrown an error')
    } catch (error) {
      expect(error).toBeInstanceOf(BaseErrorEffect)
    }
  })
})