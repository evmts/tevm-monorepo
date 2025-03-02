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
		if (res._tag === 'Success') {
			throw new Error('should throw')
		}
		expect(res.cause).toMatchInlineSnapshot(`
				{
				  "_id": "Cause",
				  "_tag": "Fail",
				  "failure": [Error: Failed to create require for /Users/williamcory/tevm-monorepo/packages/effect/src/],
				}
			`)
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
		if (res._tag === 'Success') {
			throw new Error('should throw')
		}
		expect(res.cause).toMatchInlineSnapshot(`
				{
				  "_id": "Cause",
				  "_tag": "Fail",
				  "failure": [Error: Failed to require ./foo],
				}
			`)
	})
})
