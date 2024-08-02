import { expect, it } from 'bun:test'
import { $ } from 'bun'

it('should run a cli', async () => {
	const result = (await $`./src/tevm-run.js ./example/example.ts`)
		.text()
		.split('\n')
		.map((line) => line.replace(process.cwd(), '').trim())
		.join('\n')
	expect(result).toInclude('[tevm-run] bun run --bun --config=/bunfig.toml --install=fallback ./example/example.ts')
	expect(result).toInclude('success')
	expect(result).toInclude('address:  0x5FbDB2315678afecb367f032d93F642f64180aa3')
	expect(result).toInclude('SimpleContract.get()')
	expect(result).toInclude('20n')
})
