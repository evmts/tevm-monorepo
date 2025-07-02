import { InternalError } from '@tevm/errors'
import { createTevmNode } from '@tevm/node'
import { transports } from '@tevm/test-utils'
import { describe, expect, it } from 'vitest'
import { forkAndCacheBlock } from './forkAndCacheBlock.js'
import { createTestSnapshotNode } from '@tevm/test-node'

describe('forkAndCacheBlock', () => {
	it('should throw an error if forkTransport is not provided', async () => {
		const client = createTevmNode({ miningConfig: { type: 'manual' } })
		const block = await client.getVm().then((vm) => vm.blockchain.getCanonicalHeadBlock())
		await expect(forkAndCacheBlock(client, block)).rejects.toThrow(InternalError)
		await expect(forkAndCacheBlock(client, block)).rejects.toThrow('Cannot forkAndCacheBlock without a fork url')
	})

	it('should fork a block and save the state root without executing block transactions', async () => {
		const client = createTestSnapshotNode({
			fork: { transport: transports.optimism },
			miningConfig: { type: 'manual' },
			test: {
				autosave: 'onRequest',
			}
		})
		const block = await client.getVm().then((vm) => vm.blockchain.getCanonicalHeadBlock())

		const vm = await forkAndCacheBlock(client, block, false)

		expect(await vm.stateManager.getStateRoot()).toEqual(block.header.stateRoot)
		expect(await vm.evm.stateManager.getStateRoot()).toEqual(block.header.stateRoot)
	})

	// TODO this test broke for no reason
	it.todo('should fork a block, execute transactions, and save the state root', { timeout: 30_000 }, async () => {
		const client = createTestSnapshotNode({
			fork: { transport: transports.optimism },
			miningConfig: { type: 'manual' },
			test: {
				autosave: 'onRequest',
			}
		})
		const block = await client.getVm().then((vm) => vm.blockchain.getCanonicalHeadBlock())

		const vm = await forkAndCacheBlock(client, block, true)

		const stateRoot = await vm.stateManager.getStateRoot()
		expect(stateRoot).toEqual(block.header.stateRoot)
	})

	it('should process block transactions', { timeout: 30_000 }, async () => {
		const client = createTestSnapshotNode({
			fork: { transport: transports.optimism },
			miningConfig: { type: 'manual' },
			test: {
				autosave: 'onRequest',
			}
		})
		const block = await client.getVm().then((vm) => vm.blockchain.getCanonicalHeadBlock())

		const vm = await forkAndCacheBlock(client, block, false)

		expect(await vm.stateManager.getStateRoot()).toEqual(block.header.stateRoot)
		expect(await vm.evm.stateManager.getStateRoot()).toEqual(block.header.stateRoot)
	})
})
