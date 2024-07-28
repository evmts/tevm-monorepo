import { expect, it } from 'bun:test'
import { $ } from 'bun'

it('should run a cli', async () => {
	expect(await $`./src/tevm-run.js ./example/example.ts`).toMatchSnapshot()
})
