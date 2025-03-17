import { type TevmNode, createTevmNode } from '@tevm/node'
import { type Hex, hexToBytes } from '@tevm/utils'
import { http } from 'viem'
import { describe, expect, it, vi } from 'vitest'
import { callHandler } from '../Call/callHandler.js'
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
			[InternalError: interval must be a non-negative integer

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
})
