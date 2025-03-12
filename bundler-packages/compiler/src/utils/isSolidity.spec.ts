import { describe, expect, it } from 'vitest'
import { isSolidity } from './isSolidity.js'

describe(isSolidity.name, () => {
	it('should return true for .sol files', () => {
		const files = ['foo.sol', 'foo.t.sol', 'foo.s.sol', 'foo/bar.sol', 'foo/bar/baz.sol', '.sol/bar/baz.sol']
		files.forEach((file) => {
			expect(isSolidity(file)).toBe(true)
		})
	})

	it('should return false for non .sol files', () => {
		const files = ['sol/.sol', 'foo/bar.ts', 'bar.sol.ts', 'sol', '.sol/.sol', '.sol']
		files.forEach((file) => {
			expect(isSolidity(file)).toBe(false)
		})
	})

	it('should handle uppercase .sol extensions', () => {
		expect(isSolidity('contract.SOL')).toBe(true)
		expect(isSolidity('contract.Sol')).toBe(true)
		expect(isSolidity('contract.sOl')).toBe(true)
		expect(isSolidity('contract.soL')).toBe(true)
	})

	it('should handle paths with special characters', () => {
		expect(isSolidity('path with spaces/contract.sol')).toBe(true)
		expect(isSolidity('path-with-dashes/contract.sol')).toBe(true)
		expect(isSolidity('path_with_underscores/contract.sol')).toBe(true)
		expect(isSolidity('path.with.dots/contract.sol')).toBe(true)
		expect(isSolidity('contract name with spaces.sol')).toBe(true)
	})

	it('should handle URLs and query parameters', () => {
		expect(isSolidity('https://example.com/contract.sol')).toBe(true)
		expect(isSolidity('contract.sol?version=1.0.0')).toBe(true)
		expect(isSolidity('contract.sol#L1-L10')).toBe(true)
	})

	it('should correctly handle edge cases', () => {
		expect(isSolidity('.sol.sol')).toBe(true)
		expect(isSolidity('.sol.sol.sol')).toBe(true)
		expect(isSolidity('contract.sol/')).toBe(false)
		expect(isSolidity('contract.sol\\')).toBe(true) // Backslash is just a character, not a directory separator in the regex
		expect(isSolidity('contract.solidity')).toBe(false)
		expect(isSolidity('contract.sol.bak')).toBe(false)
	})
})
