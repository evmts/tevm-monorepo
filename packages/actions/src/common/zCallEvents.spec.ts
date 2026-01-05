import { describe, expect, it } from 'vitest'
import { zCallEvents } from './zCallEvents.js'

describe('zCallEvents', () => {
	describe('valid inputs', () => {
		it('should accept empty object', () => {
			const result = zCallEvents.safeParse({})
			expect(result.success).toBe(true)
		})

		it('should accept onStep function', () => {
			const result = zCallEvents.safeParse({
				onStep: () => {},
			})
			expect(result.success).toBe(true)
		})

		it('should accept onStep async function', () => {
			const result = zCallEvents.safeParse({
				onStep: async () => {},
			})
			expect(result.success).toBe(true)
		})

		it('should accept onNewContract function', () => {
			const result = zCallEvents.safeParse({
				onNewContract: () => {},
			})
			expect(result.success).toBe(true)
		})

		it('should accept onNewContract async function', () => {
			const result = zCallEvents.safeParse({
				onNewContract: async () => {},
			})
			expect(result.success).toBe(true)
		})

		it('should accept onBeforeMessage function', () => {
			const result = zCallEvents.safeParse({
				onBeforeMessage: () => {},
			})
			expect(result.success).toBe(true)
		})

		it('should accept onBeforeMessage async function', () => {
			const result = zCallEvents.safeParse({
				onBeforeMessage: async () => {},
			})
			expect(result.success).toBe(true)
		})

		it('should accept onAfterMessage function', () => {
			const result = zCallEvents.safeParse({
				onAfterMessage: () => {},
			})
			expect(result.success).toBe(true)
		})

		it('should accept onAfterMessage async function', () => {
			const result = zCallEvents.safeParse({
				onAfterMessage: async () => {},
			})
			expect(result.success).toBe(true)
		})

		it('should accept all event handlers together', () => {
			const result = zCallEvents.safeParse({
				onStep: () => {},
				onNewContract: () => {},
				onBeforeMessage: () => {},
				onAfterMessage: () => {},
			})
			expect(result.success).toBe(true)
		})

		it('should accept mixed sync and async handlers', () => {
			const result = zCallEvents.safeParse({
				onStep: async () => {},
				onNewContract: () => {},
				onBeforeMessage: async () => {},
				onAfterMessage: () => {},
			})
			expect(result.success).toBe(true)
		})

		it('should accept undefined values for all fields', () => {
			const result = zCallEvents.safeParse({
				onStep: undefined,
				onNewContract: undefined,
				onBeforeMessage: undefined,
				onAfterMessage: undefined,
			})
			expect(result.success).toBe(true)
		})
	})

	describe('invalid inputs', () => {
		it('should reject non-function onStep', () => {
			const result = zCallEvents.safeParse({
				onStep: 'not a function',
			})
			expect(result.success).toBe(false)
		})

		it('should reject non-function onNewContract', () => {
			const result = zCallEvents.safeParse({
				onNewContract: 123,
			})
			expect(result.success).toBe(false)
		})

		it('should reject non-function onBeforeMessage', () => {
			const result = zCallEvents.safeParse({
				onBeforeMessage: {},
			})
			expect(result.success).toBe(false)
		})

		it('should reject non-function onAfterMessage', () => {
			const result = zCallEvents.safeParse({
				onAfterMessage: [],
			})
			expect(result.success).toBe(false)
		})

		it('should reject null onStep', () => {
			const result = zCallEvents.safeParse({
				onStep: null,
			})
			expect(result.success).toBe(false)
		})

		it('should reject null onNewContract', () => {
			const result = zCallEvents.safeParse({
				onNewContract: null,
			})
			expect(result.success).toBe(false)
		})

		it('should reject null onBeforeMessage', () => {
			const result = zCallEvents.safeParse({
				onBeforeMessage: null,
			})
			expect(result.success).toBe(false)
		})

		it('should reject null onAfterMessage', () => {
			const result = zCallEvents.safeParse({
				onAfterMessage: null,
			})
			expect(result.success).toBe(false)
		})

		it('should reject null', () => {
			const result = zCallEvents.safeParse(null)
			expect(result.success).toBe(false)
		})

		it('should reject undefined', () => {
			const result = zCallEvents.safeParse(undefined)
			expect(result.success).toBe(false)
		})

		it('should reject non-object', () => {
			const result = zCallEvents.safeParse('string')
			expect(result.success).toBe(false)
		})

		it('should reject number', () => {
			const result = zCallEvents.safeParse(123)
			expect(result.success).toBe(false)
		})

		it('should reject array', () => {
			const result = zCallEvents.safeParse([])
			expect(result.success).toBe(false)
		})
	})

	describe('schema properties', () => {
		it('should have onStep field description', () => {
			// Description is on the inner schema after unwrapping optional
			const onStepField = zCallEvents.shape.onStep.unwrap()
			expect(onStepField.description).toBe('Handler called on each EVM step (instruction execution)')
		})

		it('should have onNewContract field description', () => {
			const onNewContractField = zCallEvents.shape.onNewContract.unwrap()
			expect(onNewContractField.description).toBe('Handler called when a new contract is created')
		})

		it('should have onBeforeMessage field description', () => {
			const onBeforeMessageField = zCallEvents.shape.onBeforeMessage.unwrap()
			expect(onBeforeMessageField.description).toBe('Handler called before a message (call) is processed')
		})

		it('should have onAfterMessage field description', () => {
			const onAfterMessageField = zCallEvents.shape.onAfterMessage.unwrap()
			expect(onAfterMessageField.description).toBe('Handler called after a message (call) is processed')
		})
	})
})
