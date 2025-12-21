import { ERC20 } from '@tevm/contract'
import { createTevmNode } from '@tevm/node'
import { numberToHex } from '@tevm/utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { createHandlers, type RequestHandlers } from './createHandlers.js'

const ERC20_ADDRESS = `0x${'69'.repeat(20)}` as const

describe('createHandlers', () => {
	let client: any
	let handlers: RequestHandlers

	beforeEach(async () => {
		client = createTevmNode()
		await client.ready()
		handlers = createHandlers(client)
	})

	it('should handle eth_chainId', async () => {
		const res = await handlers.eth_chainId({
			jsonrpc: '2.0',
			method: 'eth_chainId',
			id: 1,
		})
		expect(res).toMatchSnapshot()
	})

	it('should handle eth_call', async () => {
		const to = `0x${'69'.repeat(20)}` as const
		const res = await handlers.eth_call({
			jsonrpc: '2.0',
			method: 'eth_call',
			id: 1,
			params: [
				{
					from: to,
					to,
					data: '0x',
				},
				'latest',
			],
		})
		expect(res).toMatchSnapshot()
	})

	it('should handle eth_getBalance', async () => {
		const address = `0x${'69'.repeat(20)}` as const
		const res = await handlers.eth_getBalance({
			jsonrpc: '2.0',
			method: 'eth_getBalance',
			id: 1,
			params: [address, 'latest'],
		})
		expect(res).toMatchSnapshot()
	})

	it('should handle tevm_getAccount', async () => {
		await handlers.tevm_setAccount({
			jsonrpc: '2.0',
			method: 'tevm_setAccount',
			id: 1,
			params: [
				{
					address: ERC20_ADDRESS,
					deployedBytecode: ERC20.deployedBytecode,
					balance: numberToHex(420n),
					nonce: numberToHex(69n),
				},
			],
		})
		const res = await handlers.tevm_getAccount({
			jsonrpc: '2.0',
			method: 'tevm_getAccount',
			id: 1,
			params: [
				{
					address: ERC20_ADDRESS,
				},
			],
		})
		expect(res.error).toBeUndefined()
		expect(res).toMatchSnapshot
	})

	it('should handle eth_estimateGas', async () => {
		const to = `0x${'69'.repeat(20)}` as const
		const res = await handlers.eth_estimateGas({
			jsonrpc: '2.0',
			method: 'eth_estimateGas',
			id: 1,
			params: [
				{
					from: to,
					to,
					data: '0x',
				},
			],
		})
		expect(res).toMatchSnapshot()
	})

	it('should handle tevm_mine', async () => {
		const res = await handlers.tevm_miner({
			jsonrpc: '2.0',
			method: 'tevm_mine',
			id: 1,
			params: ['0x1', '0x1'],
		})
		expect(res.id).toBe(1)
		expect(res.error).toBeUndefined()
		expect(res.method).toBe('tevm_mine')
		expect(res.result?.blockHashes).toHaveLength(1)
	})

	it('should handle tevm_contract', async () => {
		const res = await handlers.tevm_contract({
			jsonrpc: '2.0',
			method: 'tevm_contract',
			id: 1,
		})
		expect(res).toMatchSnapshot()
	})

	// Add more tests for other handlers as needed...

	it('should handle eth_mining', async () => {
		const res = handlers.eth_mining({
			jsonrpc: '2.0',
			method: 'eth_mining',
			id: 1,
		})
		expect(res).toMatchSnapshot()
	})

	it('should handle eth_syncing', async () => {
		const res = handlers.eth_syncing({
			jsonrpc: '2.0',
			method: 'eth_syncing',
			id: 1,
		})
		expect(res).toMatchSnapshot()
	})

	describe('evm_increaseTime', () => {
		it('should increase block timestamp by the specified amount', async () => {
			// Get the current block to know the initial timestamp
			const vm = await client.getVm()
			const initialBlock = await vm.blockchain.getCanonicalHeadBlock()
			const initialTimestamp = initialBlock.header.timestamp

			// Increase time by 3600 seconds (1 hour)
			const res = await handlers.evm_increaseTime({
				jsonrpc: '2.0',
				method: 'evm_increaseTime',
				id: 1,
				params: [3600],
			})

			// Result should be the seconds increased as hex
			expect(res.result).toBe('0xe10')
			expect(res.jsonrpc).toBe('2.0')
			expect(res.method).toBe('evm_increaseTime')
			expect(res.id).toBe(1)

			// Mine a block to apply the new timestamp
			await handlers.anvil_mine({
				jsonrpc: '2.0',
				method: 'anvil_mine',
				id: 2,
				params: ['0x1', '0x0'],
			})

			// Verify the block has the increased timestamp
			const newBlock = await vm.blockchain.getCanonicalHeadBlock()
			expect(newBlock.header.timestamp).toBe(initialTimestamp + 3600n)
		})

		it('should handle large time increments', async () => {
			const vm = await client.getVm()
			const initialBlock = await vm.blockchain.getCanonicalHeadBlock()
			const initialTimestamp = initialBlock.header.timestamp

			// Increase by 1 year (31536000 seconds)
			const oneYear = 31536000
			const res = await handlers.evm_increaseTime({
				jsonrpc: '2.0',
				method: 'evm_increaseTime',
				id: 1,
				params: [oneYear],
			})

			expect(res.result).toBe(`0x${oneYear.toString(16)}`)

			// Mine and verify
			await handlers.anvil_mine({
				jsonrpc: '2.0',
				method: 'anvil_mine',
				id: 2,
				params: ['0x1', '0x0'],
			})

			const newBlock = await vm.blockchain.getCanonicalHeadBlock()
			expect(newBlock.header.timestamp).toBe(initialTimestamp + BigInt(oneYear))
		})
	})

	describe('anvil_increaseTime', () => {
		it('should work the same as evm_increaseTime', async () => {
			const vm = await client.getVm()
			const initialBlock = await vm.blockchain.getCanonicalHeadBlock()
			const initialTimestamp = initialBlock.header.timestamp

			const res = await handlers.anvil_increaseTime({
				jsonrpc: '2.0',
				method: 'anvil_increaseTime',
				id: 1,
				params: [7200], // 2 hours
			})

			expect(res.result).toBe('0x1c20') // 7200 in hex
			expect(res.method).toBe('anvil_increaseTime')

			await handlers.anvil_mine({
				jsonrpc: '2.0',
				method: 'anvil_mine',
				id: 2,
				params: ['0x1', '0x0'],
			})

			const newBlock = await vm.blockchain.getCanonicalHeadBlock()
			expect(newBlock.header.timestamp).toBe(initialTimestamp + 7200n)
		})
	})

	describe('evm_setBlockGasLimit', () => {
		it('should set the block gas limit for subsequent blocks', async () => {
			const vm = await client.getVm()
			const initialBlock = await vm.blockchain.getCanonicalHeadBlock()
			const initialGasLimit = initialBlock.header.gasLimit

			// Set a new gas limit
			const newGasLimit = 15_000_000n
			const res = await handlers.evm_setBlockGasLimit({
				jsonrpc: '2.0',
				method: 'evm_setBlockGasLimit',
				id: 1,
				params: [newGasLimit],
			})

			expect(res.result).toBeNull()
			expect(res.jsonrpc).toBe('2.0')
			expect(res.method).toBe('evm_setBlockGasLimit')
			expect(res.id).toBe(1)

			// Mine a block to apply the gas limit
			await handlers.anvil_mine({
				jsonrpc: '2.0',
				method: 'anvil_mine',
				id: 2,
				params: ['0x1', '0x0'],
			})

			// Verify the new block has the updated gas limit
			const newBlock = await vm.blockchain.getCanonicalHeadBlock()
			expect(newBlock.header.gasLimit).toBe(newGasLimit)
			expect(newBlock.header.gasLimit).not.toBe(initialGasLimit)
		})

		it('should persist gas limit across multiple blocks', async () => {
			const vm = await client.getVm()

			// Set a specific gas limit
			const newGasLimit = 10_000_000n
			await handlers.evm_setBlockGasLimit({
				jsonrpc: '2.0',
				method: 'evm_setBlockGasLimit',
				id: 1,
				params: [newGasLimit],
			})

			// Mine 3 blocks
			await handlers.anvil_mine({
				jsonrpc: '2.0',
				method: 'anvil_mine',
				id: 2,
				params: ['0x3', '0x0'],
			})

			// Check all blocks have the same gas limit
			const latestBlock = await vm.blockchain.getCanonicalHeadBlock()
			expect(latestBlock.header.gasLimit).toBe(newGasLimit)
		})
	})

	describe('anvil_setBlockGasLimit', () => {
		it('should work the same as evm_setBlockGasLimit', async () => {
			const vm = await client.getVm()

			const newGasLimit = 20_000_000n
			const res = await handlers.anvil_setBlockGasLimit({
				jsonrpc: '2.0',
				method: 'anvil_setBlockGasLimit',
				id: 1,
				params: [newGasLimit],
			})

			expect(res.result).toBeNull()
			expect(res.method).toBe('anvil_setBlockGasLimit')

			await handlers.anvil_mine({
				jsonrpc: '2.0',
				method: 'anvil_mine',
				id: 2,
				params: ['0x1', '0x0'],
			})

			const newBlock = await vm.blockchain.getCanonicalHeadBlock()
			expect(newBlock.header.gasLimit).toBe(newGasLimit)
		})
	})
})
