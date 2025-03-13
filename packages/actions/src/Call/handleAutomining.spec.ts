import { createTevmNode } from '@tevm/node'
import { transports } from '@tevm/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mineHandler } from '../Mine/mineHandler.js'
import { handleAutomining } from './handleAutomining.js'

// Mock mineHandler module
vi.mock('../Mine/mineHandler.js', () => ({
	mineHandler: vi.fn(),
}))

describe('handleAutomining', () => {
	let client: ReturnType<typeof createTevmNode>

	beforeEach(() => {
		// Reset mocks
		vi.resetAllMocks()

		// Create a default client
		client = createTevmNode({
			fork: { transport: transports.optimism },
			miningConfig: { type: 'auto' }, // Default to auto mining
		})

		// Add debug logger if not present
		if (!client.logger.debug) {
			client.logger.debug = vi.fn()
		}
	})

	afterEach(() => {
		vi.resetAllMocks()
	})

	it('should return undefined if mining type is not auto', async () => {
		// Override with a manual mining client
		client = createTevmNode({
			fork: { transport: transports.optimism },
			miningConfig: { type: 'manual' },
		})

		// Mock debug logger
		client.logger.debug = vi.fn()

		// Should not call mineHandler
		const mineHandlerMock = mineHandler as unknown as ReturnType<typeof vi.fn>
		mineHandlerMock.mockImplementation(() => {
			throw new Error('This should not be called')
		})

		const result = await handleAutomining(client)

		// Should not log anything
		expect(client.logger.debug).not.toHaveBeenCalled()

		// Should not call mineHandler
		expect(mineHandlerMock).not.toHaveBeenCalled()

		// Should return undefined
		expect(result).toBeUndefined()
	})

	it('should mine transaction if mining type is auto', async () => {
		// Spy on debug logger
		const debugSpy = vi.spyOn(client.logger, 'debug')

		// Mock mineHandler to return successful result
		const mineHandlerMock = mineHandler as unknown as ReturnType<typeof vi.fn>
		mineHandlerMock.mockImplementation(
			() => () =>
				Promise.resolve({
					blockHashes: ['0xabc123'],
				}),
		)

		const txHash = '0x123456789abcdef'
		const result = await handleAutomining(client, txHash)

		// Should log the mining process
		expect(debugSpy).toHaveBeenCalledWith(`Automining transaction ${txHash}...`)
		expect(debugSpy).toHaveBeenCalledWith(
			expect.objectContaining({
				blockHashes: ['0xabc123'],
			}),
			'Transaction successfully mined',
		)

		// Should call mineHandler with throwOnFail: false
		expect(mineHandlerMock).toHaveBeenCalledWith(client)
		expect(mineHandlerMock).toHaveBeenCalledTimes(1)

		// Should return undefined when successful
		expect(result).toBeUndefined()
	})

	it('should return mineHandler result if there are errors', async () => {
		// Spy on debug logger
		const debugSpy = vi.spyOn(client.logger, 'debug')

		// Mock mineHandler to return error result
		const mineError = {
			_tag: 'TevmMineError',
			name: 'MiningError',
			message: 'Failed to mine transaction',
		}

		const mineHandlerMock = mineHandler as unknown as ReturnType<typeof vi.fn>
		mineHandlerMock.mockImplementation(
			() => () =>
				Promise.resolve({
					errors: [mineError],
				}),
		)

		const txHash = '0x123456789abcdef'
		const result = await handleAutomining(client, txHash)

		// Should log the mining process start
		expect(debugSpy).toHaveBeenCalledWith(`Automining transaction ${txHash}...`)

		// Should not log success
		expect(debugSpy).not.toHaveBeenCalledWith(expect.anything(), 'Transaction successfully mined')

		// Should call mineHandler with throwOnFail: false
		expect(mineHandlerMock).toHaveBeenCalledWith(client)
		expect(mineHandlerMock).toHaveBeenCalledTimes(1)

		// Should return error result
		expect(result).toBeDefined()
		if (result) {
			expect(result.errors).toBeDefined()
			expect(result.errors).toHaveLength(1)
			expect(result.errors?.[0]).toEqual(mineError)
		}
	})

	it('should work with empty errors array', async () => {
		// Spy on debug logger
		const debugSpy = vi.spyOn(client.logger, 'debug')

		// Mock mineHandler to return empty errors array
		const mineHandlerMock = mineHandler as unknown as ReturnType<typeof vi.fn>
		mineHandlerMock.mockImplementation(
			() => () =>
				Promise.resolve({
					errors: [], // Empty errors array
				}),
		)

		const txHash = '0x123456789abcdef'
		const result = await handleAutomining(client, txHash)

		// Should log the mining process
		expect(debugSpy).toHaveBeenCalledWith(`Automining transaction ${txHash}...`)

		// Should log success (since errors array is empty)
		expect(debugSpy).toHaveBeenCalledWith(expect.objectContaining({ errors: [] }), 'Transaction successfully mined')

		// Should return undefined (successful case)
		expect(result).toBeUndefined()
	})

	it('should handle undefined txHash gracefully', async () => {
		// Spy on debug logger
		const debugSpy = vi.spyOn(client.logger, 'debug')

		// Mock mineHandler to return successful result
		const mineHandlerMock = mineHandler as unknown as ReturnType<typeof vi.fn>
		mineHandlerMock.mockImplementation(
			() => () =>
				Promise.resolve({
					blockHashes: ['0xabc123'],
				}),
		)

		// Call without a txHash
		const result = await handleAutomining(client)

		// Should log with undefined txHash
		expect(debugSpy).toHaveBeenCalledWith(`Automining transaction ${undefined}...`)

		// Rest of the function should work normally
		expect(mineHandlerMock).toHaveBeenCalledWith(client)
		expect(result).toBeUndefined()
	})

	it('should work with interval mining type', async () => {
		// Create client with interval mining
		client = createTevmNode({
			fork: { transport: transports.optimism },
			miningConfig: { type: 'interval', interval: 1000 },
		})

		// Add debug logger if not present
		if (!client.logger.debug) {
			client.logger.debug = vi.fn()
		}

		// Mock mineHandler
		const mineHandlerMock = mineHandler as unknown as ReturnType<typeof vi.fn>
		mineHandlerMock.mockImplementation(() => {
			throw new Error('This should not be called')
		})

		const result = await handleAutomining(client, '0x123')

		// Should not call mineHandler for interval type
		expect(mineHandlerMock).not.toHaveBeenCalled()

		// Should return undefined
		expect(result).toBeUndefined()
	})

	it('should mine transaction if isGasMining is true', async () => {
		// Create client with gas mining configuration
		client = createTevmNode({
			fork: { transport: transports.optimism },
			miningConfig: { type: 'gas', limit: BigInt(1000000) },
		})

		// Add debug logger if not present
		if (!client.logger.debug) {
			client.logger.debug = vi.fn()
		}

		// Spy on debug logger
		const debugSpy = vi.spyOn(client.logger, 'debug')

		// Mock mineHandler to return successful result
		const mineHandlerMock = mineHandler as unknown as ReturnType<typeof vi.fn>
		mineHandlerMock.mockImplementation(
			() => (params: any) =>
				Promise.resolve({
					blockHashes: ['0xabc123'],
				}),
		)

		const txHash = '0x123456789abcdef'
		const result = await handleAutomining(client, txHash, true)

		// Should log the gas mining process
		expect(debugSpy).toHaveBeenCalledWith(`Gas mining transaction ${txHash}...`)
		expect(debugSpy).toHaveBeenCalledWith(
			expect.objectContaining({
				blockHashes: ['0xabc123'],
			}),
			'Transaction successfully mined'
		)

		// Should log gas mining mode with limit
		expect(debugSpy).toHaveBeenCalledWith(`Gas mining mode with limit ${client.miningConfig.limit}`)

		// Should call mineHandler with throwOnFail: false and blocks: 1
		expect(mineHandlerMock).toHaveBeenCalledWith(client)
		expect(mineHandlerMock).toHaveBeenCalledTimes(1)
		
		// Verify parameters passed to mineHandler
		const mineHandlerCall = mineHandlerMock.mock.results[0].value
		expect(mineHandlerCall).toHaveBeenCalledWith(expect.objectContaining({
			throwOnFail: false,
			blocks: 1
		}))

		// Should return undefined when successful
		expect(result).toBeUndefined()
	})

	it('should not mine transaction if isGasMining is true but mining type is not gas', async () => {
		// Create client with manual mining
		client = createTevmNode({
			fork: { transport: transports.optimism },
			miningConfig: { type: 'manual' },
		})

		// Add debug logger if not present
		if (!client.logger.debug) {
			client.logger.debug = vi.fn()
		}

		// Spy on debug logger
		const debugSpy = vi.spyOn(client.logger, 'debug')

		// Mock mineHandler
		const mineHandlerMock = mineHandler as unknown as ReturnType<typeof vi.fn>
		mineHandlerMock.mockImplementation(
			() => (params: any) =>
				Promise.resolve({
					blockHashes: ['0xabc123'],
				}),
		)

		const txHash = '0x123456789abcdef'
		const result = await handleAutomining(client, txHash, true)

		// Should still log gas mining (based on isGasMining flag)
		expect(debugSpy).toHaveBeenCalledWith(`Gas mining transaction ${txHash}...`)

		// Should not log gas limit (since it's not gas mining type)
		expect(debugSpy).not.toHaveBeenCalledWith(expect.stringContaining('Gas mining mode with limit'))

		// Should still call mineHandler (based on isGasMining flag)
		expect(mineHandlerMock).toHaveBeenCalledWith(client)
		expect(mineHandlerMock).toHaveBeenCalledTimes(1)

		// Should return undefined when successful
		expect(result).toBeUndefined()
	})
})
