import { InternalError } from '@tevm/errors'
import { createTevmNode } from '@tevm/node'
import { transports } from '@tevm/test-utils'
import { describe, expect, it } from 'vitest'
import { forkAndCacheBlock } from './forkAndCacheBlock.js'

describe('forkAndCacheBlock', () => {
	it('should throw an error if forkTransport is not provided', async () => {
		const client = createTevmNode({ miningConfig: { type: 'manual' } })
		const block = await client.getVm().then((vm) => vm.blockchain.getCanonicalHeadBlock())
		expect(forkAndCacheBlock(client, block)).rejects.toThrow(InternalError)
		expect(forkAndCacheBlock(client, block)).rejects.toThrow('Cannot forkAndCacheBlock without a fork url')
	})

	it('should fork a block and save the state root without executing block transactions', async () => {
		const client = createTevmNode({
			fork: { 
				transport: transports.mainnet,
				blockTag: 21961826n, // Updated to latest block as of Mar 2, 2025
			},
			miningConfig: { type: 'manual' },
		})
		const block = await client.getVm().then((vm) => vm.blockchain.getCanonicalHeadBlock())

		const vm = await forkAndCacheBlock(client, block, false)

		expect(await vm.stateManager.getStateRoot()).toEqual(block.header.stateRoot)
		expect(await vm.evm.stateManager.getStateRoot()).toEqual(block.header.stateRoot)
	})

	it(
		'should fork a block, execute transactions, and save the state root',
		async () => {
			const client = createTevmNode({
				fork: { 
					transport: transports.mainnet,
					blockTag: 21961826n, // Updated to latest block as of Mar 2, 2025
				},
				miningConfig: { type: 'manual' },
			})
			const block = await client.getVm().then((vm) => vm.blockchain.getCanonicalHeadBlock())

			const vm = await forkAndCacheBlock(client, block, true)

			const stateRoot = await vm.stateManager.getStateRoot()
			expect(stateRoot).toEqual(block.header.stateRoot)
		},
		{ timeout: 30_000 },
	)

	it(
		'should process block transactions',
		async () => {
			const client = createTevmNode({
				fork: { 
					transport: transports.mainnet,
					blockTag: 21961826n, // Updated to latest block as of Mar 2, 2025
				},
				miningConfig: { type: 'manual' },
			})
			const block = await client.getVm().then((vm) => vm.blockchain.getCanonicalHeadBlock())

			const vm = await forkAndCacheBlock(client, block, false)

			expect(await vm.stateManager.getStateRoot()).toEqual(block.header.stateRoot)
			expect(await vm.evm.stateManager.getStateRoot()).toEqual(block.header.stateRoot)
		},
		{ timeout: 30_000 },
	)
})