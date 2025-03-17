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

	it('should handle paths with multiple file extensions correctly', () => {
		const files = ['foo.sol.backup', 'foo.sol.txt', 'contract.sol.1', 'backup.sol.bak']
		files.forEach((file) => {
			expect(isSolidity(file)).toBe(false)
		})
	})

	it('should handle uppercase or mixed case .sol extensions', () => {
		const files = ['foo.SOL', 'bar.Sol', 'Contract.SoL']
		files.forEach((file) => {
			expect(isSolidity(file)).toBe(false) // Current implementation is case-sensitive
		})
	})
})
