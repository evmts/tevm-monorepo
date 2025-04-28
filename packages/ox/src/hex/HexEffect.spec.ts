import { describe, it, expect } from 'vitest'
import { Effect, pipe } from 'effect'
import { Hex } from 'ox'
import { HexEffectTag, HexEffectLayer } from './HexEffect.js'

describe('HexEffect', () => {
  it('should convert string to hex using effect', async () => {
    const program = pipe(
      Effect.provide(Effect.flatMap(HexEffectTag, (hex) => 
        hex.fromStringEffect('Hello World!')
      ), HexEffectLayer)
    )
    
    const result = await Effect.runPromise(program)
    expect(result).toBe('0x48656c6c6f20576f726c6421')
  })
  
  it('should catch errors and wrap them in BaseErrorEffect', async () => {
    const program = pipe(
      Effect.provide(Effect.flatMap(HexEffectTag, (hex) => 
        hex.toBooleanEffect('0xabcd')
      ), HexEffectLayer),
      Effect.catchAll(error => {
        expect(error.name).toBe('BaseError')
        expect(error.shortMessage).toBeTruthy()
        return Effect.succeed('caught error as expected')
      })
    )
    
    const result = await Effect.runPromise(program)
    expect(result).toBe('caught error as expected')
  })
  
  it('should pad hex values', async () => {
    const program = pipe(
      Effect.provide(Effect.flatMap(HexEffectTag, (hex) => 
        hex.padLeftEffect('0x1234', 4)
      ), HexEffectLayer)
    )
    
    const result = await Effect.runPromise(program)
    expect(result).toBe('0x00001234')
  })
  
  it('should convert hex to number', async () => {
    const program = pipe(
      Effect.provide(Effect.flatMap(HexEffectTag, (hex) => 
        hex.toNumberEffect('0x1a4')
      ), HexEffectLayer)
    )
    
    const result = await Effect.runPromise(program)
    expect(result).toBe(420)
  })
})