import { Effect } from 'effect'
import { describe, expect, it } from 'vitest'
import { BaseErrorEffect } from '../errors/ErrorsEffect.js'
import { JsonRpcResponseEffect, JsonRpcResponseEffectLayer, JsonRpcResponseEffectTag } from './JsonRpcResponseEffect.js'
import { JsonRpcResponseEffectService } from './JsonRpcResponseEffect.js'

describe('JsonRpcResponseEffect', () => {
	const program = Effect.provide(JsonRpcResponseEffectLayer)

	it('should create a JSON-RPC response', async () => {
		const result = await Effect.runPromise(
			program(
				Effect.gen(function* (_) {
					const service = yield* _(Effect.get(JsonRpcResponseEffectTag))
					return yield* _(
						service.createResponseEffect({
							id: 1,
							result: 'test',
						}),
					)
				}),
			),
		)

		expect(result).toHaveProperty('id', 1)
		expect(result).toHaveProperty('result', 'test')
		expect(result).toHaveProperty('jsonrpc', '2.0')
	})

	it('should parse a JSON-RPC response', async () => {
		const response = '{"jsonrpc":"2.0","id":1,"result":"test"}'
		const result = await Effect.runPromise(
			program(
				Effect.gen(function* (_) {
					const service = yield* _(Effect.get(JsonRpcResponseEffectTag))
					return yield* _(service.parseResponseEffect(response))
				}),
			),
		)

		expect(result).toHaveProperty('id', 1)
		expect(result).toHaveProperty('result', 'test')
		expect(result).toHaveProperty('jsonrpc', '2.0')
	})

	it('should validate a valid JSON-RPC response', async () => {
		const response: JsonRpcResponseEffect = {
			jsonrpc: '2.0',
			id: 1,
			result: 'test',
		}

		const result = await Effect.runPromise(
			program(
				Effect.gen(function* (_) {
					const service = yield* _(Effect.get(JsonRpcResponseEffectTag))
					return yield* _(service.validateResponseEffect(response))
				}),
			),
		)

		expect(result).toBe(true)
	})

	it('should get response result', async () => {
		const response: JsonRpcResponseEffect = {
			jsonrpc: '2.0',
			id: 1,
			result: 'test',
		}

		const result = await Effect.runPromise(
			program(
				Effect.gen(function* (_) {
					const service = yield* _(Effect.get(JsonRpcResponseEffectTag))
					return yield* _(service.getResponseResultEffect(response))
				}),
			),
		)

		expect(result).toBe('test')
	})

	it('should get response error', async () => {
		const response: JsonRpcResponseEffect = {
			jsonrpc: '2.0',
			id: 1,
			error: {
				code: -32603,
				message: 'Internal error',
			},
		}

		const result = await Effect.runPromise(
			program(
				Effect.gen(function* (_) {
					const service = yield* _(Effect.get(JsonRpcResponseEffectTag))
					return yield* _(service.getResponseErrorEffect(response))
				}),
			),
		)

		expect(result).toHaveProperty('code', -32603)
		expect(result).toHaveProperty('message', 'Internal error')
	})

	it('should handle invalid JSON-RPC response', async () => {
		const response = 'invalid json'

		await expect(
			Effect.runPromise(
				program(
					Effect.gen(function* (_) {
						const service = yield* _(Effect.get(JsonRpcResponseEffectTag))
						return yield* _(service.parseResponseEffect(response))
					}),
				),
			),
		).rejects.toThrow(BaseErrorEffect)
	})
})
