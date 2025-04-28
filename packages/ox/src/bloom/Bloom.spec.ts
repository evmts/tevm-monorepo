import { Effect } from 'effect'
import * as Address from 'ox/core/Address'
import * as Hex from 'ox/core/Hex'
import { describe, expect, it } from 'vitest'
import * as Bloom from './Bloom.js'

describe('Bloom', () => {
  const testAddress = Address.parse('0x1234567890123456789012345678901234567890')
  const testTopic = Hex.parse('0x1234567890123456789012345678901234567890123456789012345678901234')

  it('should create a new bloom filter', async () => {
    const program = Bloom.create()
    const bloom = await Effect.runPromise(program)

    expect(bloom).toBeDefined()
    expect(typeof bloom).toBe('string')
    expect(bloom.startsWith('0x')).toBe(true)
  })

  it('should add an address to the bloom filter', async () => {
    const program = Effect.gen(function* (_) {
      const bloom = yield* _(Bloom.create())
      const updatedBloom = yield* _(Bloom.addAddress({ bloom, address: testAddress }))
      return { bloom, updatedBloom }
    })

    const { bloom, updatedBloom } = await Effect.runPromise(program)

    expect(updatedBloom).toBeDefined()
    expect(typeof updatedBloom).toBe('string')
    expect(updatedBloom).not.toBe(bloom) // Should be different after adding an address
  })

  it('should add a topic to the bloom filter', async () => {
    const program = Effect.gen(function* (_) {
      const bloom = yield* _(Bloom.create())
      const updatedBloom = yield* _(Bloom.addTopic({ bloom, topic: testTopic }))
      return { bloom, updatedBloom }
    })

    const { bloom, updatedBloom } = await Effect.runPromise(program)

    expect(updatedBloom).toBeDefined()
    expect(typeof updatedBloom).toBe('string')
    expect(updatedBloom).not.toBe(bloom) // Should be different after adding a topic
  })

  it('should check if a bloom filter has an address', async () => {
    const program = Effect.gen(function* (_) {
      const bloom = yield* _(Bloom.create())
      const updatedBloom = yield* _(Bloom.addAddress({ bloom, address: testAddress }))
      const hasAddress = yield* _(Bloom.hasAddress({ bloom: updatedBloom, address: testAddress }))
      
      const differentAddress = Address.parse('0x0000000000000000000000000000000000000000')
      const hasOtherAddress = yield* _(Bloom.hasAddress({ bloom: updatedBloom, address: differentAddress }))
      
      return { hasAddress, hasOtherAddress }
    })

    const { hasAddress, hasOtherAddress } = await Effect.runPromise(program)

    expect(hasAddress).toBe(true)
    expect(typeof hasOtherAddress).toBe('boolean') // May return false positive, but less likely
  })

  it('should check if a bloom filter has a topic', async () => {
    const program = Effect.gen(function* (_) {
      const bloom = yield* _(Bloom.create())
      const updatedBloom = yield* _(Bloom.addTopic({ bloom, topic: testTopic }))
      const hasTopic = yield* _(Bloom.hasTopic({ bloom: updatedBloom, topic: testTopic }))
      
      const differentTopic = Hex.parse('0x0000000000000000000000000000000000000000000000000000000000000000')
      const hasOtherTopic = yield* _(Bloom.hasTopic({ bloom: updatedBloom, topic: differentTopic }))
      
      return { hasTopic, hasOtherTopic }
    })

    const { hasTopic, hasOtherTopic } = await Effect.runPromise(program)

    expect(hasTopic).toBe(true)
    expect(typeof hasOtherTopic).toBe('boolean') // May return false positive, but less likely
  })

  it('should handle errors in create', async () => {
    // Invalid data parameter should cause an error
    const program = Effect.either(Bloom.create({ data: 'invalid' as any }))
    const result = await Effect.runPromise(program)
    
    expect(result._tag).toBe('Left')
    if (result._tag === 'Left') {
      expect(result.left).toBeInstanceOf(Bloom.CreateError)
      expect(result.left.name).toBe('CreateError')
      expect(result.left._tag).toBe('CreateError')
    }
  })

  it('should handle errors in hasAddress', async () => {
    // Invalid bloom should cause an error
    const program = Effect.either(Bloom.hasAddress({ 
      bloom: '0x' as any, // Invalid bloom
      address: testAddress 
    }))
    const result = await Effect.runPromise(program)
    
    expect(result._tag).toBe('Left')
    if (result._tag === 'Left') {
      expect(result.left).toBeInstanceOf(Bloom.HasAddressError)
      expect(result.left.name).toBe('HasAddressError')
      expect(result.left._tag).toBe('HasAddressError')
    }
  })

  it('should handle errors in hasTopic', async () => {
    // Invalid bloom should cause an error
    const program = Effect.either(Bloom.hasTopic({ 
      bloom: '0x' as any, // Invalid bloom
      topic: testTopic 
    }))
    const result = await Effect.runPromise(program)
    
    expect(result._tag).toBe('Left')
    if (result._tag === 'Left') {
      expect(result.left).toBeInstanceOf(Bloom.HasTopicError)
      expect(result.left.name).toBe('HasTopicError')
      expect(result.left._tag).toBe('HasTopicError')
    }
  })
})