import { Effect } from 'effect'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { StateOverridesEffectLive, StateOverridesEffectService } from './StateOverridesEffect.js'

// Mock the StateOverrides module
const mockFromRpc = vi.fn()
const mockToRpc = vi.fn()

vi.mock('ox/StateOverrides', () => ({
	fromRpc: (...args: any[]) => mockFromRpc(...args),
	toRpc: (...args: any[]) => mockToRpc(...args),
}))

describe('StateOverridesEffect', () => {
	const stateOverrides: StateOverridesEffectService = StateOverridesEffectLive

	beforeEach(() => {
		vi.resetAllMocks()
	})

	describe('fromRpcEffect', () => {
		it('should convert RPC state overrides to StateOverrides', async () => {
			const mockRpcStateOverrides = {
				'0x0000000000000000000000000000000000000000': {
					balance: '0x1',
					code: '0x1234',
				},
			}

			const mockStateOverrides = {
				'0x0000000000000000000000000000000000000000': {
					balance: 1n,
					code: '0x1234',
				},
			}

			mockFromRpc.mockReturnValue(mockStateOverrides)

			const result = await Effect.runPromise(stateOverrides.fromRpcEffect(mockRpcStateOverrides))

			expect(result).toBe(mockStateOverrides)
			expect(mockFromRpc).toHaveBeenCalledWith(mockRpcStateOverrides)
		})

		it('should handle errors properly', async () => {
			const mockRpcStateOverrides = {
				'0x0000000000000000000000000000000000000000': {
					balance: 'invalid',
				},
			}

			const error = new Error('Invalid RPC state overrides')
			mockFromRpc.mockImplementation(() => {
				throw error
			})

			try {
				await Effect.runPromise(stateOverrides.fromRpcEffect(mockRpcStateOverrides as any))
				// Should not reach here
				expect(true).toBe(false)
			} catch (err) {
				expect(err).toBeDefined()
				expect(err.message).toContain('An unknown error occurred in Effect.try')
			}
		})
	})

	describe('toRpcEffect', () => {
		it('should convert StateOverrides to RPC state overrides', async () => {
			const mockStateOverrides = {
				'0x0000000000000000000000000000000000000000': {
					balance: 1n,
					code: '0x1234',
				},
			}

			const mockRpcStateOverrides = {
				'0x0000000000000000000000000000000000000000': {
					balance: '0x1',
					code: '0x1234',
				},
			}

			mockToRpc.mockReturnValue(mockRpcStateOverrides)

			const result = await Effect.runPromise(stateOverrides.toRpcEffect(mockStateOverrides))

			expect(result).toBe(mockRpcStateOverrides)
			expect(mockToRpc).toHaveBeenCalledWith(mockStateOverrides)
		})

		it('should handle errors properly', async () => {
			const mockStateOverrides = {
				'0x0000000000000000000000000000000000000000': {
					balance: 'invalid',
				},
			}

			const error = new Error('Invalid state overrides')
			mockToRpc.mockImplementation(() => {
				throw error
			})

			try {
				await Effect.runPromise(stateOverrides.toRpcEffect(mockStateOverrides as any))
				// Should not reach here
				expect(true).toBe(false)
			} catch (err) {
				expect(err).toBeDefined()
				expect(err.message).toContain('An unknown error occurred in Effect.try')
			}
		})
	})
})
