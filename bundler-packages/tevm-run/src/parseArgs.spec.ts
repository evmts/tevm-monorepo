import { describe, expect, it } from 'bun:test'
import { parseArgs } from './parseArgs.js'

describe(parseArgs.name, () => {
	it('should parse the arguments', () => {
		it('should parse the arguments', () => {
			expect(parseArgs(['bunx', 'tevm-run', './example/example.ts'])).toMatchSnapshot()
		})

		it('should throw if no positional argument is provided', () => {
			expect(() => parseArgs(['bunx', 'tevm-run'])).toThrow()
		})
	})
})
