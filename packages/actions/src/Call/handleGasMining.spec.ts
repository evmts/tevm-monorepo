// Removing unused import
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mineHandler } from '../Mine/mineHandler.js'
import { handleGasMining } from './handleGasMining.js'

vi.mock('../Mine/mineHandler.js', () => ({
	mineHandler: vi.fn(),
}))

describe('handleGasMining', () => {
	let mockMineHandler: any
	let mockClient: any

	beforeEach(() => {
		mockMineHandler = vi.fn().mockResolvedValue({ blockHashes: ['0xblock1'] })
		;(mineHandler as any).mockReturnValue(mockMineHandler)

		mockClient = {
			miningConfig: { type: 'gas', limit: 1000000n },
			logger: {
				debug: vi.fn(),
			},
		}
	})

	afterEach(() => {
		vi.resetAllMocks()
	})

	it('should mine a transaction when gas mining is enabled', async () => {
		const result = await handleGasMining(mockClient, '0xtxhash123')

		expect(mineHandler).toHaveBeenCalledWith(mockClient)
		expect(mockMineHandler).toHaveBeenCalledWith({ throwOnFail: false })
		expect(mockClient.logger.debug).toHaveBeenCalledTimes(2)
		expect(result).toBeUndefined()
	})

	it('should return errors if mining fails', async () => {
		const expectedErrors = [{ name: 'MiningError', message: 'Failed to mine' }]
		mockMineHandler.mockResolvedValue({
			errors: expectedErrors,
		})

		const result = await handleGasMining(mockClient, '0xtxhash123')

		expect(result?.errors).toBeDefined()
		expect(result?.errors).toEqual(expectedErrors)
	})

	it('should not mine when gas mining is disabled', async () => {
		mockClient.miningConfig.type = 'manual'

		const result = await handleGasMining(mockClient, '0xtxhash123')

		expect(mineHandler).not.toHaveBeenCalled()
		expect(mockMineHandler).not.toHaveBeenCalled()
		expect(result).toBeUndefined()
	})
})
