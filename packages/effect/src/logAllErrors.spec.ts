import * as EffectModule from 'effect/Effect'
import { describe, expect, it, vi } from 'vitest'
import { logAllErrors } from './logAllErrors.js'

// Mock the Effect module
vi.mock('effect/Effect', () => {
	const logErrorMock = vi.fn().mockImplementation((e) => ({
		_tag: 'Success',
		value: `logged: ${e.message || String(e)}`,
	}))

	return {
		logError: logErrorMock,
		all: (effects: any) => ({
			_tag: 'Success',
			value: effects.map((effect: any) => effect.value),
		}),
	}
})

describe('logAllErrors', () => {
	it('should log a simple error', async () => {
		const simpleError = new Error('simple error')
		const result = logAllErrors(simpleError) as any

		expect(result.value).toEqual(['logged: simple error'])
		expect(vi.mocked(EffectModule.logError)).toHaveBeenCalledWith(simpleError)
	})

	it('should log an error and its cause', async () => {
		const causeError = new Error('cause error')
		const mainError = new Error('main error')
		mainError.cause = causeError

		const result = logAllErrors(mainError) as any

		expect(result.value).toEqual(['logged: cause error', 'logged: main error'])
		expect(vi.mocked(EffectModule.logError)).toHaveBeenCalledWith(causeError)
		expect(vi.mocked(EffectModule.logError)).toHaveBeenCalledWith(mainError)
	})

	it('should log multiple levels of error causes', async () => {
		const rootCause = new Error('root cause')
		const middleCause = new Error('middle cause')
		middleCause.cause = rootCause
		const topError = new Error('top error')
		topError.cause = middleCause

		const result = logAllErrors(topError)

		expect((result as any).value).toEqual(['logged: root cause', 'logged: middle cause', 'logged: top error'])
		expect(vi.mocked(EffectModule.logError)).toHaveBeenCalledWith(rootCause)
		expect(vi.mocked(EffectModule.logError)).toHaveBeenCalledWith(middleCause)
		expect(vi.mocked(EffectModule.logError)).toHaveBeenCalledWith(topError)
	})
})
