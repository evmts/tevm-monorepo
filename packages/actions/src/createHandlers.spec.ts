import { ERC20 } from '@tevm/contract'
import { createTevmNode } from '@tevm/node'
import { numberToHex } from '@tevm/utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createHandlers, type RequestHandlers } from './createHandlers.js'
import { testAccounts } from './eth/utils/testAccounts.js'

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
		const res = await handlers.tevm_mine({
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

	it('should keep tevm_miner as an alias for tevm_mine', async () => {
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

	it('should handle eth_sign for managed accounts', async () => {
		const data = '0x42069'
		const res = await handlers.eth_sign({
			jsonrpc: '2.0',
			method: 'eth_sign',
			id: 1,
			params: [testAccounts[0].address, data],
		})
		expect(res.result).toMatch(/^0x/)
	})

	it('should reject eth_sign for unmanaged/impersonated accounts', async () => {
		await client.setImpersonatedAccount(`0x${'69'.repeat(20)}`)
		await expect(
			handlers.eth_sign({
				jsonrpc: '2.0',
				method: 'eth_sign',
				id: 1,
				params: [`0x${'69'.repeat(20)}`, '0x42069'],
			}),
		).rejects.toThrow('not found')
	})

	it('should handle tevm_lightSyncStatus and zevm alias', async () => {
		client.getLightSyncStatus = () => ({
			ready: true,
			status: 'ready',
			network: 'mainnet',
			checkpointSource: 'default',
			lastCheckpoint: '0xabc',
			optimisticSlot: 12n,
			safeSlot: 11n,
			finalizedSlot: 10n,
		})
		const canonical = handlers.tevm_lightSyncStatus({ jsonrpc: '2.0', method: 'tevm_lightSyncStatus', id: 1 })
		const alias = handlers.zevm_lightSyncStatus({ jsonrpc: '2.0', method: 'zevm_lightSyncStatus', id: 1 })
		expect(canonical.result.finalizedSlot).toBe('0xa')
		expect(canonical.result.safeSlot).toBe('0xb')
		expect(canonical.result.optimisticSlot).toBe('0xc')
		expect(alias.result).toEqual(canonical.result)
	})

	it('should handle web3 and net compatibility methods', async () => {
		const clientVersion = handlers.web3_clientVersion({ jsonrpc: '2.0', method: 'web3_clientVersion', id: 1 })
		expect(clientVersion.result).toBe('tevm/1.0.0')

		const sha3 = handlers.web3_sha3({
			jsonrpc: '2.0',
			method: 'web3_sha3',
			id: 2,
			params: ['0x68656c6c6f20776f726c64'],
		})
		expect(sha3.result).toBe('0x47173285a8d7341e5e972fc677286384f802f8ef42a5ec5f03bbfa254cb01fad')

		const listening = handlers.net_listening({ jsonrpc: '2.0', method: 'net_listening', id: 3 })
		expect(listening.result).toBe(true)

		const peerCount = handlers.net_peerCount({ jsonrpc: '2.0', method: 'net_peerCount', id: 4 })
		expect(peerCount.result).toBe('0x0')

		const netVersion = await handlers.net_version({ jsonrpc: '2.0', method: 'net_version', id: 5 })
		expect(netVersion.result).toBe(numberToHex((await client.getVm()).common.ethjsCommon.chainId()))
	})

	it('should report namespaces via rpc_modules and reflect engineApi disablement', async () => {
		const withEngine = handlers.rpc_modules({ jsonrpc: '2.0', method: 'rpc_modules', id: 1 })
		expect(withEngine.result.engine).toBe('1.0')
		expect(withEngine.result.eth).toBe('1.0')
		expect(withEngine.result.web3).toBe('1.0')
		expect(withEngine.result.net).toBe('1.0')
		expect(withEngine.result.rpc).toBe('1.0')

		const clientWithoutEngine = createTevmNode()
		;(clientWithoutEngine as any).config = { engineApi: false }
		await clientWithoutEngine.ready()
		const handlersWithoutEngine = createHandlers(clientWithoutEngine)
		const withoutEngine = handlersWithoutEngine.rpc_modules({ jsonrpc: '2.0', method: 'rpc_modules', id: 2 })
		expect(withoutEngine.result.engine).toBeUndefined()
		expect(withoutEngine.result.eth).toBe('1.0')
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

		it('should compose with existing next block timestamp override', async () => {
			await handlers.evm_setNextBlockTimestamp({
				jsonrpc: '2.0',
				method: 'evm_setNextBlockTimestamp',
				id: 1,
				params: [1000],
			})
			await handlers.evm_increaseTime({
				jsonrpc: '2.0',
				method: 'evm_increaseTime',
				id: 2,
				params: [60],
			})
			await handlers.anvil_mine({
				jsonrpc: '2.0',
				method: 'anvil_mine',
				id: 3,
				params: ['0x1', '0x0'],
			})
			const vm = await client.getVm()
			const newBlock = await vm.blockchain.getCanonicalHeadBlock()
			expect(newBlock.header.timestamp).toBe(1060n)
		})
	})

	describe('interval mining timer lifecycle', () => {
		it('owns a single timer and stops it when switching modes', async () => {
			const setIntervalSpy = vi.spyOn(globalThis, 'setInterval')
			const clearIntervalSpy = vi.spyOn(globalThis, 'clearInterval')
			const localClient = createTevmNode()
			await localClient.ready()
			const localHandlers = createHandlers(localClient)
			await localHandlers.anvil_setIntervalMining({
				jsonrpc: '2.0',
				method: 'anvil_setIntervalMining',
				id: 1,
				params: [1],
			})
			await localHandlers.anvil_setIntervalMining({
				jsonrpc: '2.0',
				method: 'anvil_setIntervalMining',
				id: 2,
				params: [2],
			})
			await localHandlers.anvil_setAutomine({
				jsonrpc: '2.0',
				method: 'anvil_setAutomine',
				id: 3,
				params: [true],
			})
			expect(setIntervalSpy).toHaveBeenCalledTimes(2)
			expect(clearIntervalSpy).toHaveBeenCalled()
			setIntervalSpy.mockRestore()
			clearIntervalSpy.mockRestore()
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
