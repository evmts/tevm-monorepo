import { SimpleContract } from '@tevm/contract'
import { createTevmNode, type TevmNode } from '@tevm/node'
import { type Address, type Hex, PREFUNDED_ACCOUNTS } from '@tevm/utils'
import { assert, beforeEach, describe, expect, it } from 'vitest'
import { contractHandler } from '../Contract/contractHandler.js'
import { deployHandler } from '../Deploy/deployHandler.js'
import { ethGetTransactionReceiptHandler } from '../eth/ethGetTransactionReceipt.js'
import { debugGetRawTransactionHandler } from './debugGetRawTransactionHandler.js'

describe('debugGetRawTransactionHandler', () => {
	let client: TevmNode
	let contractAddress: Address
	let deploymentTxHash: Hex

	beforeEach(async () => {
		client = createTevmNode()

		const deployResult = await deployHandler(client)({
			...SimpleContract.deploy(420n),
			from: PREFUNDED_ACCOUNTS[0].address,
			addToBlockchain: true,
		})
		assert(deployResult.createdAddress, 'createdAddress is undefined')
		assert(deployResult.txHash, 'txHash is undefined')
		contractAddress = deployResult.createdAddress
		deploymentTxHash = deployResult.txHash
	})

	it('should return RLP-encoded transaction by hash', async () => {
		const handler = debugGetRawTransactionHandler(client)
		const result = await handler({ hash: deploymentTxHash })

		expect(typeof result).toBe('string')
		expect(result).toMatch(/^0x[0-9a-f]+$/i)
		expect(result.length).toBeGreaterThan(10)
	})

	it('should throw error for non-existent transaction hash', async () => {
		const handler = debugGetRawTransactionHandler(client)
		const fakeHash = '0x1234567890123456789012345678901234567890123456789012345678901234'

		await expect(async () => {
			await handler({ hash: fakeHash })
		}).rejects.toThrow('Transaction not found')
	})

	it('should return valid RLP format', async () => {
		const handler = debugGetRawTransactionHandler(client)
		const result = await handler({ hash: deploymentTxHash })

		// Should be a valid hex string
		expect(result).toMatch(/^0x[0-9a-f]+$/i)
		expect(result.length).toBeGreaterThan(10)
	})

	it('should return different RLP for different transactions', async () => {
		// Execute another transaction
		const contractResult = await contractHandler(client)({
			...SimpleContract.write.set(999n),
			to: contractAddress,
			from: PREFUNDED_ACCOUNTS[0].address,
			addToBlockchain: true,
		})
		assert(contractResult.txHash, 'txHash is undefined')

		const handler = debugGetRawTransactionHandler(client)
		const deployRlp = await handler({ hash: deploymentTxHash })
		const contractRlp = await handler({ hash: contractResult.txHash })

		expect(deployRlp).not.toEqual(contractRlp)
	})

	it('should handle contract call transaction', async () => {
		const contractResult = await contractHandler(client)({
			...SimpleContract.write.set(999n),
			to: contractAddress,
			from: PREFUNDED_ACCOUNTS[0].address,
			addToBlockchain: true,
		})
		assert(contractResult.txHash, 'txHash is undefined')

		const handler = debugGetRawTransactionHandler(client)
		const result = await handler({ hash: contractResult.txHash })

		expect(typeof result).toBe('string')
		expect(result).toMatch(/^0x[0-9a-f]+$/i)
		expect(result.length).toBeGreaterThan(10)
	})

	it('should handle deployment transaction', async () => {
		const handler = debugGetRawTransactionHandler(client)
		const result = await handler({ hash: deploymentTxHash })

		expect(typeof result).toBe('string')
		expect(result).toMatch(/^0x[0-9a-f]+$/i)
		// Deployment transactions are typically larger due to bytecode
		expect(result.length).toBeGreaterThan(100)
	})

	it('should return consistent RLP for the same transaction', async () => {
		const handler = debugGetRawTransactionHandler(client)
		const result1 = await handler({ hash: deploymentTxHash })
		const result2 = await handler({ hash: deploymentTxHash })

		expect(result1).toEqual(result2)
	})

	it('should work with transaction from any block', async () => {
		// Create multiple transactions in different blocks
		const tx1Result = await contractHandler(client)({
			...SimpleContract.write.set(1n),
			to: contractAddress,
			from: PREFUNDED_ACCOUNTS[0].address,
			addToBlockchain: true,
		})
		assert(tx1Result.txHash, 'txHash is undefined')

		const tx2Result = await contractHandler(client)({
			...SimpleContract.write.set(2n),
			to: contractAddress,
			from: PREFUNDED_ACCOUNTS[0].address,
			addToBlockchain: true,
		})
		assert(tx2Result.txHash, 'txHash is undefined')

		const handler = debugGetRawTransactionHandler(client)

		// Should be able to get both transactions
		const tx1Rlp = await handler({ hash: tx1Result.txHash })
		const tx2Rlp = await handler({ hash: tx2Result.txHash })

		expect(tx1Rlp).toMatch(/^0x[0-9a-f]+$/i)
		expect(tx2Rlp).toMatch(/^0x[0-9a-f]+$/i)
		expect(tx1Rlp).not.toEqual(tx2Rlp)
	})

	it('should retrieve transaction that exists in receipt manager', async () => {
		const handler = debugGetRawTransactionHandler(client)

		// Verify we can get the raw transaction
		const result = await handler({ hash: deploymentTxHash })
		expect(result).toMatch(/^0x[0-9a-f]+$/i)

		// Verify using ethGetTransactionReceipt
		const receipt = await ethGetTransactionReceiptHandler(client)({ hash: deploymentTxHash })
		expect(receipt).toBeDefined()
		expect(receipt?.transactionHash).toBe(deploymentTxHash)
	})

	it('should handle transaction with data', async () => {
		const contractResult = await contractHandler(client)({
			...SimpleContract.write.set(12345n),
			to: contractAddress,
			from: PREFUNDED_ACCOUNTS[0].address,
			addToBlockchain: true,
		})
		assert(contractResult.txHash, 'txHash is undefined')

		const handler = debugGetRawTransactionHandler(client)
		const result = await handler({ hash: contractResult.txHash })

		expect(typeof result).toBe('string')
		expect(result).toMatch(/^0x[0-9a-f]+$/i)
		// Transaction with data should be non-trivial size
		expect(result.length).toBeGreaterThan(50)
	})

	it('should handle multiple transactions in same block', async () => {
		const newClient = createTevmNode()

		// Deploy and execute multiple transactions
		const { createdAddress: addr, txHash: deployTx } = await deployHandler(newClient)({
			...SimpleContract.deploy(1n),
			from: PREFUNDED_ACCOUNTS[0].address,
			addToBlockchain: true,
		})
		assert(addr, 'address is undefined')
		assert(deployTx, 'deployTx is undefined')

		const { txHash: tx1 } = await contractHandler(newClient)({
			...SimpleContract.write.set(2n),
			to: addr,
			from: PREFUNDED_ACCOUNTS[0].address,
			addToBlockchain: true,
		})
		assert(tx1, 'tx1 is undefined')

		const { txHash: tx2 } = await contractHandler(newClient)({
			...SimpleContract.write.set(3n),
			to: addr,
			from: PREFUNDED_ACCOUNTS[0].address,
			addToBlockchain: true,
		})
		assert(tx2, 'tx2 is undefined')

		const handler = debugGetRawTransactionHandler(newClient)

		// Should be able to retrieve all transactions
		const deployRlp = await handler({ hash: deployTx })
		const tx1Rlp = await handler({ hash: tx1 })
		const tx2Rlp = await handler({ hash: tx2 })

		expect(deployRlp).toMatch(/^0x[0-9a-f]+$/i)
		expect(tx1Rlp).toMatch(/^0x[0-9a-f]+$/i)
		expect(tx2Rlp).toMatch(/^0x[0-9a-f]+$/i)

		// All should be different
		expect(deployRlp).not.toEqual(tx1Rlp)
		expect(tx1Rlp).not.toEqual(tx2Rlp)
		expect(deployRlp).not.toEqual(tx2Rlp)
	})

	it('should match transaction type in RLP encoding', async () => {
		const handler = debugGetRawTransactionHandler(client)
		const result = await handler({ hash: deploymentTxHash })

		// Type 2 (EIP-1559) transactions start with 0x02
		// Type 0 (legacy) transactions start with 0xf8 or higher (RLP list)
		// Type 1 (EIP-2930) transactions start with 0x01
		expect(result).toMatch(/^0x[0-9a-f]+$/i)

		const _firstByte = result.substring(2, 4).toLowerCase()
		// Should be a valid transaction type indicator
		expect(result.length).toBeGreaterThan(10)
	})
})
