import { expect, it } from 'bun:test'
import { $ } from 'bun'

it('should run a cli', async () => {
	expect(
		(await $`./src/tevm-run.js ./example/example.ts`)
			.text()
			.split('\n')
			.map((line) => line.replace(process.cwd(), '').trim())
			.join('\n'),
	).toBe(
		'[tevm-run] bun run --bun --config=/bunfig.toml --install=fallback ./example/example.ts \nsuccess\naddress:  0x5FbDB2315678afecb367f032d93F642f64180aa3\nSimpleContract.get():  20n\n',
	)
})
