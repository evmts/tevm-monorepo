import { Effect } from 'effect'
import Ox from 'ox'
import { describe, expect, it, vi } from 'vitest'
import * as Log from './Log.js'

vi.mock('ox', () => {
	return {
		default: {
			Log: {
				assert: vi.fn(),
				isLog: vi.fn(),
				validate: vi.fn(),
				parse: vi.fn(),
				format: vi.fn(),
				create: vi.fn(),
			},
		},
	}
})

describe('Log', () => {
	beforeEach(() => {
		vi.resetAllMocks()
	})

	// Sample data
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

	const sampleLog = {
		address: '0x1234567890123456789012345678901234567890',
		blockHash: '0x1234567890123456789012345678901234567890123456789012345678901234',
		blockNumber: 10n,
		data: '0x1234567890',
		logIndex: 1n,
		removed: false,
		topics: ['0x1234567890123456789012345678901234567890123456789012345678901234'],
		transactionHash: '0x1234567890123456789012345678901234567890123456789012345678901234',
		transactionIndex: 1n,
	}

	describe('assert', () => {
		it('should assert a log successfully', async () => {
			vi.mocked(Ox.Log.assert).mockImplementation(() => {})

			await Effect.runPromise(Log.assert(sampleLogJson))

			expect(Ox.Log.assert).toHaveBeenCalledTimes(1)
			expect(Ox.Log.assert).toHaveBeenCalledWith(sampleLogJson)
		})

		it('should handle errors', async () => {
			const error = new Error('Invalid log')
			vi.mocked(Ox.Log.assert).mockImplementation(() => {
				throw error
			})

			const effect = Log.assert(sampleLogJson)

			await expect(Effect.runPromise(effect)).rejects.toThrow(Log.AssertError)
			await expect(Effect.runPromise(effect)).rejects.toMatchObject({
				name: 'AssertError',
				_tag: 'AssertError',
				cause: error,
			})
		})
	})

	describe('isLog', () => {
		it('should check if a value is a log', () => {
			vi.mocked(Ox.Log.isLog).mockReturnValue(true)

			const result = Log.isLog(sampleLogJson)

			expect(Ox.Log.isLog).toHaveBeenCalledTimes(1)
			expect(Ox.Log.isLog).toHaveBeenCalledWith(sampleLogJson)
			expect(result).toBe(true)
		})

		it('should return false for invalid logs', () => {
			vi.mocked(Ox.Log.isLog).mockReturnValue(false)

			const result = Log.isLog({})

			expect(result).toBe(false)
		})
	})

	describe('validate', () => {
		it('should validate a log', () => {
			vi.mocked(Ox.Log.validate).mockReturnValue(true)

			const result = Log.validate(sampleLogJson)

			expect(Ox.Log.validate).toHaveBeenCalledTimes(1)
			expect(Ox.Log.validate).toHaveBeenCalledWith(sampleLogJson)
			expect(result).toBe(true)
		})

		it('should return false for invalid logs', () => {
			vi.mocked(Ox.Log.validate).mockReturnValue(false)

			const result = Log.validate({})

			expect(result).toBe(false)
		})
	})

	describe('parse', () => {
		it('should parse log from JSON successfully', async () => {
			vi.mocked(Ox.Log.parse).mockReturnValue(sampleLog)

			const result = await Effect.runPromise(Log.parse(sampleLogJson))

			expect(Ox.Log.parse).toHaveBeenCalledTimes(1)
			expect(Ox.Log.parse).toHaveBeenCalledWith(sampleLogJson)
			expect(result).toEqual(sampleLog)
		})

		it('should handle errors', async () => {
			const error = new Error('Failed to parse log')
			vi.mocked(Ox.Log.parse).mockImplementation(() => {
				throw error
			})

			const effect = Log.parse(sampleLogJson)

			await expect(Effect.runPromise(effect)).rejects.toThrow(Log.ParseError)
			await expect(Effect.runPromise(effect)).rejects.toMatchObject({
				name: 'ParseError',
				_tag: 'ParseError',
				cause: error,
			})
		})
	})

	describe('format', () => {
		it('should format log to JSON successfully', async () => {
			vi.mocked(Ox.Log.format).mockReturnValue(sampleLogJson)

			const result = await Effect.runPromise(Log.format(sampleLog))

			expect(Ox.Log.format).toHaveBeenCalledTimes(1)
			expect(Ox.Log.format).toHaveBeenCalledWith(sampleLog)
			expect(result).toEqual(sampleLogJson)
		})

		it('should handle errors', async () => {
			const error = new Error('Failed to format log')
			vi.mocked(Ox.Log.format).mockImplementation(() => {
				throw error
			})

			const effect = Log.format(sampleLog)

			await expect(Effect.runPromise(effect)).rejects.toThrow(Log.FormatError)
			await expect(Effect.runPromise(effect)).rejects.toMatchObject({
				name: 'FormatError',
				_tag: 'FormatError',
				cause: error,
			})
		})
	})

	describe('create', () => {
		it('should create log successfully', async () => {
			const options = {
				address: '0x1234567890123456789012345678901234567890',
				blockHash: '0x1234567890123456789012345678901234567890123456789012345678901234',
				blockNumber: 10n,
				data: '0x1234567890',
				logIndex: 1n,
				removed: false,
				topics: ['0x1234567890123456789012345678901234567890123456789012345678901234'],
				transactionHash: '0x1234567890123456789012345678901234567890123456789012345678901234',
				transactionIndex: 1n,
			}

			vi.mocked(Ox.Log.create).mockReturnValue(sampleLog)

			const result = await Effect.runPromise(Log.create(options))

			expect(Ox.Log.create).toHaveBeenCalledTimes(1)
			expect(Ox.Log.create).toHaveBeenCalledWith(options)
			expect(result).toEqual(sampleLog)
		})

		it('should handle errors', async () => {
			const options = {
				address: '0x1234567890123456789012345678901234567890',
			}

			const error = new Error('Failed to create log')
			vi.mocked(Ox.Log.create).mockImplementation(() => {
				throw error
			})

			const effect = Log.create(options)

			await expect(Effect.runPromise(effect)).rejects.toThrow(Log.CreateError)
			await expect(Effect.runPromise(effect)).rejects.toMatchObject({
				name: 'CreateError',
				_tag: 'CreateError',
				cause: error,
			})
		})
	})
})
