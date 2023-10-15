import { isRelativeSolidity } from './isRelativeSolidity.js'
import { describe, expect, it } from 'vitest'

describe(isRelativeSolidity.name, () => {
	it('should return true for .sol files', () => {
		const files = [
			'./foo.sol',
			'./foo.t.sol',
			'./foo.s.sol',
			'./foo/bar.sol',
			'./foo/bar/baz.sol',
			'./.sol/bar/baz.sol',
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
		]
		files.forEach((file) => {
			expect(isRelativeSolidity(file)).toBe(false)
		})
	})

	it('should return false for non relative .sol files', () => {
		const files = [
			'.sol.sol',
			'/foo/bar/baz.sol',
			'foo/bar/baz.sol',
			'bar/baz.sol',
			'./bar.sol.ts',
		]
		files.forEach((file) => {
			expect(isRelativeSolidity(file)).toBe(false)
		})
	})
})
