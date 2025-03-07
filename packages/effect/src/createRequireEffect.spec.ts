import { createRequire } from 'node:module'
import { runSync, runSyncExit } from 'effect/Effect'
import { type MockedFunction, beforeEach, describe, expect, it, vi } from 'vitest'
import { createRequireEffect } from './createRequireEffect.js'

vi.mock('node:module', () => ({
	createRequire: vi.fn(),
}))

const mockCreateRequire = createRequire as MockedFunction<typeof import('node:module').createRequire>

describe(createRequireEffect.name, () => {
	beforeEach(() => {
		mockCreateRequire.mockReset()
	})

	it('should return the require function successfully', async () => {
		const dummyUrl = new URL('.', import.meta.url).pathname
		const dummyRequireFunction = (id: string) => id

		mockCreateRequire.mockReturnValue(dummyRequireFunction as any)

		const requireAsEffect = runSync(createRequireEffect(dummyUrl))

		expect(mockCreateRequire).toHaveBeenCalledOnce()
		expect(mockCreateRequire).toHaveBeenCalledWith(dummyUrl)
		expect(runSync(requireAsEffect('./foo'))).toBe('./foo')
	})

	it('should throw CreateRequireError when createRequire fails', async () => {
		const dummyUrl = new URL('.', import.meta.url).pathname
		const dummyError = new Error('createRequire failed')

		mockCreateRequire.mockImplementation(() => {
			throw dummyError
		})

		const res = runSyncExit(createRequireEffect(dummyUrl).pipe())

		// Just check that it's a failure
		expect(res._tag).toBe('Failure')
		// Check for _tag value rather than specific error message content
		expect(JSON.stringify(res)).toContain('CreateRequireError')
	})

	it('should throw RequireError when the require throws', async () => {
		const dummyUrl = new URL('.', import.meta.url).pathname
		const dummyRequireFunction = () => {
			throw new Error('require failed')
		}

		mockCreateRequire.mockReturnValueOnce(dummyRequireFunction as any)

		const requireAsEffect = runSync(createRequireEffect(dummyUrl))

		expect(mockCreateRequire).toHaveBeenCalledWith(dummyUrl)

		const res = runSyncExit(requireAsEffect('./foo'))

		// Just check that it's a failure
		expect(res._tag).toBe('Failure')
		// Check for the error type rather than specific content
		expect(JSON.stringify(res)).toContain('RequireError')
	})
})
