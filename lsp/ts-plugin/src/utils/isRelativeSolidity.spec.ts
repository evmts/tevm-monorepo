import { describe, expect, it } from 'vitest'
import { isRelativeSolidity } from './isRelativeSolidity.js'

describe(isRelativeSolidity.name, () => {
	it('should return true for .sol files', () => {
		const files = [
			'./foo.sol',
			'./foo.t.sol',
			'./foo.s.sol',
			'./foo/bar.sol',
			'./foo/bar/baz.sol',
			'./.sol/bar/baz.sol',
			'../foo.sol',
			'../foo.t.sol',
			'../foo.s.sol',
			'../foo/bar.sol',
			'../foo/bar/baz.sol',
			'../.sol/bar/baz.sol',
			'../../../../../.sol/bar/baz.sol',
		]
		files.forEach((file) => {
			expect(isRelativeSolidity(file)).toBe(true)
		})
	})

	it('should return false for non .sol files', () => {
		const files = [
			'.sol.sol',
			'./foo/bar.ts',
			'./bar.sol.ts',
			'./sol',
			'./.sol',
			'../foo/bar.ts',
			'../bar.sol.ts',
			'../sol',
			'../../../.sol',
		]
		files.forEach((file) => {
			expect(isRelativeSolidity(file)).toBe(false)
		})
	})

	it('should return false for non relative .sol files', () => {
		const files = ['.sol.sol', '/foo/bar/baz.sol', 'foo/bar/baz.sol', 'bar/baz.sol', './bar.sol.ts', '../bar.sol.ts']
		files.forEach((file) => {
			expect(isRelativeSolidity(file)).toBe(false)
		})
	})

	it('should handle complex relative paths correctly', () => {
		const files = [
			'./some/very/deep/path/with/../backtracking/contract.sol',
			'../../../contract.sol',
			'./../folder/contract.sol',
			'./folder/.././contract.sol'
		]
		files.forEach((file) => {
			expect(isRelativeSolidity(file)).toBe(true)
		})
	})

	it('should handle paths with dots that are not relative paths', () => {
		const files = [
			'.contract.sol',           // Starts with dot but not relative
			'folder.with.dots/file.sol', // Has dots but not relative
			'/absolute/path.sol',      // Absolute path
			'dot.folder/./file.sol'    // Has ./ but not at start
		]
		files.forEach((file) => {
			expect(isRelativeSolidity(file)).toBe(false)
		})
	})
})
