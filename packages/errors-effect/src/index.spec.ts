import { describe, expect, it } from 'vitest'
import * as errorsEffect from './index.js'

describe('index', () => {
	it('should export TevmError', () => {
		expect(errorsEffect.TevmError).toBeDefined()
	})

	it('should export EVM errors', () => {
		expect(errorsEffect.InsufficientBalanceError).toBeDefined()
		expect(errorsEffect.OutOfGasError).toBeDefined()
		expect(errorsEffect.RevertError).toBeDefined()
		expect(errorsEffect.InvalidOpcodeError).toBeDefined()
		expect(errorsEffect.StackOverflowError).toBeDefined()
		expect(errorsEffect.StackUnderflowError).toBeDefined()
	})

	it('should export interop helpers', () => {
		expect(errorsEffect.toTaggedError).toBeDefined()
		expect(errorsEffect.toBaseError).toBeDefined()
	})
})
