import { describe, expect, it } from 'bun:test'
import { parseArgs } from './parseArgs.js'

describe(parseArgs.name, () => {
	it('should parse the arguments', async () => {
		expect(await parseArgs(['bunx', 'tevm-run', './example/example.ts'])).toEqual({
			values: {},
			positionals: ['./example/example.ts'],
		})
	})

	it('should throw if no positional argument is provided', () => {
		expect(() => parseArgs(['bunx', 'tevm-run'])).toThrow()
	})
})
