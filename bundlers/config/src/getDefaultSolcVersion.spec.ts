import { getDefaultSolcVersion } from './getDefaultSolcVersion.js'
import { createRequire } from 'module'
import {
	type MockedFunction,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

let version: string | undefined = '0.8.9'
vi.mock('module', () => ({
	createRequire: vi.fn(),
}))

const mockCreateRequire = createRequire as MockedFunction<typeof createRequire>
const mockRequire = vi.fn()
const consoleErrorSpy = vi.fn()

beforeEach(() => {
	vi.resetAllMocks()
	mockRequire.mockReturnValue({ version })
	mockCreateRequire.mockReturnValue(mockRequire as any)
	vi.stubGlobal('console', {
		error: consoleErrorSpy,
	})
})

describe('getDefaultSolcVersion', () => {
	it('should return solc version if available', async () => {
		expect(getDefaultSolcVersion()).toBe(version)
	})

	it('should log error and return undefined if version is not available', async () => {
		version = undefined
		mockRequire.mockReturnValue({ version })
		expect(getDefaultSolcVersion()).toBe(undefined)
		expect(consoleErrorSpy).toBeCalledWith(
			'Failed to get solc version! Please install it or specify a version in your config',
		)
	})
})
