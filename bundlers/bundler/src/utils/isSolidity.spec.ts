import { isSolidity, parseSolidityFile } from '.'
import { describe, expect, it } from 'vitest'
import { runSync } from 'effect/Effect'

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

describe('parseSolidityFile', () => {
	it('should return a Effect<never, never, string> when parsing a valid solidity file', () => {
		const files = [
			'foo.sol',
			'foo.t.sol',
			'foo.s.sol',
			'foo/bar.sol',
			'foo/bar/baz.sol',
			'.sol/bar/baz.sol',
		]
		files.forEach((file) => {
			expect(runSync(parseSolidityFile(file))).toBe(file)
		})
	})
	it('should return a Effect<never, InvalidSolidityFileError, string> when parsing an invalid solidity file', () => {
		const files = [
			'sol/.sol',
			'foo/bar.ts',
			'bar.sol.ts',
			'sol',
			'.sol/.sol',
			'.sol',
		]
		files.forEach((file) => {
			expect(() => runSync(parseSolidityFile(file))).toThrowErrorMatchingSnapshot()
		})
	})
})
