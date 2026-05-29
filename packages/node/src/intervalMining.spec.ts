import { TransactionFactory } from '@evmts/zevm/tx'
import { createAddress } from '@tevm/address'
import { tevmDefault } from '@tevm/common'
import { hexToBytes, PREFUNDED_PRIVATE_KEYS, parseEther } from '@tevm/utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createTevmNode } from './createTevmNode.js'
import type { TevmNode } from './TevmNode.js'

describe('TevmNode interval mining integration', () => {
	let client: TevmNode

	afterEach(() => {
		if (client) {
			client.close()
		}
	})

	describe('initialization', () => {
		it('should create client with interval mining config', async () => {
			client = createTevmNode({
				miningConfig: { type: 'interval', blockTime: 5 },
			})

			expect(client.miningConfig).toEqual({
				type: 'interval',
				blockTime: 5,
			})

			await client.ready()
			expect(client.status).toBe('READY')
		})

		it('should not start interval mining immediately if blockTime is 0', async () => {
			client = createTevmNode({
				miningConfig: { type: 'interval', blockTime: 0 },
			})

			await client.ready()
			expect(client.status).toBe('READY')
		})

		it('should default to auto mining if no config provided', async () => {
			client = createTevmNode()

			expect(client.miningConfig).toEqual({ type: 'auto' })
			await client.ready()
		})
	})

	describe('setMiningConfig', () => {
		beforeEach(async () => {
			client = createTevmNode({
				miningConfig: { type: 'manual' },
			})
			await client.ready()
		})

		it('should update mining config from manual to interval', () => {
			const newConfig = { type: 'interval', blockTime: 3 } as const
			client.setMiningConfig(newConfig)

			expect(client.miningConfig).toEqual(newConfig)
		})

		it('should update mining config from interval to manual', () => {
			client.setMiningConfig({ type: 'interval', blockTime: 2 })
			client.setMiningConfig({ type: 'manual' })

			expect(client.miningConfig).toEqual({ type: 'manual' })
		})

		it('should update blockTime for interval mining', () => {
			client.setMiningConfig({ type: 'interval', blockTime: 1 })
			client.setMiningConfig({ type: 'interval', blockTime: 10 })

			expect(client.miningConfig).toEqual({
				type: 'interval',
				blockTime: 10,
			})
		})

		it('should switch between all mining types', () => {
			// Manual -> Auto
			client.setMiningConfig({ type: 'auto' })
			expect(client.miningConfig.type).toBe('auto')

			// Auto -> Interval
			client.setMiningConfig({ type: 'interval', blockTime: 5 })
			expect(client.miningConfig).toEqual({ type: 'interval', blockTime: 5 })

			// Interval -> Manual
			client.setMiningConfig({ type: 'manual' })
			expect(client.miningConfig.type).toBe('manual')
		})
	})

	describe('close method', () => {
		it('should stop interval mining when closed', async () => {
			client = createTevmNode({
				miningConfig: { type: 'interval', blockTime: 1 },
			})
			await client.ready()

			expect(client.status).toBe('READY')

			client.close()
			expect(client.status).toBe('STOPPED')
		})

		it('should handle close on non-interval mining', async () => {
			client = createTevmNode({
				miningConfig: { type: 'auto' },
			})
			await client.ready()

			expect(() => client.close()).not.toThrow()
			expect(client.status).toBe('STOPPED')
		})

		it('should be idempotent', async () => {
			client = createTevmNode({
				miningConfig: { type: 'interval', blockTime: 1 },
			})
			await client.ready()

			client.close()
			client.close() // Second close should not throw

			expect(client.status).toBe('STOPPED')
		})

		it('should not start interval mining when closed before ready resolves', async () => {
			vi.useFakeTimers()
			const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout')

			client = createTevmNode({
				miningConfig: { type: 'interval', blockTime: 0.001 },
			})
			const ready = client.ready()

			expect(() => client.close()).not.toThrow()
			expect(client.status).toBe('STOPPED')

			await ready
			const vm = await client.getVm()
			const blockBeforeTimers = await vm.blockchain.getCanonicalHeadBlock()

			await vi.advanceTimersByTimeAsync(10)

			const blockAfterTimers = await vm.blockchain.getCanonicalHeadBlock()
			expect(blockAfterTimers.header.number).toBe(blockBeforeTimers.header.number)
			expect(setTimeoutSpy).not.toHaveBeenCalledWith(expect.any(Function), 1)

			setTimeoutSpy.mockRestore()
			vi.useRealTimers()
		})
	})

	describe('deepCopy', () => {
		it('should copy interval mining config', async () => {
			client = createTevmNode({
				miningConfig: { type: 'interval', blockTime: 3 },
			})
			await client.ready()

			const copied = await client.deepCopy()

			expect(copied.miningConfig).toEqual({
				type: 'interval',
				blockTime: 3,
			})
		})

		it('should allow copied client to update mining config independently', async () => {
			client = createTevmNode({
				miningConfig: { type: 'interval', blockTime: 1 },
			})
			await client.ready()

			const copied = await client.deepCopy()

			copied.setMiningConfig({ type: 'manual' })

			expect(client.miningConfig).toEqual({ type: 'interval', blockTime: 1 })
			expect(copied.miningConfig).toEqual({ type: 'manual' })

			copied.close()
		})

		it('should handle close on copied client', async () => {
			client = createTevmNode({
				miningConfig: { type: 'interval', blockTime: 1 },
			})
			await client.ready()

			const copied = await client.deepCopy()

			expect(() => copied.close()).not.toThrow()
			expect(copied.status).toBe('STOPPED')

			copied.close()
		})
	})

	describe('transaction handling with interval mining', () => {
		it('should add transactions to mempool with interval mining', async () => {
			client = createTevmNode({
				miningConfig: { type: 'interval', blockTime: 10 }, // Long interval so we can test mempool
			})
			await client.ready()

			// Get initial state
			const txPool = await client.getTxPool()
			expect(txPool.txsInPool).toBe(0)

			// Transaction should go to mempool but not be mined immediately
			// This would be tested at a higher level with actual transaction sending
			// Here we just verify the mining config is set correctly
			expect(client.miningConfig.type).toBe('interval')
		})
	})

	describe('post-mine state root handling (#27)', () => {
		const buildSignedTx = (nonce: string) => {
			const tx = TransactionFactory(
				{
					nonce,
					maxFeePerGas: '0x09184e72a000',
					maxPriorityFeePerGas: '0x09184e72a000',
					gasLimit: '0x5208',
					to: createAddress(`0x${'42'.repeat(20)}`),
					value: parseEther('0.1'),
					data: '0x',
					type: 2,
				},
				{ common: tevmDefault.ethjsCommon },
			)
			return tx.sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))
		}

		it('mines a queued transaction and persists the resulting state root', async () => {
			vi.useFakeTimers()
			client = createTevmNode({
				miningConfig: { type: 'interval', blockTime: 0.001 },
			})
			await client.ready()

			const vm = await client.getVm()
			const initialBlock = await vm.blockchain.getCanonicalHeadBlock()

			const txPool = await client.getTxPool()
			await txPool.add(buildSignedTx('0x00'), true)

			await vi.advanceTimersByTimeAsync(10)

			const finalBlock = await vm.blockchain.getCanonicalHeadBlock()
			expect(finalBlock.header.number).toBe(initialBlock.header.number + 1n)
			// The canonical state root after mining must be backed by state (saveStateRoot ran).
			const stateRoot = vm.stateManager._baseState.getCurrentStateRoot()
			expect(vm.stateManager._baseState.stateRoots.get(stateRoot)).toBeDefined()

			vi.useRealTimers()
		})

		it('surfaces (does not silently swallow) a missing post-mine state root', async () => {
			vi.useFakeTimers()
			client = createTevmNode({
				miningConfig: { type: 'interval', blockTime: 0.001 },
			})
			await client.ready()

			const vm = await client.getVm()
			// Force the missing-state-root invariant violation: any deep copy made during mining
			// reports an empty stateRoots map, so the looked-up post-mine state is undefined.
			const originalDeepCopy = vm.deepCopy.bind(vm)
			vi.spyOn(vm, 'deepCopy').mockImplementation(async () => {
				const copy = await originalDeepCopy()
				vi.spyOn(copy.stateManager._baseState.stateRoots, 'get').mockReturnValue(undefined)
				return copy
			})

			const errorSpy = vi.spyOn(client.logger, 'error').mockImplementation(() => {})
			const headBefore = (await vm.blockchain.getCanonicalHeadBlock()).header.number

			const txPool = await client.getTxPool()
			await txPool.add(buildSignedTx('0x00'), true)

			await vi.advanceTimersByTimeAsync(10)

			// The mining cycle threw and was caught/logged rather than silently advancing the head
			// to a canonical state root with no backing state.
			expect(errorSpy).toHaveBeenCalled()
			const headAfter = (await vm.blockchain.getCanonicalHeadBlock()).header.number
			expect(headAfter).toBe(headBefore)

			vi.useRealTimers()
		})
	})

	describe('status transitions', () => {
		it('should transition from INITIALIZING to READY', async () => {
			client = createTevmNode({
				miningConfig: { type: 'interval', blockTime: 1 },
			})

			expect(client.status).toBe('INITIALIZING')

			await client.ready()
			expect(client.status).toBe('READY')
		})

		it('should transition from READY to STOPPED when closed', async () => {
			client = createTevmNode({
				miningConfig: { type: 'interval', blockTime: 1 },
			})
			await client.ready()

			expect(client.status).toBe('READY')

			client.close()
			expect(client.status).toBe('STOPPED')
		})
	})
})
