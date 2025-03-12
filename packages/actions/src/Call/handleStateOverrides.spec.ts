// @ts-nocheck - Disabling TypeScript checks for test file to simplify testing
import { InvalidParamsError } from '@tevm/errors'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { StateOverrideSet } from '../common/StateOverrideSet.js'
import { handleStateOverrides } from './handleStateOverrides.js'

// We need to mock the module before importing it
vi.mock('../SetAccount/setAccountHandler.js', () => ({
	setAccountHandler: vi.fn(),
}))

// Now import the mocked module
import { setAccountHandler } from '../SetAccount/setAccountHandler.js'

describe('handleStateOverrides', () => {
	const mockSetAccountHandlerFn = vi.fn()
	// Create a mock client with required properties
	const mockClient = {
		logger: { error: vi.fn(), warn: vi.fn(), debug: vi.fn() },
		getReceiptsManager: vi.fn(),
		miningConfig: {},
		mode: 'normal',
		getVm: vi.fn(),
		ready: vi.fn(),
		deepCopy: vi.fn(),
	} as any

	beforeEach(() => {
		vi.mocked(setAccountHandler).mockReturnValue(mockSetAccountHandlerFn)
	})

	afterEach(() => {
		vi.clearAllMocks()
	})

	it('should return empty object when stateOverrideSet is undefined', async () => {
		const result = await handleStateOverrides(mockClient, undefined)
		expect(result).toEqual({})
	})

	it('should return empty object when stateOverrideSet is empty', async () => {
		const result = await handleStateOverrides(mockClient, {})
		expect(result).toEqual({})
	})

	it('should process state overrides correctly', async () => {
		mockSetAccountHandlerFn.mockResolvedValue({})

		// We need to use a hex string for code to match the type
		const stateOverrideSet: StateOverrideSet = {
			'0x1234567890123456789012345678901234567890': {
				balance: 1000n,
				nonce: 5n,
				code: '0xabcdef',
				state: { '0x01': '0x02' },
				stateDiff: { '0x03': '0x04' },
			},
		}

		const result = await handleStateOverrides(mockClient, stateOverrideSet)

		expect(result).toEqual({})
		expect(setAccountHandler).toHaveBeenCalledWith(mockClient)
		expect(mockSetAccountHandlerFn).toHaveBeenCalledWith({
			address: '0x1234567890123456789012345678901234567890',
			balance: 1000n,
			nonce: 5n,
			deployedBytecode: '0xabcdef',
			state: { '0x01': '0x02' },
			stateDiff: { '0x03': '0x04' },
			throwOnFail: false,
		})
	})

	it('should return errors when setAccountHandler fails', async () => {
		const error = new Error('Test error')
		mockSetAccountHandlerFn.mockResolvedValue({
			errors: [error],
		})

		const stateOverrideSet: StateOverrideSet = {
			'0x1234567890123456789012345678901234567890': {
				balance: 1000n,
			},
		}

		const result = await handleStateOverrides(mockClient, stateOverrideSet)

		expect(result.errors).toBeDefined()
		if (!result.errors) {
			throw new Error('Expected errors to be defined')
		}
		expect(result.errors).toHaveLength(1)
		expect(result.errors[0]).toBeInstanceOf(InvalidParamsError)
		expect(result.errors[0].cause).toBe(error)
	})

	it('should handle multiple errors with AggregateError', async () => {
		const errors = [new Error('Error 1'), new Error('Error 2')]
		mockSetAccountHandlerFn.mockResolvedValue({
			errors,
		})

		const stateOverrideSet: StateOverrideSet = {
			'0x1234567890123456789012345678901234567890': {
				balance: 1000n,
			},
		}

		const result = await handleStateOverrides(mockClient, stateOverrideSet)

		expect(result.errors).toBeDefined()
		if (!result.errors) {
			throw new Error('Expected errors to be defined')
		}
		expect(result.errors).toHaveLength(1)
		expect(result.errors[0]).toBeInstanceOf(InvalidParamsError)
		expect(result.errors[0].cause).toBeInstanceOf(AggregateError)

		const cause = result.errors[0].cause as AggregateError
		expect(cause.errors).toEqual(errors)
	})
})
