import { createTevmNode, type TevmNode } from '@tevm/node'
import { type Hex, hexToBytes } from '@tevm/utils'
import { http, parseEther } from 'viem'
import { describe, expect, it, vi } from 'vitest'
import type { CallResult } from '../Call/CallResult.js'
import { callHandler } from '../Call/callHandler.js'
import { setAccountHandler } from '../SetAccount/setAccountHandler.js'
import { mineHandler } from './mineHandler.js'

const getBlockNumber = (client: TevmNode) => {
	return client
		.getVm()
		.then((vm) => vm.blockchain.getCanonicalHeadBlock())
		.then((block) => block.header.number)
}

describe(mineHandler.name, () => {
	it('as a default it should mine 1 block', async () => {
		const client = createTevmNode()
		expect(await getBlockNumber(client)).toBe(0n)
		await mineHandler(client)({})
		expect(await getBlockNumber(client)).toBe(1n)
	})

	it('should work in forked mode too', { timeout: 20_000 }, async () => {
		const client = createTevmNode({ fork: { transport: http('https://mainnet.optimism.io')({}) } })
		const bn = await getBlockNumber(client)
		expect(bn).toBeGreaterThan(119504797n)
		await mineHandler(client)({})
		expect(await getBlockNumber(client)).toBe(bn + 1n)
	})

	it('can be passed blockCount and interval props', async () => {
		const client = createTevmNode()
		expect(await getBlockNumber(client)).toBe(0n)
		await mineHandler(client)({
			interval: 2,
			blockCount: 2,
		})
		expect(await getBlockNumber(client)).toBe(2n)
		const latestBlock = await client.getVm().then((vm) => vm.blockchain.getCanonicalHeadBlock())
		expect(latestBlock.header.number).toBe(2n)
		const parentBlock = await client.getVm().then((vm) => vm.blockchain.getBlock(latestBlock.header.parentHash))
		expect(parentBlock.header.timestamp + 2n).toBe(latestBlock.header.timestamp)
	})

	it('works with transactions in the tx pool', async () => {
		const client = createTevmNode()
		const to = `0x${'69'.repeat(20)}` as const
		// send value
		const callResult = await callHandler(client)({
			createTransaction: true,
			to,
			value: 420n,
			skipBalance: true,
		})
		expect(callResult).toEqual({
			executionGasUsed: 0n,
			rawData: '0x',
			txHash: '0x5e5b342fae6b13548e62c3038078915397ebd2406a8c67afd276e8dc84ebba80',
			amountSpent: 147000n,
			totalGasSpent: 21000n,
		})
		expect(await client.getTxPool().then((pool) => [...pool.pool.keys()].length)).toBe(1)
		const { blockHashes, errors } = await mineHandler(client)({})

		expect(errors).toBeUndefined()
		expect(blockHashes).toHaveLength(1)

		expect(await getBlockNumber(client)).toBe(1n)

		// receipt should exist now
		const receiptsManager = await client.getReceiptsManager()
		// const block = await (await client.getVm()).blockchain.getCanonicalHeadBlock()
		const receipt = await receiptsManager.getReceiptByTxHash(hexToBytes(callResult.txHash as Hex))

		if (receipt === null) throw new Error('Receipt is null')

		expect(receipt[0].logs).toMatchSnapshot()
		expect(receipt[0].bitvector).toMatchSnapshot()
		expect(receipt[0].cumulativeBlockGasUsed).toMatchSnapshot()
		expect(receipt[1]).toBeDefined()
		expect(receipt[2]).toBeDefined()

		// should remove tx from mempool
		expect(await client.getTxPool().then((pool) => [...pool.pool.keys()].length)).toBe(0)
	})

	it('should throw an error for invalid params', async () => {
		const client = createTevmNode()
		await expect(mineHandler(client)({ interval: 'invalid' as any })).rejects.toThrowErrorMatchingInlineSnapshot(`
			[InternalError: Expected number, received string

			Docs: https://tevm.sh/reference/tevm/errors/classes/invalidnonceerror/
			Version: 1.1.0.next-73

			Docs: https://tevm.sh/reference/tevm/errors/classes/invalidnonceerror/
			Details: /reference/tevm/errors/classes/invalidnonceerror/
			Version: 1.1.0.next-73]
		`)
	})

	it('should handle INITIALIZING status', async () => {
		const client = createTevmNode()
		client.status = 'INITIALIZING'
		const readyMock = vi.fn().mockResolvedValue(true)
		;(client as any).ready = readyMock

		await mineHandler(client)({})

		expect(readyMock).toHaveBeenCalled()
		expect(await getBlockNumber(client)).toBe(1n)
	})

	it('should throw error when client status is STOPPED', async () => {
		const client = createTevmNode()
		client.status = 'STOPPED'

		await expect(mineHandler(client)({})).rejects.toThrowErrorMatchingInlineSnapshot(`
			[MisconfiguredClientError: Client is stopped

			Docs: https://tevm.sh/reference/tevm/errors/classes/internalerror/
			Version: 1.1.0.next-73]
		`)
	})

	it('should throw error for bogus client status', async () => {
		const client = createTevmNode()
		client.status = 'BOGUS_STATUS' as any

		await expect(mineHandler(client)({})).rejects.toThrowErrorMatchingInlineSnapshot(`
			[UnreachableCodeError: Unreachable code executed with value: "BOGUS_STATUS"

			Docs: https://tevm.sh/reference/tevm/errors/classes/internalerror/
			Version: 1.1.0.next-73]
		`)
	})

	it('should handle SYNCING status', async () => {
		const client = createTevmNode()
		client.status = 'SYNCING'

		await expect(mineHandler(client)({})).rejects.toThrowErrorMatchingInlineSnapshot(`
			[MisconfiguredClientError: Syncing not currently implemented

			Docs: https://tevm.sh/reference/tevm/errors/classes/internalerror/
			Version: 1.1.0.next-73]
		`)
	})

	it('should handle errors during mining process', async () => {
		const client = createTevmNode()
		const errorMock = new Error('Mining error')
		;(client as any).getVm = vi.fn().mockRejectedValue(errorMock)

		const result = await mineHandler(client)({ throwOnFail: false })

		expect(result.errors?.[0]?.message).toMatchInlineSnapshot(`
			"Mining error

			Docs: https://tevm.sh/reference/tevm/errors/classes/internalerror/
			Details: Mining error
			Version: 1.1.0.next-73"
		`)
	})

	it('should throw an error if mining is already in progress', async () => {
		const client = createTevmNode()
		client.status = 'MINING'

		await expect(mineHandler(client)({})).rejects.toThrowErrorMatchingInlineSnapshot(`
			[MisconfiguredClientError: Mining is already in progress

			Docs: https://tevm.sh/reference/tevm/errors/classes/internalerror/
			Version: 1.1.0.next-73]
		`)
	})

	it('should handle INITIALIZING status', async () => {
		const client = createTevmNode()
		client.status = 'INITIALIZING'
		const readyMock = vi.fn().mockResolvedValue(true)
		;(client as any).ready = readyMock

		await mineHandler(client)({})

		expect(readyMock).toHaveBeenCalled()
		expect(await getBlockNumber(client)).toBe(1n)
	})

	it('should throw error when client status is STOPPED', async () => {
		const client = createTevmNode()
		client.status = 'STOPPED'

		await expect(mineHandler(client)({})).rejects.toThrowErrorMatchingInlineSnapshot(`
			[MisconfiguredClientError: Client is stopped

			Docs: https://tevm.sh/reference/tevm/errors/classes/internalerror/
			Version: 1.1.0.next-73]
		`)
	})

	it('should throw error for bogus client status', async () => {
		const client = createTevmNode()
		client.status = 'BOGUS_STATUS' as any

		await expect(mineHandler(client)({})).rejects.toThrowErrorMatchingInlineSnapshot(`
			[UnreachableCodeError: Unreachable code executed with value: "BOGUS_STATUS"

			Docs: https://tevm.sh/reference/tevm/errors/classes/internalerror/
			Version: 1.1.0.next-73]
		`)
	})

	it('should handle SYNCING status', async () => {
		const client = createTevmNode()
		client.status = 'SYNCING'

		await expect(mineHandler(client)({})).rejects.toThrowErrorMatchingInlineSnapshot(`
			[MisconfiguredClientError: Syncing not currently implemented

			Docs: https://tevm.sh/reference/tevm/errors/classes/internalerror/
			Version: 1.1.0.next-73]
		`)
	})

	it('should handle errors during mining process', async () => {
		const client = createTevmNode()
		const errorMock = new Error('Mining error')
		;(client as any).getVm = vi.fn().mockRejectedValue(errorMock)

		const result = await mineHandler(client)({ throwOnFail: false })

		expect(result.errors?.[0]?.message).toMatchInlineSnapshot(`
			"Mining error

			Docs: https://tevm.sh/reference/tevm/errors/classes/internalerror/
			Details: Mining error
			Version: 1.1.0.next-73"
		`)
	})

	it('should mine multiple transactions with blockTag "pending" into a single block', async () => {
		const client = createTevmNode()
		const to = `0x${'69'.repeat(20)}` as const

		const TX_COUNT = 3
		const callResults: Array<CallResult> = []
		for (let i = 0; i < TX_COUNT; i++) {
			callResults.push(
				await callHandler(client)({
					blockTag: 'pending',
					createTransaction: true,
					to,
					value: BigInt(i),
					skipBalance: true,
				}),
			)
		}

		expect(await client.getTxPool().then((pool) => [...pool.pool.keys()].length)).toBe(1)
		expect(await client.getTxPool().then((pool) => [...pool.pool.values()][0]?.length)).toBe(TX_COUNT)
		const { blockHashes, errors } = await mineHandler(client)({})

		expect(errors).toBeUndefined()
		expect(blockHashes).toHaveLength(1)

		// All of the above transactions should be included in the same new block
		expect(await getBlockNumber(client)).toBe(1n)

		// receipt should exist now
		const receiptsManager = await client.getReceiptsManager()
		const receipts = await Promise.all(
			callResults.map((callResult) => receiptsManager.getReceiptByTxHash(hexToBytes(callResult.txHash as Hex))),
		)

		if (receipts.some((receipt) => receipt === null)) throw new Error('Receipt is null')
		receipts.forEach((receipt) => {
			expect(receipt?.[1]).toBeDefined()
			expect(receipt?.[2]).toBeDefined()
		})

		// should remove tx from mempool
		expect(await client.getTxPool().then((pool) => [...pool.pool.keys()].length)).toBe(0)
	})

	it('should skip balance when mining transactions', async () => {
		const client = createTevmNode()
		const from = `0x${'42'.repeat(20)}` as const
		const to = `0x${'69'.repeat(20)}` as const

		// Set up an account with zero balance
		await setAccountHandler(client)({
			address: from,
			balance: 0n,
			nonce: 0n,
		})

		// Create a transaction that would fail without skipBalance due to insufficient funds
		const callResult = await callHandler(client)({
			createTransaction: true,
			from,
			to,
			value: parseEther('1'),
			skipBalance: true,
			addToMempool: true,
			blockTag: 'pending',
		})

		expect(callResult.txHash).toBeDefined()
		expect(await client.getTxPool().then((pool) => [...pool.pool.keys()].length)).toBe(1)

		const { blockHashes, errors } = await mineHandler(client)({})

		expect(errors).toBeUndefined()
		expect(blockHashes).toHaveLength(1)
		expect(await getBlockNumber(client)).toBe(1n)

		// Verify the transaction was mined successfully
		const receiptsManager = await client.getReceiptsManager()
		const receipt = await receiptsManager.getReceiptByTxHash(hexToBytes(callResult.txHash as Hex))
		expect(receipt).not.toBeNull()

		// Verify the transaction was removed from mempool
		expect(await client.getTxPool().then((pool) => [...pool.pool.keys()].length)).toBe(0)
	})

	it('should skip nonce when mining transactions', async () => {
		const client = createTevmNode()
		const from = `0x${'42'.repeat(20)}` as const
		const to = `0x${'69'.repeat(20)}` as const

		await setAccountHandler(client)({
			address: from,
			balance: parseEther('1'),
			nonce: 0n,
		})

		// Add a first transaction to the mempool
		const callResultA = await callHandler(client)({
			createTransaction: true,
			from,
			to,
			value: 100n,
			addToMempool: true,
			blockTag: 'pending',
		})

		// Add a second one
		const callResultB = await callHandler(client)({
			createTransaction: true,
			from,
			to,
			value: 200n,
			addToMempool: true,
			blockTag: 'pending',
		})

		expect(callResultA.txHash).toBeDefined()
		expect(callResultB.txHash).toBeDefined()
		expect(await client.getTxPool().then((pool) => [...pool.pool.values()].flat().length)).toBe(2)
		client.getTxPool().then((pool) => pool.removeByHash(callResultA.txHash as Hex))
		expect(await client.getTxPool().then((pool) => [...pool.pool.values()].flat().length)).toBe(1)

		const { blockHashes, errors } = await mineHandler(client)({})

		expect(errors).toBeUndefined()
		expect(blockHashes).toHaveLength(1)
		expect(await getBlockNumber(client)).toBe(1n)

		// Verify the transaction was mined successfully
		const receiptsManager = await client.getReceiptsManager()
		const receiptA = await receiptsManager.getReceiptByTxHash(hexToBytes(callResultA.txHash as Hex))
		const receiptB = await receiptsManager.getReceiptByTxHash(hexToBytes(callResultB.txHash as Hex))
		expect(receiptA).toBeNull() // tx A was dropped
		expect(receiptB).not.toBeNull()

		// Verify the transactions were removed from mempool
		expect(await client.getTxPool().then((pool) => [...pool.pool.keys()].length)).toBe(0)
	})
})
