import { createTevmNode, PREFUNDED_ACCOUNTS } from 'tevm'
import { callHandler, mineHandler, setAccountHandler } from 'tevm/actions'
import { createAddress } from 'tevm/address'
import { SimpleContract } from 'tevm/contract'
import { type Hex, hexToBytes } from 'tevm/utils'
import { encodeDeployData, encodeFunctionData } from 'viem'
import { describe, expect, it } from 'vitest'

const EVENT_TOPIC = hexToBytes('0x012c78e2b84325878b1bd9d250d772cfe5bda7722d795f45036fa5e1e6e303fc')
const senderAddress = PREFUNDED_ACCOUNTS[0].address
const recipientAddress = '0x2345678901234567890123456789012345678901'

const mineTransfer = async (node: ReturnType<typeof createTevmNode>, value = 1000000000000000000n) => {
	const callResult = await callHandler(node)({
		addToMempool: true,
		from: senderAddress,
		to: recipientAddress,
		value,
	})
	expect(callResult.txHash).toBeDefined()
	await mineHandler(node)({})
	return hexToBytes(callResult.txHash as Hex)
}

const blockRange = async (node: ReturnType<typeof createTevmNode>) => {
	const vm = await node.getVm()
	return {
		fromBlock: await vm.blockchain.getBlock(0n),
		toBlock: await vm.blockchain.getCanonicalHeadBlock(),
	}
}

const deployLogContract = async (node: ReturnType<typeof createTevmNode>) => {
	const deployResult = await callHandler(node)({
		addToMempool: true,
		from: senderAddress,
		data: encodeDeployData(SimpleContract.deploy(2n)),
		throwOnFail: false,
	})
	expect(deployResult.createdAddress).toBeDefined()
	expect(deployResult.txHash).toBeDefined()
	await mineHandler(node)({})
	if (!deployResult.createdAddress) throw new Error('Contract deployment failed')
	return deployResult.createdAddress
}

const queueLogEmits = async (node: ReturnType<typeof createTevmNode>, contractAddress: Hex, txCount: number) => {
	for (let i = 0; i < txCount; i++) {
		const callResult = await callHandler(node)({
			blockTag: 'pending',
			addToMempool: true,
			from: senderAddress,
			to: contractAddress,
			data: encodeFunctionData(SimpleContract.withAddress(contractAddress).write.set(BigInt(i + 1))),
			gas: 100000n,
			throwOnFail: false,
		})
		expect(callResult.txHash).toBeDefined()
	}
	await mineHandler(node)({})
}

