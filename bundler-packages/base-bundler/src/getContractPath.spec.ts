import { createRequire } from 'node:module'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getContractPath } from './getContractPath.js'

vi.mock('node:module', () => {
	return {
		createRequire: vi.fn(),
	}
})

describe('getContractPath', () => {
	const mockRequire = {
		resolve: vi.fn(),
	}

	beforeEach(() => {
		vi.resetAllMocks()
		;(createRequire as any).mockReturnValue(mockRequire)
	})

	afterEach(() => {
		vi.clearAllMocks()
	})

	it('should return tevm/contract if it exists', () => {
		mockRequire.resolve.mockImplementation((path) => {
			if (path === 'tevm/contract') return '/path/to/tevm/contract'
			throw new Error(`Cannot find module '${path}'`)
		})

		const result = getContractPath('/test/path')
		expect(result).toBe('tevm/contract')
		expect(createRequire).toHaveBeenCalledWith('/test/path/')
		expect(mockRequire.resolve).toHaveBeenCalledWith('tevm/contract')
	})

	it('should return @tevm/contract if tevm/contract does not exist', () => {
		mockRequire.resolve.mockImplementation((path) => {
			if (path === '@tevm/contract') return '/path/to/@tevm/contract'
			throw new Error(`Cannot find module '${path}'`)
		})

		const result = getContractPath('/test/path')
		expect(result).toBe('@tevm/contract')
		expect(createRequire).toHaveBeenCalledWith('/test/path/')
		expect(mockRequire.resolve).toHaveBeenCalledWith('tevm/contract')
		expect(mockRequire.resolve).toHaveBeenCalledWith('@tevm/contract')
	})

	it('should handle paths with trailing slash correctly', () => {
		mockRequire.resolve.mockImplementation((path) => {
			if (path === 'tevm/contract') return '/path/to/tevm/contract'
			throw new Error(`Cannot find module '${path}'`)
		})

		const result = getContractPath('/test/path/')
		expect(result).toBe('tevm/contract')
		expect(createRequire).toHaveBeenCalledWith('/test/path/')
	})

	it('should fall back to tevm/contract if neither package is found', () => {
		mockRequire.resolve.mockImplementation(() => {
			throw new Error('Cannot find module')
		})

		// Spy on console.warn
		const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

		const result = getContractPath('/test/path')
		expect(result).toBe('tevm/contract')
		expect(consoleWarnSpy).toHaveBeenCalled()
		expect(consoleWarnSpy.mock.calls[0]?.[0]).toContain('Could not find tevm/contract or @tevm/contract')

		consoleWarnSpy.mockRestore()
	})

	it('should try packages in the correct order', () => {
		// Create a mock implementation that tracks the order of calls
		const callOrder: string[] = []
		mockRequire.resolve.mockImplementation((path) => {
			callOrder.push(path)
			if (path === '@tevm/contract') return '/path/to/@tevm/contract'
			throw new Error(`Cannot find module '${path}'`)
		})

		getContractPath('/test/path')

		// Verify the first package tried is tevm/contract, followed by @tevm/contract
		expect(callOrder[0]).toBe('tevm/contract')
		expect(callOrder[1]).toBe('@tevm/contract')
	})

	it('should handle various path formats correctly', () => {
		mockRequire.resolve.mockReturnValue('/some/path')

		// Test with different path formats
		getContractPath('/absolute/path')
		expect(createRequire).toHaveBeenCalledWith('/absolute/path/')

		getContractPath('relative/path')
		expect(createRequire).toHaveBeenCalledWith('relative/path/')

		getContractPath('.')
		expect(createRequire).toHaveBeenCalledWith('./')

		getContractPath('')
		expect(createRequire).toHaveBeenCalledWith('/')
	})

	it('should handle errors thrown by require.resolve gracefully', () => {
		// Test with different error types
		mockRequire.resolve.mockImplementation(() => {
			throw new TypeError('Custom type error')
		})

		const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
		const result1 = getContractPath('/test/path')
		expect(result1).toBe('tevm/contract') // Still falls back to default

		// Change error to be a non-Error object
		mockRequire.resolve.mockImplementation(() => {
			throw 'String error' as any
		})

		const result2 = getContractPath('/test/path')
		expect(result2).toBe('tevm/contract')

		consoleWarnSpy.mockRestore()
	})

	it('should handle symlinked paths correctly', () => {
		// Mock path to simulate a symlinked directory structure
		const symbolicPath = '/symlink/to/project'
		const realPath = '/real/path/to/project'
		
		// Setup mocks to recognize both paths
		mockRequire.resolve.mockImplementation((modulePath) => {
			if (modulePath === 'tevm/contract') {
				return `${realPath}/node_modules/tevm/contract/index.js`
			}
			throw new Error(`Cannot find module '${modulePath}'`)
		})
		
		// Create require should use the symbolic path as provided
		const result = getContractPath(symbolicPath)
		
		// Verify createRequire was called with the path as provided
		expect(createRequire).toHaveBeenCalledWith(`${symbolicPath}/`)
		expect(result).toBe('tevm/contract')
		
		// Even with a symlink, resolution should still work the same
		expect(mockRequire.resolve).toHaveBeenCalledWith('tevm/contract')
	})
})
