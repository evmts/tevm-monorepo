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
})
