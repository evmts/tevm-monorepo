import { describe, it, expect } from 'vitest'
import { Effect, pipe } from 'effect'
import { AbiErrorEffectTag, AbiErrorEffectLayer } from './AbiErrorEffect.js'

describe('AbiErrorEffect', () => {
  it('should parse a human-readable ABI error', async () => {
    const program = pipe(
      Effect.flatMap(AbiErrorEffectTag, (abiError) => 
        abiError.fromEffect('error BadSignatureV(uint8 v)')
      ),
      Effect.provide(AbiErrorEffectLayer)
    )
    
    const result = await Effect.runPromise(program)
    expect(result).toEqual({
      type: 'error',
      name: 'BadSignatureV',
      inputs: [{ name: 'v', type: 'uint8' }]
    })
  })
  
  it('should format an ABI error', async () => {
    const program = pipe(
      Effect.flatMap(AbiErrorEffectTag, (abiError) => 
        pipe(
          abiError.fromEffect('error BadSignatureV(uint8 v)'),
          Effect.flatMap(error => abiError.formatEffect(error))
        )
      ),
      Effect.provide(AbiErrorEffectLayer)
    )
    
    const result = await Effect.runPromise(program)
    expect(result).toBe('error BadSignatureV(uint8 v)')
  })
  
  it('should get error selector', async () => {
    const program = pipe(
      Effect.flatMap(AbiErrorEffectTag, (abiError) => 
        abiError.getSelectorEffect('error BadSignatureV(uint8 v)')
      ),
      Effect.provide(AbiErrorEffectLayer)
    )
    
    const result = await Effect.runPromise(program)
    // Ensure the result is a hex string with the correct format (0x + 8 characters)
    expect(result).toMatch(/^0x[a-f0-9]{8}$/)
  })
  
  it('should encode an error', async () => {
    const errorDef = {
      type: 'error',
      name: 'BadSignatureV',
      inputs: [{ name: 'v', type: 'uint8' }]
    }
    
    const program = pipe(
      Effect.flatMap(AbiErrorEffectTag, (abiError) => 
        abiError.encodeEffect(errorDef, [123])
      ),
      Effect.provide(AbiErrorEffectLayer)
    )
    
    const result = await Effect.runPromise(program)
    // Result should be a hex string and should include the encoded value
    expect(result).toMatch(/^0x[a-f0-9]+$/)
    expect(result.length).toBeGreaterThan(10) // Make sure it includes data
  })
  
  it('should provide access to solidity error constants', async () => {
    const program = pipe(
      Effect.flatMap(AbiErrorEffectTag, (abiError) => 
        Effect.all([
          abiError.solidityErrorEffect,
          abiError.solidityErrorSelectorEffect,
          abiError.solidityPanicEffect,
          abiError.solidityPanicSelectorEffect,
          abiError.panicReasonsEffect
        ])
      ),
      Effect.provide(AbiErrorEffectLayer)
    )
    
    const [solidityError, solidityErrorSelector, solidityPanic, solidityPanicSelector, panicReasons] = 
      await Effect.runPromise(program)
    
    expect(solidityError.name).toBe('Error')
    expect(solidityErrorSelector).toBe('0x08c379a0')
    expect(solidityPanic.name).toBe('Panic')
    expect(solidityPanicSelector).toBe('0x4e487b71')
    expect(panicReasons).toBeTypeOf('object')
    expect(panicReasons[1]).toBe('An `assert` condition failed.')
  })
})