import { describe, expect, it } from 'bun:test'
import { run } from './run.js'

describe(run.name, () => {
	it('should run the `tevm run` command to run a script', async () => {
		expect((await run(['./example/vanilla.ts'])).text()).toBe('success\n')
	})
})
