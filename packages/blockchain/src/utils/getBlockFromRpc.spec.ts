import { Block } from '@tevm/block'
import { optimism } from '@tevm/common'
import { InvalidBlockError, UnknownBlockError } from '@tevm/errors'
import { bytesToHex, custom } from 'viem'
import { describe, expect, it, vi } from 'vitest'
import { createBaseChain } from '../createBaseChain.js'
import { mockRpcBlocks, mockRpcHashes, mockTransport } from '../test/getBlocks.js'
import { getBlockFromRpc } from './getBlockFromRpc.js'

describe('getBlockFromRpc', () => {
	const baseChain = createBaseChain({ common: optimism.copy() })
	const blockNumber = BigInt(mockRpcBlocks[1].number)
	const blockHash = mockRpcHashes[1]

	it('should fetch the latest block', async () => {
		const common = optimism.copy()

		const [block, rpcBlock] = await getBlockFromRpc(baseChain, { transport: mockTransport, blockTag: 'latest' }, common)
		expect(block).toBeInstanceOf(Block)
		expect(block.header.number).toBe(BigInt(mockRpcBlocks[0].number))
		expect(rpcBlock.hash).toBe(mockRpcHashes[0])
	})

	it('should fetch a block by number', async () => {
		const common = optimism.copy()

		const [block, rpcBlock] = await getBlockFromRpc(baseChain, { transport: mockTransport, blockTag: blockNumber }, common)
		expect(block).toBeInstanceOf(Block)
		expect(block.header.number).toBe(blockNumber)
		expect(rpcBlock.hash).toBe(blockHash)
		expect(bytesToHex(block.header.parentHash)).toBe(mockRpcHashes[0])
		expect(block.toJSON().transactions).toHaveLength(0)
	})

	it('should fetch a block by hash', async () => {
		const common = optimism.copy()

		const [block, rpcBlock] = await getBlockFromRpc(baseChain, { transport: mockTransport, blockTag: blockHash }, common)
		expect(block).toBeInstanceOf(Block)
		expect(block.header.number).toBe(blockNumber)
		expect(rpcBlock.hash).toBe(blockHash)
		expect(bytesToHex(block.header.parentHash)).toBe(mockRpcHashes[0])
	})

	it('should handle invalid block tag', async () => {
		const common = optimism.copy()
		const invalidBlockTag = '0x420420430d3c6d32d4391353b2de38d335443d6399eccd7f639cd73027420420'

		const err = await getBlockFromRpc(baseChain, { transport: mockTransport, blockTag: invalidBlockTag as any }, common).catch(
			(e) => e,
		)
		expect(err).toBeInstanceOf(UnknownBlockError)
		expect(err).toMatchSnapshot()
	})

	it('should throw InvalidBlockError for an invalid block tag', async () => {
		const common = optimism.copy()
		const invalidBlockTag = 'invalid-tag'

		const error = await getBlockFromRpc(
			createBaseChain({ common: optimism.copy() }),
			// @ts-expect-error
			{ transport: mockTransport, blockTag: invalidBlockTag },
			common,
		).catch((e) => e)

		expect(error).toBeInstanceOf(InvalidBlockError)
		expect(error.message).toContain('Invalid blocktag')
		expect(error.message).toContain(invalidBlockTag)
	})

	it('should handle a fetch error', async () => {
		const transport = custom({
			request: () => {
				throw new Error('fetch error')
			},
		})({ retryCount: 0 })
		const common = optimism.copy()

		const err = await getBlockFromRpc(baseChain, { transport, blockTag: blockNumber }, common).catch((e) => e)
		expect(err).toMatchSnapshot()
		const err2 = await getBlockFromRpc(baseChain, { transport, blockTag: blockHash }, common).catch((e) => e)
		expect(err2).toMatchSnapshot()
		const err3 = await getBlockFromRpc(baseChain, { transport, blockTag: 'latest' }, common).catch((e) => e)
		expect(err3).toMatchSnapshot()
	})

	it('should handle non-existing block number', async () => {
		const common = optimism.copy()
		const nonExistingBlockNumber = 99999999999999999n

		const err = await getBlockFromRpc(baseChain, { transport: mockTransport, blockTag: nonExistingBlockNumber }, common).catch(
			(e) => e,
		)

		expect(err).toBeInstanceOf(UnknownBlockError)
		expect(err).toMatchSnapshot()
	})

	it('should handle non-existing block hash', async () => {
		const common = optimism.copy()
		const nonExistingBlockHash = `0x${'0'.repeat(64)}` as const

		const err = await getBlockFromRpc(baseChain, { transport: mockTransport, blockTag: nonExistingBlockHash }, common).catch(
			(e) => e,
		)
		expect(err).toBeInstanceOf(UnknownBlockError)
		expect(err).toMatchSnapshot()
	})

	it('shoudl handle unlikely event of a non-existing named block tag', async () => {
		const transport = custom({
			request: () => {
				return Promise.resolve(undefined)
			},
		})({ retryCount: 0 })
		const common = optimism.copy()
		const nonExistingBlockTag = 'latest'

		const err = await getBlockFromRpc(baseChain, { transport, blockTag: nonExistingBlockTag }, common).catch((e) => e)
		expect(err).toBeInstanceOf(UnknownBlockError)
		expect(err).toMatchSnapshot()
	})

	it('should handle Optimism deposit transactions filtering', async () => {
		const common = optimism.copy()
		const depositTransport = {
			request: async () => ({
				...mockRpcBlocks[1],
				transactions: [{ hash: `0x${'7e'.repeat(32)}`, type: '0x7e' }],
			}),
		}

		const baseChain = createBaseChain({ common })
		const consoleWarnSpy = vi.fn()
		baseChain.logger.warn = consoleWarnSpy

		const [block] = await getBlockFromRpc(baseChain, { transport: depositTransport, blockTag: blockNumber }, common)
		await getBlockFromRpc(baseChain, { transport: depositTransport, blockTag: blockNumber }, common)
		await getBlockFromRpc(baseChain, { transport: depositTransport, blockTag: blockNumber }, common)
		expect(block).toBeInstanceOf(Block)
		expect(block.toJSON().transactions).toHaveLength(0)
		expect(consoleWarnSpy).toHaveBeenCalledTimes(3)
		expect(consoleWarnSpy.mock.calls).toMatchSnapshot()
		consoleWarnSpy.mockRestore()
	})
})
