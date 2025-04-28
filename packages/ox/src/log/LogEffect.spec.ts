import { Effect } from 'effect'
import * as Address from 'ox/core/Address'
import * as Hex from 'ox/core/Hex'
import { describe, expect, it } from 'vitest'
import { LogEffectLive } from './LogEffect.js'

describe('LogEffect', () => {
	// Sample data for testing
	const sampleLogJson = {
		address: '0x1234567890123456789012345678901234567890',
		blockHash: '0x1234567890123456789012345678901234567890123456789012345678901234',
		blockNumber: '0xa',
		data: '0x1234567890',
		logIndex: '0x1',
		removed: false,
		topics: ['0x1234567890123456789012345678901234567890123456789012345678901234'],
		transactionHash: '0x1234567890123456789012345678901234567890123456789012345678901234',
		transactionIndex: '0x1',
	}

	it('should parse log from JSON', async () => {
		const result = await Effect.runPromise(LogEffectLive.parseEffect(sampleLogJson))

		expect(result).toBeDefined()
		expect(result.address).toBeDefined()
		expect(result.blockHash).toBeDefined()
		expect(result.blockNumber).toBe(10n) // 0xa in decimal
		expect(result.data).toBeDefined()
		expect(result.logIndex).toBe(1n)
		expect(result.removed).toBe(false)
		expect(result.topics).toHaveLength(1)
		expect(result.transactionHash).toBeDefined()
		expect(result.transactionIndex).toBe(1n)
	})

	it('should format log to JSON', async () => {
		// First parse the log
		const log = await Effect.runPromise(LogEffectLive.parseEffect(sampleLogJson))

		// Then format it back to JSON
		const result = await Effect.runPromise(LogEffectLive.formatEffect(log))

		expect(result).toBeDefined()
		expect(result.address).toBe(sampleLogJson.address)
		expect(result.blockHash).toBe(sampleLogJson.blockHash)
		expect(result.blockNumber).toBe(sampleLogJson.blockNumber)
		expect(result.data).toBe(sampleLogJson.data)
		expect(result.logIndex).toBe(sampleLogJson.logIndex)
		expect(result.removed).toBe(sampleLogJson.removed)
		expect(result.topics).toHaveLength(1)
		expect(result.transactionHash).toBe(sampleLogJson.transactionHash)
		expect(result.transactionIndex).toBe(sampleLogJson.transactionIndex)
	})

	it('should create log from components', async () => {
		const address = await Effect.runPromise(
			Effect.try(() => Address.parse('0x1234567890123456789012345678901234567890')),
		)

		const blockHash = await Effect.runPromise(
			Effect.try(() => Hex.parse('0x1234567890123456789012345678901234567890123456789012345678901234')),
		)

		const topics = [
			await Effect.runPromise(
				Effect.try(() => Hex.parse('0x1234567890123456789012345678901234567890123456789012345678901234')),
			),
		]

		const result = await Effect.runPromise(
			LogEffectLive.createEffect({
				address,
				blockHash,
				blockNumber: 10n,
				data: '0x1234567890',
				logIndex: 1n,
				removed: false,
				topics,
				transactionHash: '0x1234567890123456789012345678901234567890123456789012345678901234',
				transactionIndex: 1n,
			}),
		)

		expect(result).toBeDefined()
		expect(result.address).toEqual(address)
		expect(result.blockHash).toEqual(blockHash)
		expect(result.blockNumber).toBe(10n)
		expect(result.logIndex).toBe(1n)
		expect(result.removed).toBe(false)
		expect(result.topics).toHaveLength(1)
		expect(result.transactionIndex).toBe(1n)
	})

	it('should validate a log object', async () => {
		const isValid = await Effect.runPromise(LogEffectLive.validateEffect(sampleLogJson))

		expect(isValid).toBe(true)
	})

	it('should check if a value is a log', async () => {
		const isLog = await Effect.runPromise(LogEffectLive.isLogEffect(sampleLogJson))

		expect(isLog).toBe(true)
	})

	it('should assert a log object', async () => {
		// This should not throw
		await Effect.runPromise(LogEffectLive.assertEffect(sampleLogJson))
	})

	it('should handle errors gracefully', async () => {
		// Create an invalid log
		const invalidLog = {
			// Missing required fields
			address: '0x1234567890123456789012345678901234567890',
		}

		try {
			await Effect.runPromise(LogEffectLive.parseEffect(invalidLog as any))
			expect.fail('Should have thrown an error')
		} catch (error) {
			expect(error).toBeDefined()
		}
	})
})
