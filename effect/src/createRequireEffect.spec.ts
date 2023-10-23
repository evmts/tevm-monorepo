// TODO move this to @evmts/createRequire package
import {
	CreateRequireError,
	RequireError,
	createRequireEffect,
} from './createRequireEffect.js'
import { runSync } from 'effect/Effect'
import { createRequire } from 'module'
import {
	type MockedFunction,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

vi.mock('module', () => ({
	createRequire: vi.fn(),
}))

const mockCreateRequire = createRequire as MockedFunction<typeof createRequire>

describe(createRequireEffect.name, () => {
	beforeEach(() => {
		mockCreateRequire.mockReset()
	})

	it('should return the require function successfully', async () => {
		const dummyUrl = 'dummy_url'
		const dummyRequireFunction = (id: string) => id

		mockCreateRequire.mockReturnValueOnce(dummyRequireFunction as any)

		const requireAsEffect = runSync(createRequireEffect(dummyUrl))

		expect(mockCreateRequire).toHaveBeenCalledWith(dummyUrl)
		expect(runSync(requireAsEffect('./foo'))).toBe('./foo')
	})

	it('should throw CreateRequireError when createRequire fails', async () => {
		const dummyUrl = 'dummy_url'
		const dummyError = new Error('createRequire failed')

		mockCreateRequire.mockImplementationOnce(() => {
			throw dummyError
		})

		expect(() => runSync(createRequireEffect(dummyUrl))).toThrowError(
			new CreateRequireError(dummyUrl, dummyError),
		)
	})

	it('should throw RequireError when the require throws', async () => {
		const dummyUrl = 'dummy_url'
		const dummyRequireFunction = () => {
			throw new Error('require failed')
		}

		mockCreateRequire.mockReturnValueOnce(dummyRequireFunction as any)

		const requireAsEffect = runSync(createRequireEffect(dummyUrl))

		expect(mockCreateRequire).toHaveBeenCalledWith(dummyUrl)
		expect(() => runSync(requireAsEffect('./foo'))).toThrowError(
			new RequireError('./foo', dummyUrl),
		)
	})
})
