import { isSolidity } from './isSolidity.js'
import { describe, expect, it } from 'vitest'

describe(isSolidity.name, () => {
	it('should return true for .sol files', () => {
		const files = [
			'foo.sol',
			'foo.t.sol',
			'foo.s.sol',
			'foo/bar.sol',
			'foo/bar/baz.sol',
			'.sol/bar/baz.sol',
		]
		files.forEach((file) => {
			expect(isSolidity(file)).toBe(true)
		})
	})

	it('should return false for non .sol files', () => {
		const files = [
			'sol/.sol',
			'foo/bar.ts',
			'bar.sol.ts',
			'sol',
			'.sol/.sol',
			'.sol',
		]
		files.forEach((file) => {
			expect(isSolidity(file)).toBe(false)
		})
	})
})
