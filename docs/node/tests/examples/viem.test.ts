import { requestEip1193 } from 'tevm/decorators'
import { createTevmNode } from 'tevm/node'
import { createPublicClient, custom, parseAbi } from 'viem'
import { mainnet } from 'viem/chains'
import { describe, expect, it } from 'vitest'

describe('Viem Integration', () => {
	describe('Basic Setup', () => {
		it('should create viem client with Tevm Node', () => {
			const node = createTevmNode().extend(requestEip1193())

			const client = createPublicClient({
				chain: mainnet,
				transport: custom(node),
			})

			expect(client).toBeDefined()
		})
	})

	describe('Reading Blockchain State', () => {
		it('should perform basic state queries', async () => {
			const node = createTevmNode().extend(requestEip1193())
			const client = createPublicClient({
				chain: mainnet,
				transport: custom(node),
			})

			// Get latest block
			const block = await client.getBlock()
			expect(block).toBeDefined()

			// Get balance
			const balance = await client.getBalance({
				address: '0x1234567890123456789012345678901234567890',
			})
			expect(balance).toBeDefined()

			// Get transaction count
			const nonce = await client.getTransactionCount({
				address: '0x1234567890123456789012345678901234567890',
			})
			expect(nonce).toBeDefined()
		})

		it('should read contract data', async () => {
			const node = createTevmNode().extend(requestEip1193())
			const client = createPublicClient({
				chain: mainnet,
				transport: custom(node),
			})

			const abi = parseAbi([
				'function balanceOf(address) view returns (uint256)',
				'function symbol() view returns (string)',
				'event Transfer(address indexed from, address indexed to, uint256 value)',
			])

			const tokenContract = {
				address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
				abi,
			} as const

			const [balance, symbol] = await Promise.all([
				client.readContract({
					...tokenContract,
					functionName: 'balanceOf',
					args: ['0x1234567890123456789012345678901234567890'],
				}),
				client.readContract({
					...tokenContract,
					functionName: 'symbol',
				}),
			])

			expect(balance).toBeDefined()
			expect(symbol).toBeDefined()
		})
	})

	describe('Event Handling', () => {
		it('should read past events', async () => {
			const node = createTevmNode().extend(requestEip1193())
			const client = createPublicClient({
				chain: mainnet,
				transport: custom(node),
			})

			const tokenAddress = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
			const transferEvent = parseAbi(['event Transfer(address indexed from, address indexed to, uint256 value)'])[0]
			const logs = await client.getLogs({
				address: tokenAddress,
				event: transferEvent,
				fromBlock: 0n,
				toBlock: 'latest',
			})

			for (const log of logs) {
				expect(log.args?.from).toBeDefined()
				expect(log.args?.to).toBeDefined()
				expect(log.args?.value).toBeDefined()
			}
		})

		it('should create and use event filters', async () => {
			const node = createTevmNode().extend(requestEip1193())
			const client = createPublicClient({
				chain: mainnet,
				transport: custom(node),
			})

			const tokenAddress = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
			const transferEvent = parseAbi(['event Transfer(address indexed from, address indexed to, uint256 value)'])[0]
			const filter = await client.createEventFilter({
				address: tokenAddress,
				event: transferEvent,
			})

			const newEvents = await client.getFilterChanges({ filter })
			expect(newEvents).toBeDefined()
		})
	})

	describe('Advanced Usage', () => {
		it('should perform multiple contract reads', async () => {
			const node = createTevmNode().extend(requestEip1193())
			const client = createPublicClient({
				chain: mainnet,
				transport: custom(node),
			})

			const TOKEN_ABI = parseAbi(['function balanceOf(address) view returns (uint256)'])

			const address = '0x1234567890123456789012345678901234567890'
			const token1Address = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
			const token2Address = '0xdac17f958d2ee523a2206206994597c13d831ec7'

			const results = await Promise.all([
				client.readContract({
					address: token1Address,
					abi: TOKEN_ABI,
					functionName: 'balanceOf',
					args: [address],
				}),
				client.readContract({
					address: token2Address,
					abi: TOKEN_ABI,
					functionName: 'balanceOf',
					args: [address],
				}),
			])

			expect(results).toBeDefined()
			expect(results.length).toBe(2)

			const multicallResult = await client.multicall({
				contracts: [
					{
						address: token1Address,
						abi: TOKEN_ABI,
						functionName: 'balanceOf',
						args: [address],
					},
					{
						address: token2Address,
						abi: TOKEN_ABI,
						functionName: 'balanceOf',
						args: [address],
					},
				],
			})

			expect(multicallResult).toBeDefined()
			expect(multicallResult.length).toBe(2)
		})

		it('should estimate gas', async () => {
			const node = createTevmNode().extend(requestEip1193())
			const client = createPublicClient({
				chain: mainnet,
				transport: custom(node),
			})

			const abi = parseAbi(['function transfer(address to, uint256 amount) returns (bool)'])

			const gas = await client.estimateContractGas({
				address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
				abi,
				functionName: 'transfer',
				args: ['0x1234567890123456789012345678901234567890', 1000000n],
			})

			expect(gas).toBeDefined()
		})
	})

	describe('Best Practices', () => {
		it('should handle errors properly', async () => {
			const node = createTevmNode().extend(requestEip1193())
			const client = createPublicClient({
				chain: mainnet,
				transport: custom(node),
			})

			try {
				await client.readContract({
					address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
					abi: parseAbi(['function riskyFunction() view returns (uint256)']),
					functionName: 'riskyFunction',
				})
			} catch (error) {
				expect(error).toBeDefined()
			}
		})

		it('should handle gas estimation with buffer', async () => {
			const node = createTevmNode().extend(requestEip1193())
			const client = createPublicClient({
				chain: mainnet,
				transport: custom(node),
			})

			const abi = parseAbi(['function transfer(address to, uint256 amount) returns (bool)'])

			const gas = await client.estimateContractGas({
				address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
				abi,
				functionName: 'transfer',
				args: ['0x1234567890123456789012345678901234567890', 1000000n],
			})

			expect((gas * 120n) / 100n).toBeGreaterThan(gas) // 20% buffer
		})
	})
})
