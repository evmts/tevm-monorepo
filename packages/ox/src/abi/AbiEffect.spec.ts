import { describe, it, expect } from 'vitest'
import { Effect, pipe } from 'effect'
import { AbiEffectTag, AbiEffectLayer } from './AbiEffect.js'

describe('AbiEffect', () => {
  const sampleAbi = [
    {
      type: 'function',
      name: 'transfer',
      inputs: [
        { name: 'to', type: 'address' },
        { name: 'value', type: 'uint256' },
      ],
      outputs: [{ name: '', type: 'bool' }],
      stateMutability: 'nonpayable',
    },
  ]

  it('should parse ABI using fromEffect', async () => {
    const program = pipe(
      Effect.provide(
        Effect.flatMap(AbiEffectTag, (abi) => abi.fromEffect(sampleAbi)),
        AbiEffectLayer
      )
    )

    const result = await Effect.runPromise(program)
    expect(result).toStrictEqual(sampleAbi)
  })

  it('should format ABI using formatEffect', async () => {
    const program = pipe(
      Effect.provide(
        Effect.flatMap(AbiEffectTag, (abi) => abi.formatEffect(sampleAbi)),
        AbiEffectLayer
      )
    )

    const result = await Effect.runPromise(program)
    expect(result).toBeInstanceOf(Array)
    expect(result[0]).toContain('function transfer')
    expect(result[0]).toContain('returns (bool)')
  })

  it('should handle errors properly', async () => {
    const program = pipe(
      Effect.provide(
        Effect.flatMap(AbiEffectTag, (abi) => 
          // @ts-expect-error Testing invalid input
          abi.fromEffect(null)
        ),
        AbiEffectLayer
      )
    )

    await expect(Effect.runPromise(program)).rejects.toThrow()
  })
})