describe('Receipts and Logs', () => {
	describe('Transaction Receipts', () => {
		it('should generate and retrieve transaction receipts', async () => {
			const node = createTevmNode()
			const txHash = await mineTransfer(node)
			const receiptsManager = await node.getReceiptsManager()
			const receiptResult = await receiptsManager.getReceiptByTxHash(txHash)

			expect(receiptResult).toBeDefined()
			if (receiptResult) {
				const [receipt, blockHash, txIndex, logIndex] = receiptResult
				expect(blockHash).toBeDefined()
				expect(txIndex).toBeDefined()
				expect(logIndex).toBeDefined()
				expect(receipt.cumulativeBlockGasUsed).toBeDefined()
				expect(receipt.bitvector).toBeDefined()
				expect(receipt.logs).toBeDefined()
				if ('status' in receipt) {
					expect(receipt.status).toBe(1)
				}
			}
		})

		it('should handle failed transactions', async () => {
			const node = createTevmNode()
			const revertingContract = '0x3456789012345678901234567890123456789012'
			await setAccountHandler(node)({
				address: revertingContract,
				deployedBytecode: '0x60006000fd',
			})

			const callResult = await callHandler(node)({
				addToMempool: true,
				from: senderAddress,
				to: revertingContract,
				throwOnFail: false,
			})
			expect(callResult.txHash).toBeDefined()
			await mineHandler(node)({})

			const receiptsManager = await node.getReceiptsManager()
			const receiptResult = await receiptsManager.getReceiptByTxHash(hexToBytes(callResult.txHash as Hex))

			if (receiptResult) {
				const [receipt] = receiptResult
				if ('status' in receipt) {
					expect(receipt.status).toBe(0)
					expect(receipt.cumulativeBlockGasUsed).toBeDefined()
				}
			}
		})
	})

	describe('Event Logs', () => {
		it('should capture contract event logs', async () => {
			const node = createTevmNode()
			const contractAddress = await deployLogContract(node)
			const receiptsManager = await node.getReceiptsManager()

			// Generate multiple logs
			const txCount = 10
			await queueLogEmits(node, contractAddress, txCount)
			const { fromBlock, toBlock } = await blockRange(node)
			const address = createAddress(contractAddress)

			// Filter by contract address
			const addressLogs = await receiptsManager.getLogs(fromBlock, toBlock, [address.toBytes()], undefined)
			expect(addressLogs.length).toBeGreaterThan(0)

			// Filter by topic
			const topicLogs = await receiptsManager.getLogs(fromBlock, toBlock, undefined, [EVENT_TOPIC])
			expect(topicLogs.length).toBeGreaterThan(0)

			// Filter by both address and topic
			const combinedLogs = await receiptsManager.getLogs(fromBlock, toBlock, [address.toBytes()], [EVENT_TOPIC])
			expect(combinedLogs.length).toBeGreaterThan(0)
		})

		it('should filter logs by address and topics', async () => {
			const node = createTevmNode()
			const receiptsManager = await node.getReceiptsManager()
			const { fromBlock, toBlock } = await blockRange(node)
			const testAddress = createAddress('0x1234567890123456789012345678901234567890')
			const filter = {
				address: testAddress,
				topics: [EVENT_TOPIC],
			}

			const logs = await receiptsManager.getLogs(fromBlock, toBlock, [testAddress.toBytes()], filter.topics)
			expect(Array.isArray(logs)).toBe(true)
		})
	})

	describe('Receipt Storage', () => {
		it('should copy receipts across node snapshots', async () => {
			const node1 = createTevmNode()
			const txHash = await mineTransfer(node1)
			const receiptsManager1 = await node1.getReceiptsManager()
			const receipt1Result = await receiptsManager1.getReceiptByTxHash(txHash)

			const node2 = await node1.deepCopy()
			const receiptsManager2 = await node2.getReceiptsManager()
			const receipt2Result = await receiptsManager2.getReceiptByTxHash(txHash)

			expect(receipt2Result).toEqual(receipt1Result)
		})

		it('should delete receipt indexes with deleted receipts', async () => {
			const node = createTevmNode()
			const txHash = await mineTransfer(node)
			const receiptsManager = await node.getReceiptsManager()
			const receiptResult = await receiptsManager.getReceiptByTxHash(txHash)
			expect(receiptResult).not.toBeNull()
			if (!receiptResult) throw new Error('Receipt missing')

			const [, blockHash] = receiptResult
			const vm = await node.getVm()
			const block = await vm.blockchain.getBlock(blockHash)
			await receiptsManager.deleteReceipts(block)

			expect(await receiptsManager.getReceiptByTxHash(txHash)).toBeNull()
		})
	})

	describe('Log Indexing', () => {
		it('should index logs for efficient querying', async () => {
			const node = createTevmNode()
			const contractAddress = await deployLogContract(node)
			const receiptsManager = await node.getReceiptsManager()

			// Generate multiple logs
			const txCount = 10
			await queueLogEmits(node, contractAddress, txCount)
			const { fromBlock, toBlock } = await blockRange(node)
			const address = createAddress(contractAddress)

			// Filter by contract address
			const addressLogs = await receiptsManager.getLogs(fromBlock, toBlock, [address.toBytes()], undefined)
			expect(addressLogs.length).toBeGreaterThan(0)

			// Filter by topic
			const topicLogs = await receiptsManager.getLogs(fromBlock, toBlock, undefined, [EVENT_TOPIC])
			expect(topicLogs.length).toBeGreaterThan(0)

			// Filter by both address and topic
			const combinedLogs = await receiptsManager.getLogs(fromBlock, toBlock, [address.toBytes()], [EVENT_TOPIC])
			expect(combinedLogs.length).toBeGreaterThan(0)
		})
	})

	describe('Error Handling', () => {
		it('should handle non-existent receipts', async () => {
			const node = createTevmNode()
			const receiptsManager = await node.getReceiptsManager()
			const nonExistentHash = hexToBytes('0x1234567890123456789012345678901234567890123456789012345678901234')

			const receipt = await receiptsManager.getReceiptByTxHash(nonExistentHash)
			expect(receipt).toBeNull()
		})

		it('should handle invalid log filters', async () => {
			const node = createTevmNode()
			const receiptsManager = await node.getReceiptsManager()
			const { fromBlock, toBlock } = await blockRange(node)

			// Test with invalid address
			const invalidAddress = hexToBytes('0x0000')
			const logs = await receiptsManager.getLogs(fromBlock, toBlock, [invalidAddress], undefined)
			expect(logs.length).toBe(0)
		})
	})
})
