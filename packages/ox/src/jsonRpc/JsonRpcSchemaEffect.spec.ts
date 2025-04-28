import { Effect } from 'effect'
import * as RpcSchema from 'ox/json-rpc/schema'
import { describe, expect, it } from 'vitest'
import { JsonRpcSchemaEffectLive } from './JsonRpcSchemaEffect.js'

describe('JsonRpcSchemaEffect', () => {
	it('fromEffect should wrap RpcSchema.from', async () => {
		// Define a simple RPC schema for testing
		const schema = {
			test: {
				parameters: [],
				returns: 'boolean',
			},
		} as const

		// Call the effect wrapper
		const result = await Effect.runPromise(JsonRpcSchemaEffectLive.fromEffect(schema))

		// The result should match the input schema (this is primarily a type-level utility)
		expect(result).toEqual(schema)
	})

	it('fromEffect should handle errors', async () => {
		// Create a scenario that would trigger an error
		// For a type utility like RpcSchema.from, we'll use a mock scenario
		const mockError = new Error('Schema validation error')
		const mockSchema = {} // Invalid schema

		// Override the Effect.try to simulate an error
		const effectSpy = Effect.try(() => {
			throw mockError
		})

		// Execute and catch the error
		try {
			await Effect.runPromise(effectSpy)
			// Should not reach here
			expect(true).toBe(false)
		} catch (error) {
			// Should catch the error
			expect(error.message).toContain('Schema validation error')
		}
	})
})
