import { optimism } from '@tevm/common'
import { bytesToHex } from 'viem'
import { describe, expect, it, vi } from 'vitest'
import { createBaseChain } from '../createBaseChain.js'
import { getMockBlocks } from '../test/getBlocks.js'
import { warnOnce } from './warnOnce.js'

describe(warnOnce.name, () => {
	it('should log a warning once for unsupported transaction type', async () => {
		const common = optimism.copy()
		const options = { common }
		const chain = createBaseChain(options)
		await chain.ready()

		const mockWarn = vi.fn()
		chain.logger.warn = mockWarn

		const warningFunction = warnOnce(chain)

		const mockBlocks = await getMockBlocks()
		const tx = { hash: bytesToHex(mockBlocks[0].hash()) }

		warningFunction(tx as any)
		warningFunction(tx as any)

		expect(mockWarn).toHaveBeenCalledTimes(1)
		expect(mockWarn).toHaveBeenCalledWith(
			`Warning: Optimism deposit transactions (type 0x7e) are currently not supported and will be filtered out of blocks until support is added
filtering out tx ${tx.hash}.
Note: The block hash will be different because of the excluded txs`,
		)
	})

	it('should not log a warning if called more than once', async () => {
		const common = optimism.copy()
		const options = { common }
		const chain = createBaseChain(options)
		await chain.ready()

		const mockWarn = vi.fn()
		chain.logger.warn = mockWarn

		const warningFunction = warnOnce(chain)

		const mockBlocks = await getMockBlocks()
		const tx = { hash: bytesToHex(mockBlocks[0].hash()) }

		warningFunction(tx as any)
		warningFunction(tx as any)
		warningFunction(tx as any)

		expect(mockWarn).toHaveBeenCalledTimes(1)
	})
})
