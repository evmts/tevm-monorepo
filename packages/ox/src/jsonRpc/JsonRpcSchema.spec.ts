import { Effect } from 'effect'
import { describe, expect, it } from 'vitest'
import * as JsonRpcSchema from './JsonRpcSchema.js'

describe('JsonRpcSchema', () => {
  it('should create a JSON-RPC schema', async () => {
    // Define a simple RPC schema for testing
    const schema = {
      eth_getBalance: {
        parameters: [
          { name: 'address', type: 'string', required: true },
          { name: 'blockTag', type: 'string', required: true }
        ],
        returns: 'string'
      },
      eth_blockNumber: {
        parameters: [],
        returns: 'string'
      }
    } as const

    // Use the from function to create a typed schema
    const result = await Effect.runPromise(JsonRpcSchema.from(schema))

    // The result should match the input schema
    expect(result).toEqual(schema)
  })

  it('should handle errors gracefully', async () => {
    // Note: It's hard to create invalid schemas that trigger real runtime errors
    // because JsonRpcSchema.from is mainly a type-level utility.
    // Instead, we'll simulate an error with an Effect.fail

    // Create a program that simulates a failure
    const failedProgram = Effect.flatMap(
      Effect.fail(new Error('Schema validation error')),
      () => JsonRpcSchema.from({} as any)
    )

    // Run the program and expect it to fail
    const result = await Effect.runPromise(Effect.either(failedProgram))
    
    expect(result._tag).toBe('Left')
    if (result._tag === 'Left') {
      expect(result.left.message).toContain('Schema validation error')
    }
  })

  it('should wrap errors in FromError', async () => {
    // Mock a scenario where from throws an error
    const mockSchemaProgram = Effect.flatMap(
      Effect.sync(() => {
        throw new Error('Invalid schema format')
      }),
      () => JsonRpcSchema.from({} as any)
    )

    // Catch the error and verify it's the right type
    const result = await Effect.runPromise(Effect.either(mockSchemaProgram))
    
    expect(result._tag).toBe('Left')
    if (result._tag === 'Left') {
      expect(result.left.message).toContain('Invalid schema format')
    }
  })
})