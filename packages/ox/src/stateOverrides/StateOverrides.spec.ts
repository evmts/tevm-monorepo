import { Effect } from 'effect'
import Ox from 'ox'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as StateOverrides from './StateOverrides.js'

vi.mock('ox', () => {
	return {
		default: {
			StateOverrides: {
				fromRpc: vi.fn(),
				toRpc: vi.fn(),
			},
		},
	}
})

describe('StateOverrides', () => {
	beforeEach(() => {
		vi.resetAllMocks()
	})

	describe('fromRpc', () => {
		it('should convert RPC state overrides to StateOverrides successfully', async () => {
			const mockRpcStateOverrides = {
				'0x0000000000000000000000000000000000000000': {
					balance: '0x1',
					code: '0x1234',
					nonce: '0x1',
					state: {
						'0x0000000000000000000000000000000000000000000000000000000000000001':
							'0x0000000000000000000000000000000000000000000000000000000000000002',
					},
				},
			}

			const mockStateOverrides = {
				'0x0000000000000000000000000000000000000000': {
					balance: 1n,
					code: '0x1234',
					nonce: 1n,
					state: {
						'0x0000000000000000000000000000000000000000000000000000000000000001':
							'0x0000000000000000000000000000000000000000000000000000000000000002',
					},
				},
			}

			vi.mocked(Ox.StateOverrides.fromRpc).mockReturnValue(mockStateOverrides)

			const result = await Effect.runPromise(StateOverrides.fromRpc(mockRpcStateOverrides))

			expect(Ox.StateOverrides.fromRpc).toHaveBeenCalledTimes(1)
			expect(Ox.StateOverrides.fromRpc).toHaveBeenCalledWith(mockRpcStateOverrides)
			expect(result).toEqual(mockStateOverrides)
		})

		it('should handle errors', async () => {
			const mockRpcStateOverrides = {
				'0x0000000000000000000000000000000000000000': {
					balance: 'invalid', // Invalid balance
				},
			}

			const error = new Error('Invalid RPC state overrides')
			vi.mocked(Ox.StateOverrides.fromRpc).mockImplementation(() => {
				throw error
			})

			const effect = StateOverrides.fromRpc(mockRpcStateOverrides)

			await expect(Effect.runPromise(effect)).rejects.toThrow(StateOverrides.FromRpcError)
			await expect(Effect.runPromise(effect)).rejects.toMatchObject({
				name: 'FromRpcError',
				_tag: 'FromRpcError',
				cause: error,
			})
		})
	})

	describe('toRpc', () => {
		it('should convert StateOverrides to RPC state overrides successfully', async () => {
			const mockStateOverrides = {
				'0x0000000000000000000000000000000000000000': {
					balance: 1n,
					code: '0x1234',
					nonce: 1n,
					state: {
						'0x0000000000000000000000000000000000000000000000000000000000000001':
							'0x0000000000000000000000000000000000000000000000000000000000000002',
					},
				},
			}

			const mockRpcStateOverrides = {
				'0x0000000000000000000000000000000000000000': {
					balance: '0x1',
					code: '0x1234',
					nonce: '0x1',
					state: {
						'0x0000000000000000000000000000000000000000000000000000000000000001':
							'0x0000000000000000000000000000000000000000000000000000000000000002',
					},
				},
			}

			vi.mocked(Ox.StateOverrides.toRpc).mockReturnValue(mockRpcStateOverrides)

			const result = await Effect.runPromise(StateOverrides.toRpc(mockStateOverrides))

			expect(Ox.StateOverrides.toRpc).toHaveBeenCalledTimes(1)
			expect(Ox.StateOverrides.toRpc).toHaveBeenCalledWith(mockStateOverrides)
			expect(result).toEqual(mockRpcStateOverrides)
		})

		it('should handle errors', async () => {
			const mockStateOverrides = {
				'0x0000000000000000000000000000000000000000': {
					balance: 'invalid', // Invalid balance
				},
			}

			const error = new Error('Invalid state overrides')
			vi.mocked(Ox.StateOverrides.toRpc).mockImplementation(() => {
				throw error
			})

			const effect = StateOverrides.toRpc(mockStateOverrides)

			await expect(Effect.runPromise(effect)).rejects.toThrow(StateOverrides.ToRpcError)
			await expect(Effect.runPromise(effect)).rejects.toMatchObject({
				name: 'ToRpcError',
				_tag: 'ToRpcError',
				cause: error,
			})
		})
	})
})
