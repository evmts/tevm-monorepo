import { describe, it, expect } from 'vitest'
import { Effect, pipe } from 'effect'
import { AddressEffectTag, AddressEffectLayer } from './AddressEffect.js'

describe('AddressEffect', () => {
  const validAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
  
  it('should validate an address using effect', async () => {
    const program = pipe(
      Effect.provide(Effect.flatMap(AddressEffectTag, (address) => 
        address.validateEffect(validAddress)
      ), AddressEffectLayer)
    )
    
    const result = await Effect.runPromise(program)
    expect(result).toBe(true)
  })
  
  it('should detect invalid addresses', async () => {
    const program = pipe(
      Effect.provide(Effect.flatMap(AddressEffectTag, (address) => 
        address.validateEffect('0xinvalid')
      ), AddressEffectLayer)
    )
    
    const result = await Effect.runPromise(program)
    expect(result).toBe(false)
  })
  
  it('should create address from string', async () => {
    const program = pipe(
      Effect.provide(Effect.flatMap(AddressEffectTag, (address) => 
        address.fromStringEffect(validAddress)
      ), AddressEffectLayer)
    )
    
    const result = await Effect.runPromise(program)
    expect(result).toBe(validAddress)
  })
  
  it('should format address', async () => {
    const program = pipe(
      Effect.provide(
        Effect.flatMap(
          AddressEffectTag, 
          (address) => Effect.flatMap(
            address.fromStringEffect(validAddress),
            (addr) => address.formatEffect(addr, { case: 'lowercase' })
          )
        ), 
        AddressEffectLayer
      )
    )
    
    const result = await Effect.runPromise(program)
    expect(result).toBe(validAddress.toLowerCase())
  })
})