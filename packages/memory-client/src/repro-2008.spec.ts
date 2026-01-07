import { nativePrivateKeyToAccount, createPublicClient, createWalletClient, custom, defineChain } from '@tevm/utils'
import { describe, expect, it } from 'vitest'
import { createMemoryClient } from './createMemoryClient.js'

describe('Issue #2008 - Transaction not found', () => {
	it('should find transaction and receipt after sending with default auto mining', async () => {
		// Issue #2008: Using default mining config (should be auto)
		const client = createMemoryClient()
		await client.tevmReady()

		const chainId = await client.request({ method: 'eth_chainId' })
		console.log('Chain ID', chainId)

		const chain = defineChain({
			id: parseInt(chainId, 16),
			name: 'TevmMemoryChain',
			nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
			rpcUrls: { default: { http: [''] } },
		})

		const privateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
		const account = nativePrivateKeyToAccount(privateKey)

		const walletClient = createWalletClient({
			chain,
			account,
			transport: custom(client),
		})
		const publicClient = createPublicClient({
			chain,
			transport: custom(client),
		})

		console.log('Sending transaction...')
		const txHash = await walletClient.sendTransaction({
			to: account.address,
			value: 1000000000000000000n, // 1 ETH
		})
		console.log('tx hash:', txHash)

		// Get block number to verify mining
		const blockNumber = await publicClient.getBlockNumber()
		console.log('block number:', blockNumber)

		// Get latest block to check transactions
		const block = await publicClient.getBlock({ blockNumber })
		console.log('block:', block.hash, 'transactions:', block.transactions)

		// Try direct client request
		const rawTx = await client.request({ method: 'eth_getTransactionByHash', params: [txHash] })
		console.log('raw tx response:', rawTx)

		// Check the transaction
		const tx = await publicClient.getTransaction({ hash: txHash })
		console.log('getTransaction result:', tx)
		expect(tx).toBeDefined()
		expect(tx.hash).toBe(txHash)

		// Check the receipt
		const receipt = await publicClient.getTransactionReceipt({ hash: txHash })
		console.log('receipt:', receipt)
		expect(receipt).toBeDefined()
		expect(receipt.transactionHash).toBe(txHash)
		expect(receipt.status).toBe('success')
	})

	it('should work with waitForTransactionReceipt (exactly like user reproduction)', async () => {
		// Exact reproduction from issue #2008
		const client = createMemoryClient()
		await client.tevmReady()

		const chainId = await client.request({ method: 'eth_chainId' })
		console.log('Chain ID', chainId)

		const chain = defineChain({
			id: parseInt(chainId, 16),
			name: 'TevmMemoryChain',
			nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
			rpcUrls: { default: { http: [''] } },
		})

		const privateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
		const account = nativePrivateKeyToAccount(privateKey)

		const walletClient = createWalletClient({
			chain,
			account,
			transport: custom(client),
		})
		const publicClient = createPublicClient({
			chain,
			transport: custom(client),
		})

		const txHash = await walletClient.sendTransaction({
			to: account.address,
			value: 1000000000000000000n, // 1 ETH
		})
		console.log('tx hash:', txHash)

		// This is what user was calling - waitForTransactionReceipt polls using getTransactionReceipt
		const receipt = await publicClient.waitForTransactionReceipt({
			hash: txHash,
		})
		console.log('receipt:', receipt)
		expect(receipt).toBeDefined()
		expect(receipt.transactionHash).toBe(txHash)
		expect(receipt.status).toBe('success')
	})
})
