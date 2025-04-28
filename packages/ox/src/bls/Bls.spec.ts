import { Effect } from 'effect'
import { describe, expect, it } from 'vitest'
import * as Bls from './Bls.js'

describe('Bls', () => {
  it('should generate random private key', async () => {
    const program = Bls.randomPrivateKey()
    const result = await Effect.runPromise(program)
    
    expect(result).toBeInstanceOf(Uint8Array)
    expect(result.length).toBe(32) // BLS private keys are 32 bytes
  })

  it('should derive public key from private key', async () => {
    const privateKey = await Effect.runPromise(Bls.randomPrivateKey())
    const program = Bls.getPublicKey(privateKey)
    const publicKey = await Effect.runPromise(program)
    
    expect(publicKey).toBeDefined()
  })

  it('should sign and verify a message', async () => {
    const privateKey = await Effect.runPromise(Bls.randomPrivateKey())
    const publicKey = await Effect.runPromise(Bls.getPublicKey(privateKey))
    const message = new Uint8Array([1, 2, 3, 4, 5])
    
    const signature = await Effect.runPromise(Bls.sign(message, privateKey))
    const isValid = await Effect.runPromise(Bls.verify(message, signature, publicKey))
    
    expect(isValid).toBe(true)
  })

  it('should fail verification with wrong message', async () => {
    const privateKey = await Effect.runPromise(Bls.randomPrivateKey())
    const publicKey = await Effect.runPromise(Bls.getPublicKey(privateKey))
    const message1 = new Uint8Array([1, 2, 3, 4, 5])
    const message2 = new Uint8Array([5, 4, 3, 2, 1]) // Different message
    
    const signature = await Effect.runPromise(Bls.sign(message1, privateKey))
    const isValid = await Effect.runPromise(Bls.verify(message2, signature, publicKey))
    
    expect(isValid).toBe(false)
  })

  it('should aggregate multiple points', async () => {
    const privateKey1 = await Effect.runPromise(Bls.randomPrivateKey())
    const privateKey2 = await Effect.runPromise(Bls.randomPrivateKey())
    
    const publicKey1 = await Effect.runPromise(Bls.getPublicKey(privateKey1))
    const publicKey2 = await Effect.runPromise(Bls.getPublicKey(privateKey2))
    
    const program = Bls.aggregate([publicKey1, publicKey2])
    const aggregatedKey = await Effect.runPromise(program)
    
    expect(aggregatedKey).toBeDefined()
  })

  it('should handle errors gracefully', async () => {
    // Create an invalid private key (wrong length)
    const invalidPrivateKey = new Uint8Array([1, 2, 3]) // Too short
    
    const program = Effect.either(Bls.getPublicKey(invalidPrivateKey))
    const result = await Effect.runPromise(program)
    
    expect(result._tag).toBe('Left')
    if (result._tag === 'Left') {
      expect(result.left).toBeInstanceOf(Bls.GetPublicKeyError)
      expect(result.left.name).toBe('GetPublicKeyError')
      expect(result.left._tag).toBe('GetPublicKeyError')
    }
  })
})