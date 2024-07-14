import { describe, expect, it } from 'bun:test'
import { Block } from '@tevm/block'
import { transports } from '@tevm/test-utils'
import { getBlockFromRpc } from './getBlockFromRpc.js'
import { optimism } from '@tevm/common'

describe('getBlockFromRpc', () => {
	it('should fetch the latest block', async () => {
		const transport = transports.optimism
		const common = optimism.copy()

		const block = await getBlockFromRpc({ transport, blockTag: 'latest' }, common)
		expect(block).toBeInstanceOf(Block)
		expect(block.header.number).toBeGreaterThanOrEqual(0n)
	})

	it('should fetch a block by number', async () => {
		const transport = transports.optimism
		const common = optimism.copy()
		const blockNumber = 122606365n

		const block = await getBlockFromRpc({ transport, blockTag: blockNumber }, common)
		expect(block).toBeInstanceOf(Block)
		expect(block.header.number).toBe(blockNumber)
	})

	it('should fetch a block by hash', async () => {
		const transport = transports.optimism
		const common = optimism.copy()
		const blockHash = '0x6d4f1b3c89f9a26e7b1d8af7b093b8936d4d1af7989d0b1a7b1a2b0b0b6a6a6a'

		const block = await getBlockFromRpc({ transport, blockTag: blockHash }, common)
		expect(block).toBeInstanceOf(Block)
		expect(block.hash().toString('hex')).toBe(blockHash.slice(2))
	})

	it('should handle invalid block tag', async () => {
		const transport = transports.optimism
		const common = optimism.copy()
		const invalidBlockTag = 'invalid-tag'

		await expect(getBlockFromRpc({ transport, blockTag: invalidBlockTag as any }, common)).rejects.toThrow(
			`Invalid blocktag ${invalidBlockTag}`,
		)
	})

	it('should handle non-existing block number', async () => {
		const transport = transports.optimism
		const common = optimism.copy()
		const nonExistingBlockNumber = 99999999999n

		await expect(getBlockFromRpc({ transport, blockTag: nonExistingBlockNumber }, common)).rejects.toThrow(
			'No block found',
		)
	})

	it('should handle non-existing block hash', async () => {
		const transport = transports.optimism
		const common = optimism.copy()
		const nonExistingBlockHash = '0x' + '0'.repeat(64)

		await expect(getBlockFromRpc({ transport, blockTag: nonExistingBlockHash }, common)).rejects.toThrow(
			'No block found',
		)
	})

	it('should handle Optimism deposit transactions filtering', async () => {
		const transport = transports.optimism
		const common = optimism.copy()

		const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})

		const block = await getBlockFromRpc({ transport, blockTag: 'latest' }, common)
		expect(block).toBeInstanceOf(Block)
		expect(consoleWarnSpy).toHaveBeenCalled()

		consoleWarnSpy.mockRestore()
	})
})
