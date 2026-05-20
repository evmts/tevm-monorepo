import { describe, expect, it } from 'vitest'
import { createLightClientConsensusService } from './createLightClientConsensusService.js'
import { createNoopConsensusService } from './createNoopConsensusService.js'

describe('createNoopConsensusService', () => {
	it('preserves trusted local-mode read verification', async () => {
		const consensus = createNoopConsensusService()

		expect(consensus.mode).toBe('noop')
		await expect(consensus.verifyRead?.({})).resolves.toBe(true)
	})
})

describe('createLightClientConsensusService', () => {
	it('starts from an idle, not-ready light sync status by default', () => {
		const consensus = createLightClientConsensusService({ verifyRead: async () => true })

		expect(consensus.mode).toBe('light-client')
		expect(consensus.isReady?.()).toBe(false)
		expect(consensus.getLightSyncStatus?.()).toEqual({
			ready: false,
			status: 'idle',
			network: 'unknown',
			checkpointSource: 'none',
			lastCheckpoint: null,
			optimisticSlot: 0n,
			safeSlot: 0n,
			finalizedSlot: 0n,
		})
	})

	it('normalizes safe and finalized slots against the optimistic head', () => {
		const consensus = createLightClientConsensusService({
			verifyRead: async () => true,
			initialLightSyncStatus: {
				ready: true,
				status: 'ready',
				network: 'mainnet',
				checkpointSource: 'explicit',
				lastCheckpoint: '0xabc',
				optimisticSlot: 10n,
				safeSlot: 12n,
				finalizedSlot: 20n,
			},
		})

		expect(consensus.getLightSyncStatus?.()).toMatchObject({
			optimisticSlot: 10n,
			safeSlot: 10n,
			finalizedSlot: 10n,
		})
	})

	it('updates status without exposing mutable internal state', () => {
		const consensus = createLightClientConsensusService({ verifyRead: async () => true })

		const updated = consensus.updateLightSyncStatus?.({
			ready: true,
			status: 'syncing',
			optimisticSlot: 32n,
			safeSlot: 31n,
			finalizedSlot: 30n,
		})
		if (!updated) throw new Error('expected updateLightSyncStatus')

		const mutableCopy = updated as { ready: boolean; safeSlot: bigint }
		mutableCopy.ready = false
		mutableCopy.safeSlot = 100n

		expect(consensus.isReady?.()).toBe(true)
		expect(consensus.getLightSyncStatus?.()).toMatchObject({
			ready: true,
			status: 'syncing',
			optimisticSlot: 32n,
			safeSlot: 31n,
			finalizedSlot: 30n,
		})
	})

	it('delegates proof verification and optional chain readers', async () => {
		const consensus = createLightClientConsensusService({
			verifyRead: async ({ selector }) => selector === 'safe',
			getChainId: async () => 11155111n,
			getBlockNumber: async () => 123n,
			resolveStateRoot: async () => `0x${'11'.repeat(32)}`,
			getProof: async () => ({
				balance: '0x1',
				nonce: '0x2',
				codeHash: `0x${'00'.repeat(32)}`,
				storageHash: `0x${'22'.repeat(32)}`,
				storageProof: [{ key: `0x${'00'.repeat(32)}`, value: '0x3' }],
			}),
		})

		await expect(consensus.verifyRead?.({ selector: 'safe' })).resolves.toBe(true)
		await expect(consensus.verifyRead?.({ selector: 'finalized' })).resolves.toBe(false)
		await expect(consensus.getChainId?.()).resolves.toBe(11155111n)
		await expect(consensus.getBlockNumber?.()).resolves.toBe(123n)
		await expect(consensus.resolveStateRoot?.('latest')).resolves.toBe(`0x${'11'.repeat(32)}`)
		await expect(
			consensus.getProof?.({
				address: `0x${'12'.repeat(20)}`,
				storageKeys: [`0x${'00'.repeat(32)}`],
				selector: 'latest',
			}),
		).resolves.toMatchObject({ balance: '0x1', nonce: '0x2' })
	})
})
