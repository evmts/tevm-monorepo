import { expect, it } from 'bun:test'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

it('should run a cli', async () => {
	// Get directory path in a TypeScript-compatible way
	const __dirname = dirname(fileURLToPath(import.meta.url))

	// Use Bun.spawn directly for better control in CI
	const proc = Bun.spawn(['bun', join(__dirname, 'tevm-run.js'), './example/example.ts'], {
		cwd: __dirname.replace('/src', ''),
		env: { ...process.env },
		stdout: 'pipe',
		stderr: 'pipe',
	})

	// Set up timeout to prevent hanging
	const timeoutId = setTimeout(() => {
		proc.kill()
	}, 12000)

	try {
		// Wait for process to complete
		const exited = await proc.exited

		// Clear timeout if process completes
		clearTimeout(timeoutId)

		// Read output
		const output = await new Response(proc.stdout).text()
		const errorOutput = await new Response(proc.stderr).text()

		// Process the result
		const result = output
			.split('\n')
			.map((line) => line.replace(process.cwd(), '').trim())
			.join('\n')

		// Check exit code
		if (exited !== 0) {
			console.error('Error output:', errorOutput)
			throw new Error(`Process exited with code ${exited}`)
		}

		// Check for the command with flexible config path matching
		expect(result).toMatch(
			/\[tevm-run\] bun run --bun --config=.*bunfig\.toml --install=fallback \.\/example\/example\.ts/,
		)
		expect(result).toInclude('success')
		expect(result).toInclude('address:  0x5FbDB2315678afecb367f032d93F642f64180aa3')
		expect(result).toInclude('SimpleContract.get()')
		expect(result).toInclude('20n')
	} finally {
		clearTimeout(timeoutId)
		// Ensure process is killed if still running
		try {
			proc.kill()
		} catch {
			// Ignore errors if process already exited
		}
	}
}, 15000)
