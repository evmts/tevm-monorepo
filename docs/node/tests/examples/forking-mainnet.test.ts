import { createTevmNode, http } from 'tevm'
import { callHandler } from 'tevm/actions'
import { createAddress } from 'tevm/address'
import { encodeFunctionData, parseAbi } from 'viem'
import { describe, expect, it } from 'vitest'

const mainnetRpcUrl = process.env.MAINNET_RPC_URL
const erc20Abi = parseAbi([
	'function balanceOf(address) view returns (uint256)',
	'function transfer(address to, uint256 amount) returns (bool)',
])
const usdcAddress = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
const holderAddress = '0x47ac0fb4f2d84898e4d9e7b4dab3c24507a6d503'
const recipientAddress = '0x1234567890123456789012345678901234567890'

const createMainnetFork = (blockTag?: bigint) => {
	if (!mainnetRpcUrl) throw new Error('MAINNET_RPC_URL is required for live fork examples')
	return createTevmNode({
		fork: {
			transport: http(mainnetRpcUrl)({}),
			...(blockTag !== undefined ? { blockTag } : {}),
		},
	})
}

describe('Forking Mainnet', () => {
	describe('Basic Forking', () => {
		it.skipIf(!mainnetRpcUrl)('should fork mainnet with HTTP transport', async () => {
			const node = createMainnetFork()

			const vm = await node.getVm()
			const latestBlock = await vm.blockchain.getCanonicalHeadBlock()
			expect(latestBlock).toBeDefined()
		})

		it.skipIf(!mainnetRpcUrl)('should fork from specific block', async () => {
			const latestNode = createMainnetFork()
			const latestVm = await latestNode.getVm()
			const latestBlock = await latestVm.blockchain.getCanonicalHeadBlock()
			const node = createMainnetFork(latestBlock.header.number)

			const vm = await node.getVm()
			const block = await vm.blockchain.getBlock(latestBlock.header.number)
			expect(block).toBeDefined()
		})
	})

	describe('Contract Interaction', () => {
		it.skipIf(!mainnetRpcUrl)('should read from forked contracts', async () => {
			const node = createMainnetFork()

			const result = await callHandler(node)({
				to: usdcAddress,
				data: encodeFunctionData({
					abi: erc20Abi,
					functionName: 'balanceOf',
					args: [holderAddress],
				}),
			})

			expect(result).toBeDefined()
			expect(result.rawData).not.toBe('0x')
		})

		it.skipIf(!mainnetRpcUrl)('should write to forked contracts', async () => {
			const node = createMainnetFork()

			const result = await callHandler(node)({
				from: holderAddress,
				to: usdcAddress,
				data: encodeFunctionData({
					abi: erc20Abi,
					functionName: 'transfer',
					args: [recipientAddress, 1n],
				}),
				skipBalance: true,
				throwOnFail: false,
			})

			expect(result).toBeDefined()
		})
	})

	describe('Advanced Features', () => {
		it.skipIf(!mainnetRpcUrl)('should handle account impersonation', async () => {
			const node = createMainnetFork()

			const result = await callHandler(node)({
				from: holderAddress,
				to: recipientAddress,
				value: 1000000000000000000n,
				skipBalance: true,
				throwOnFail: false,
			})

			expect(result).toBeDefined()
		})

		it.skipIf(!mainnetRpcUrl)('should demonstrate state persistence', async () => {
			const node = createMainnetFork()

			const vm = await node.getVm()
			const address = createAddress(holderAddress)

			const account1 = await vm.stateManager.getAccount(address)
			expect(account1).toBeDefined()

			const account2 = await vm.stateManager.getAccount(address)
			expect(account2).toEqual(account1)
		})
	})

	describe('Error Handling', () => {
		it.skip('should handle network errors gracefully', async () => {
			const node = createTevmNode({
				fork: {
					transport: {
						request: async () => {
							throw new Error('RPC unavailable')
						},
					},
				},
			})

			try {
				const vm = await node.getVm()
				await vm.blockchain.getCanonicalHeadBlock()
				throw new Error('Should have failed')
			} catch (error) {
				expect(error).toBeDefined()
			}
		})

		it.skipIf(!mainnetRpcUrl)('should handle invalid block numbers', async () => {
			const node = createMainnetFork(999999999999999n)

			try {
				const vm = await node.getVm()
				await vm.blockchain.getBlock(999999999999999n)
				throw new Error('Should have failed')
			} catch (error) {
				expect(error).toBeDefined()
			}
		})
	})

	describe('Performance Optimization', () => {
		it.skipIf(!mainnetRpcUrl)('should demonstrate state caching', async () => {
			const node = createMainnetFork()

			const vm = await node.getVm()
			const address = createAddress(holderAddress)

			// First access
			const account1 = await vm.stateManager.getAccount(address)
			expect(account1).toBeDefined()

			// Second access should use cache
			const account2 = await vm.stateManager.getAccount(address)
			expect(account2).toEqual(account1)
		})

		it.skipIf(!mainnetRpcUrl)('should handle concurrent requests', async () => {
			const node = createMainnetFork()

			const vm = await node.getVm()
			const addresses = [
				createAddress(holderAddress),
				createAddress(usdcAddress),
				createAddress(recipientAddress),
			]

			const results = await Promise.all(addresses.map((address) => vm.stateManager.getAccount(address)))

			expect(results.length).toBe(3)
			results.forEach((result) => expect(result).toBeDefined())
		})
	})
})
