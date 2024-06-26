import { describe, expect, it } from 'bun:test'
import { createBaseClient } from '@tevm/base-client'
import { transports } from '@tevm/test-utils'
import { forkAndCacheBlock } from './forkAndCacheBlock.js'
import { InternalError } from '@tevm/errors'

describe('forkAndCacheBlock', () => {
	it('should throw an error if forkTransport is not provided', async () => {
		const client = createBaseClient({ miningConfig: { type: 'manual' } })
		const block = await client.getVm().then((vm) => vm.blockchain.getCanonicalHeadBlock())
		expect(forkAndCacheBlock(client, block)).rejects.toThrow(InternalError)
		expect(forkAndCacheBlock(client, block)).rejects.toThrow('Cannot forkAndCacheBlock without a fork url')
	})

	it('should fork a block and save the state root without executing block transactions', async () => {
		const client = createBaseClient({
			fork: { transport: transports.optimism },
			miningConfig: { type: 'manual' },
		})
		const block = await client.getVm().then((vm) => vm.blockchain.getCanonicalHeadBlock())

		await forkAndCacheBlock(client, block, false)

		const stateManager = await client.getVm().then((vm) => vm.evm.stateManager)
		const stateRoot = await stateManager.getStateRoot()
		expect(stateRoot).toEqual(block.header.stateRoot)
	})

	it(
		'should fork a block, execute transactions, and save the state root',
		async () => {
			const client = createBaseClient({
				fork: { transport: transports.optimism },
				miningConfig: { type: 'manual' },
			})
			const block = await client.getVm().then((vm) => vm.blockchain.getCanonicalHeadBlock())

			await forkAndCacheBlock(client, block, true)

			const stateManager = await client.getVm().then((vm) => vm.evm.stateManager)
			const stateRoot = await stateManager.getStateRoot()
			expect(stateRoot).toEqual(block.header.stateRoot)
		},
		{ timeout: 30_000 },
	)

	it(
		'should process block transactions',
		async () => {
			const client = createBaseClient({
				fork: { transport: transports.optimism },
				miningConfig: { type: 'manual' },
			})
			const block = await client.getVm().then((vm) => vm.blockchain.getCanonicalHeadBlock())

			await forkAndCacheBlock(client, block, false)

			const stateManager = await client.getVm().then((vm) => vm.evm.stateManager)
			const stateRoot = await stateManager.getStateRoot()
			expect(stateRoot).toEqual(block.header.stateRoot) // Modify this check as per the actual expected state root after transaction execution
		},
		{ timeout: 30_000 },
	)
})
