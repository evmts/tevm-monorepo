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
		]
		files.forEach((file) => {
			expect(isRelativeSolidity(file)).toBe(true)
		})
	})

	it('should return false for non .sol files', () => {
		const files = ['.sol.sol', './foo/bar.ts', './bar.sol.ts', './sol', './.sol']
		files.forEach((file) => {
			expect(isRelativeSolidity(file)).toBe(false)
		})
	})

	it('should return false for non relative .sol files', () => {
		const files = ['.sol.sol', '/foo/bar/baz.sol', 'foo/bar/baz.sol', 'bar/baz.sol', './bar.sol.ts']
		files.forEach((file) => {
			expect(isRelativeSolidity(file)).toBe(false)
		})
	})

	it('should handle Windows-style paths correctly', () => {
		expect(isRelativeSolidity('.\\foo.sol')).toBe(false) // Windows path not starting with "./"
		expect(isRelativeSolidity('.\\foo\\bar.sol')).toBe(false)
		expect(isRelativeSolidity('..\\foo.sol')).toBe(false)

		// Mixed path separators
		expect(isRelativeSolidity('./foo\\bar.sol')).toBe(true) // Starts with "./" so it's true
		expect(isRelativeSolidity('.\\foo/bar.sol')).toBe(false) // Doesn't start with "./"
	})

	it('should handle parent directory traversal correctly', () => {
		expect(isRelativeSolidity('../foo.sol')).toBe(false) // Does not start with "./"
		expect(isRelativeSolidity('../foo/bar.sol')).toBe(false)
		expect(isRelativeSolidity('./foo/../bar.sol')).toBe(true) // Starts with "./" so it's true
	})

	it('should handle paths with special characters', () => {
		expect(isRelativeSolidity('./path with spaces/contract.sol')).toBe(true)
		expect(isRelativeSolidity('./path-with-dashes/contract.sol')).toBe(true)
		expect(isRelativeSolidity('./path_with_underscores/contract.sol')).toBe(true)
		expect(isRelativeSolidity('./path.with.dots/contract.sol')).toBe(true)
		expect(isRelativeSolidity('./contract name with spaces.sol')).toBe(true)
	})

	it('should handle edge cases correctly', () => {
		expect(isRelativeSolidity('./')).toBe(false) // No file specified
		expect(isRelativeSolidity('./.')).toBe(false) // No .sol extension
		expect(isRelativeSolidity('./..')).toBe(false) // No .sol extension
		expect(isRelativeSolidity('./foo/.')).toBe(false) // No .sol extension
		expect(isRelativeSolidity('./foo/.sol')).toBe(false) // .sol is not a valid file
		expect(isRelativeSolidity('./foo.sol/')).toBe(false) // Has trailing slash
		expect(isRelativeSolidity('./foo.sol?query=param')).toBe(false) // Current implementation doesn't support query params
	})
})
