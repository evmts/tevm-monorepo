import { describe, expect, it, vi } from 'vitest'
import {
	toBeAccount,
	toBeMined,
	toChangeBalance,
	toChangeTokenBalance,
	toConsumeGas,
	toConsumeGasGreaterThan,
	toConsumeGasLessThan,
	toConsumeGasNativeToken,
	toContainTransactions,
	toCreateAddresses,
	toHaveState,
	toHaveStorage,
	toHaveStorageAt,
	toTransfer,
	toTransferTokens,
} from './index.js'
import type { TevmClient } from './types/index.js'

// Mock client for testing
const createMockClient = (): TevmClient => ({
	getAccount: vi.fn(),
	getStorageAt: vi.fn(),
	getCode: vi.fn(),
	getBalance: vi.fn(),
	simulateContract: vi.fn(),
	call: vi.fn(),
})

describe('@tevm/test-matchers', () => {
	describe('Storage/State Matchers', () => {
		describe('toHaveState', () => {
			it('should pass when account has expected state', async () => {
				const client = createMockClient()
				client.getAccount = vi.fn().mockResolvedValue({
					address: '0x742d35Cc6634C0532925a3b8D9C9c8d2F4dbb8E4',
					balance: 100n,
					nonce: 1,
				})
				client.getCode = vi.fn().mockResolvedValue('0x6080604052')

				const result = await toHaveState('0x742d35Cc6634C0532925a3b8D9C9c8d2F4dbb8E4', client, {
					balance: 100n,
					nonce: 1,
					code: '0x6080604052',
				})

				expect(result.pass).toBe(true)
			})

			it('should fail when account has different state', async () => {
				const client = createMockClient()
				client.getAccount = vi.fn().mockResolvedValue({
					address: '0x742d35Cc6634C0532925a3b8D9C9c8d2F4dbb8E4',
					balance: 200n,
					nonce: 2,
				})

				const result = await toHaveState('0x742d35Cc6634C0532925a3b8D9C9c8d2F4dbb8E4', client, {
					balance: 100n,
					nonce: 1,
				})

				expect(result.pass).toBe(false)
				expect(result.message()).toContain('mismatches')
			})

			it('should fail when account does not exist', async () => {
				const client = createMockClient()
				client.getAccount = vi.fn().mockResolvedValue(null)

				const result = await toHaveState('0x742d35Cc6634C0532925a3b8D9C9c8d2F4dbb8E4', client, { balance: 100n })

				expect(result.pass).toBe(false)
				expect(result.message()).toContain('not found')
			})
		})

		describe('toHaveStorage', () => {
			it('should pass when contract has expected storage', async () => {
				const client = createMockClient()
				client.getStorageAt = vi
					.fn()
					.mockResolvedValueOnce('0x1234567890abcdef')
					.mockResolvedValueOnce('0x0000000000000001')

				const result = await toHaveStorage('0x742d35Cc6634C0532925a3b8D9C9c8d2F4dbb8E4', client, {
					'0x0': '0x1234567890abcdef',
					'0x1': '0x0000000000000001',
				})

				expect(result.pass).toBe(true)
			})

			it('should fail when storage values differ', async () => {
				const client = createMockClient()
				client.getStorageAt = vi.fn().mockResolvedValue('0xdifferentvalue')

				const result = await toHaveStorage('0x742d35Cc6634C0532925a3b8D9C9c8d2F4dbb8E4', client, {
					'0x0': '0x1234567890abcdef',
				})

				expect(result.pass).toBe(false)
				expect(result.message()).toContain('mismatches')
			})
		})

		describe('toHaveStorageAt', () => {
			it('should pass when single storage slot has expected value', async () => {
				const client = createMockClient()
				client.getStorageAt = vi.fn().mockResolvedValue('0x1234567890abcdef')

				const result = await toHaveStorageAt('0x742d35Cc6634C0532925a3b8D9C9c8d2F4dbb8E4', client, {
					slot: '0x0',
					value: '0x1234567890abcdef',
				})

				expect(result.pass).toBe(true)
			})

			it('should pass when multiple storage slots have expected values', async () => {
				const client = createMockClient()
				client.getStorageAt = vi
					.fn()
					.mockResolvedValueOnce('0x1234567890abcdef')
					.mockResolvedValueOnce('0x0000000000000001')

				const result = await toHaveStorageAt('0x742d35Cc6634C0532925a3b8D9C9c8d2F4dbb8E4', client, [
					{ slot: '0x0', value: '0x1234567890abcdef' },
					{ slot: '0x1', value: '0x0000000000000001' },
				])

				expect(result.pass).toBe(true)
			})
		})

		describe('toBeAccount', () => {
			it('should pass when account exists', async () => {
				const client = createMockClient()
				client.getAccount = vi.fn().mockResolvedValue({
					address: '0x742d35Cc6634C0532925a3b8D9C9c8d2F4dbb8E4',
					balance: 100n,
					nonce: 1,
				})

				const result = await toBeAccount('0x742d35Cc6634C0532925a3b8D9C9c8d2F4dbb8E4', client)

				expect(result.pass).toBe(true)
			})

			it('should pass when account is EOA and type matches', async () => {
				const client = createMockClient()
				client.getAccount = vi.fn().mockResolvedValue({
					address: '0x742d35Cc6634C0532925a3b8D9C9c8d2F4dbb8E4',
					balance: 100n,
					nonce: 1,
				})
				client.getCode = vi.fn().mockResolvedValue('0x')

				const result = await toBeAccount('0x742d35Cc6634C0532925a3b8D9C9c8d2F4dbb8E4', client, 'EOA')

				expect(result.pass).toBe(true)
			})

			it('should pass when account is contract and type matches', async () => {
				const client = createMockClient()
				client.getAccount = vi.fn().mockResolvedValue({
					address: '0x742d35Cc6634C0532925a3b8D9C9c8d2F4dbb8E4',
					balance: 100n,
					nonce: 1,
				})
				client.getCode = vi.fn().mockResolvedValue('0x6080604052')

				const result = await toBeAccount('0x742d35Cc6634C0532925a3b8D9C9c8d2F4dbb8E4', client, 'contract')

				expect(result.pass).toBe(true)
			})

			it('should support withState chaining', async () => {
				const client = createMockClient()
				client.getAccount = vi.fn().mockResolvedValue({
					address: '0x742d35Cc6634C0532925a3b8D9C9c8d2F4dbb8E4',
					balance: 100n,
					nonce: 1,
				})

				const result = await toBeAccount('0x742d35Cc6634C0532925a3b8D9C9c8d2F4dbb8E4', client)

				const stateResult = await result.withState({ balance: 100n, nonce: 1 })
				expect(stateResult.pass).toBe(true)
			})
		})
	})

	describe('Transaction Matchers', () => {
		describe('toConsumeGas', () => {
			it('should pass when gas consumption matches exactly', async () => {
				const client = createMockClient()
				client.call = vi.fn().mockResolvedValue({ gasUsed: 21000n })

				const transaction = { to: '0x742d35Cc6634C0532925a3b8D9C9c8d2F4dbb8E4' }
				const result = await toConsumeGas(transaction, client, 21000n)

				expect(result.pass).toBe(true)
			})

			it('should pass when gas consumption is less than expected', async () => {
				const client = createMockClient()
				client.call = vi.fn().mockResolvedValue({ gasUsed: 20000n })

				const transaction = { to: '0x742d35Cc6634C0532925a3b8D9C9c8d2F4dbb8E4' }
				const result = await toConsumeGasLessThan(transaction, client, 21000n)

				expect(result.pass).toBe(true)
			})

			it('should pass when gas consumption is greater than expected', async () => {
				const client = createMockClient()
				client.call = vi.fn().mockResolvedValue({ gasUsed: 22000n })

				const transaction = { to: '0x742d35Cc6634C0532925a3b8D9C9c8d2F4dbb8E4' }
				const result = await toConsumeGasGreaterThan(transaction, client, 21000n)

				expect(result.pass).toBe(true)
			})
		})

		describe('toConsumeGasNativeToken', () => {
			it('should calculate gas cost in native token units', async () => {
				const client = createMockClient()
				client.call = vi.fn().mockResolvedValue({ gasUsed: 21000n })

				const transaction = {
					to: '0x742d35Cc6634C0532925a3b8D9C9c8d2F4dbb8E4',
					gasPrice: 1000000000n, // 1 gwei
				}
				const expectedCost = 21000n * 1000000000n // 21000 gas * 1 gwei
				const result = await toConsumeGasNativeToken(transaction, client, expectedCost)

				expect(result.pass).toBe(true)
			})
		})

		describe('toChangeBalance', () => {
			it('should handle basic balance change scenarios', async () => {
				const client = createMockClient()
				client.getBalance = vi.fn().mockResolvedValue(1000n)
				client.call = vi.fn().mockResolvedValue({ success: true })

				const transaction = {
					to: '0x742d35Cc6634C0532925a3b8D9C9c8d2F4dbb8E4',
					value: 100n,
					from: '0x8ba1f109551bD432803012645Hac136c7B2c9f9',
				}

				// Test recipient receiving funds
				const result = await toChangeBalance(transaction, client, '0x742d35Cc6634C0532925a3b8D9C9c8d2F4dbb8E4', 100n)

				expect(result.pass).toBe(true)
			})

			it('should handle when transaction does not change balance', async () => {
				const client = createMockClient()
				client.getBalance = vi.fn().mockResolvedValue(1000n)
				client.call = vi.fn().mockResolvedValue({ success: true })

				const transaction = {
					to: '0xDifferentAddress',
					value: 100n,
					from: '0x8ba1f109551bD432803012645Hac136c7B2c9f9',
				}

				// Test address that is not involved in the transaction
				const result = await toChangeBalance(
					transaction,
					client,
					'0x742d35Cc6634C0532925a3b8D9C9c8d2F4dbb8E4',
					0n, // Should be no change
				)

				expect(result.pass).toBe(true)
			})
		})

		describe('Placeholder matchers', () => {
			it('should indicate toChangeTokenBalance is not implemented', async () => {
				const client = createMockClient()
				const transaction = { to: '0x742d35Cc6634C0532925a3b8D9C9c8d2F4dbb8E4' }

				const result = await toChangeTokenBalance(transaction, client, '0xTokenAddress', '0xAccountAddress', 100n)

				expect(result.pass).toBe(false)
				expect(result.message()).toContain('not yet fully implemented')
			})

			it('should indicate toTransfer is not implemented', async () => {
				const client = createMockClient()
				const transaction = { to: '0x742d35Cc6634C0532925a3b8D9C9c8d2F4dbb8E4' }

				const result = await toTransfer(transaction, client, {
					from: '0xFrom',
					to: '0xTo',
					amount: 100n,
				})

				expect(result.pass).toBe(false)
				expect(result.message()).toContain('not yet fully implemented')
			})

			it('should indicate toTransferTokens is not implemented', async () => {
				const client = createMockClient()
				const transaction = { to: '0x742d35Cc6634C0532925a3b8D9C9c8d2F4dbb8E4' }

				const result = await toTransferTokens(transaction, client, [
					{
						token: '0xToken',
						from: '0xFrom',
						to: '0xTo',
						amount: 100n,
					},
				])

				expect(result.pass).toBe(false)
				expect(result.message()).toContain('not yet fully implemented')
			})
		})
	})

	describe('Block Matchers', () => {
		describe('toBeMined', () => {
			it('should indicate toBeMined is not implemented', async () => {
				const client = createMockClient()
				const transaction = { to: '0x742d35Cc6634C0532925a3b8D9C9c8d2F4dbb8E4' }

				const result = await toBeMined(transaction, client)

				expect(result.pass).toBe(false)
				expect(result.message()).toContain('not yet fully implemented')
			})

			it('should support withBlockNumber chaining', async () => {
				const client = createMockClient()
				const transaction = { to: '0x742d35Cc6634C0532925a3b8D9C9c8d2F4dbb8E4' }

				const result = await toBeMined(transaction, client)
				const chainedResult = await result.withBlockNumber(100n)

				expect(chainedResult.pass).toBe(false)
				expect(chainedResult.message()).toContain('withBlockNumber')
			})
		})

		describe('toContainTransactions', () => {
			it('should indicate toContainTransactions is not implemented', async () => {
				const client = createMockClient()

				const result = await toContainTransactions('0xBlockHash', client, ['0xTxHash1', '0xTxHash2'])

				expect(result.pass).toBe(false)
				expect(result.message()).toContain('not yet fully implemented')
			})
		})
	})
})
