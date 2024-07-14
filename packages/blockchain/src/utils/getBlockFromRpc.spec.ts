import { describe, expect, it, jest } from 'bun:test'
import { Block } from '@tevm/block'
import { optimism } from '@tevm/common'
import { InvalidBlockError, UnknownBlockError } from '@tevm/errors'
import { transports } from '@tevm/test-utils'
import { createBaseChain } from '../createBaseChain.js'
import { getBlockFromRpc } from './getBlockFromRpc.js'

describe('getBlockFromRpc', () => {
	const baseChain = createBaseChain({ common: optimism.copy() })
	it('should fetch the latest block', async () => {
		const transport = transports.optimism
		const common = optimism.copy()

		const block = await getBlockFromRpc(baseChain, { transport, blockTag: 'latest' }, common)
		expect(block).toBeInstanceOf(Block)
		expect(block.header.number).toBeGreaterThanOrEqual(0n)
	})

	it('should fetch a block by number', async () => {
		const transport = transports.optimism
		const common = optimism.copy()
		const blockNumber = 122606365n

		const block = await getBlockFromRpc(baseChain, { transport, blockTag: blockNumber }, common)
		expect(block).toBeInstanceOf(Block)
		expect(block.header.number).toBe(blockNumber)
	})

	it('should fetch a block by hash', async () => {
		const transport = transports.optimism
		const common = optimism.copy()
		const blockHash = '0x6d4f1b3c89f9a26e7b1d8af7b093b8936d4d1af7989d0b1a7b1a2b0b0b6a6a6a'

		const block = await getBlockFromRpc(baseChain, { transport, blockTag: blockHash }, common)
		expect(block).toBeInstanceOf(Block)
		expect(block.hash().toString()).toBe(blockHash.slice(2))
	})

	it('should handle invalid block tag', async () => {
		const transport = transports.optimism
		const common = optimism.copy()
		const invalidBlockTag = 'invalid-tag'

		const err = await getBlockFromRpc(baseChain, { transport, blockTag: invalidBlockTag as any }, common).catch(
			(e) => e,
		)
		expect(err).toBeInstanceOf(InvalidBlockError)
		expect(err).toMatchSnapshot()
	})

	it('should handle non-existing block number', async () => {
		const transport = transports.optimism
		const common = optimism.copy()
		const nonExistingBlockNumber = 99999999999n

		const err = await getBlockFromRpc(baseChain, { transport, blockTag: nonExistingBlockNumber }, common).catch(
			(e) => e,
		)

		expect(err).toBeInstanceOf(UnknownBlockError)
		expect(err).toMatchSnapshot()
	})

	it('should handle non-existing block hash', async () => {
		const transport = transports.optimism
		const common = optimism.copy()
		const nonExistingBlockHash = `0x${'0'.repeat(64)}` as const

		const err = await getBlockFromRpc(baseChain, { transport, blockTag: nonExistingBlockHash }, common).catch((e) => e)
		expect(err).toBeInstanceOf(UnknownBlockError)
		expect(err).toMatchSnapshot()
	})

	it('should handle Optimism deposit transactions filtering', async () => {
		const transport = transports.optimism
		const common = optimism.copy()

		const baseChain = createBaseChain({ common })
		const consoleWarnSpy = jest.fn()
		baseChain.logger.warn = consoleWarnSpy

		const block = await getBlockFromRpc(baseChain, { transport, blockTag: 'latest' }, common)
		await getBlockFromRpc(baseChain, { transport, blockTag: 'latest' }, common)
		await getBlockFromRpc(baseChain, { transport, blockTag: 'latest' }, common)
		expect(block).toBeInstanceOf(Block)
		expect(consoleWarnSpy).toHaveBeenCalledTimes(1)
		expect(consoleWarnSpy.mock.calls).toMatchSnapshot()
		consoleWarnSpy.mockRestore()
	})
})
