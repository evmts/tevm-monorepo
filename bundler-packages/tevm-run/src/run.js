import { $ } from 'bun'
import { createBunConfig } from './createBunConfig.js'
import { parseArgs } from './parseArgs.js'

/**
 * Executes the provided script using Bun with the specified configuration.
 * @param {string} scriptPath - The path to the script to execute.
 * @param {...string} positionals - The positional arguments to pass to the script.
 * @returns {Promise<void>}
 */
export const run = async ([scriptPath, ...positionals] = parseArgs(process.argv).positionals) => {
	try {
		const paths = await createBunConfig()
		const command = `[tevm-run] bun run --bun --config=${paths.bunfig} --install=fallback ${scriptPath} ${positionals.join(' ')}`
		console.log(command)
		return $`bun run --config=${configPath} --install=fallback ${scriptPath} ${positionals.join(' ')}`
	} catch (error) {
		console.log('error')
		console.log(error.stdout?.toString())
		console.error(`Failed with code ${error.exitCode}`)
		console.error(error.stderr?.toString())
		throw new Error(
			`Error executing the script: ${error instanceof Error ? error.message : error.stderr?.toString()}`,
			{
				cause: error,
			},
		)
	}
}
