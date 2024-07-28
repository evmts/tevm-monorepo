import { $ } from 'bun'
import { configPath } from './configPath.js'
import { parseArgs } from './parseArgs.js'

/**
 * Executes the provided script using Bun with the specified configuration.
 * @param {string} scriptPath - The path to the script to execute.
 * @param {...string} positionals - The positional arguments to pass to the script.
 * @returns {Promise<void>}
 */
export const run = async ([scriptPath, ...positionals] = parseArgs(process.argv).positionals) => {
	try {
		const command = `bun run --bun --config=${configPath} --install=fallback ${scriptPath} ${positionals.join(' ')}`
		console.log(command)
		return $`bun run --config=${configPath} --install=fallback ${scriptPath} ${positionals.join(' ')}`
	} catch (error) {
		console.log('error')
		console.log(err.stdout.toString())
		console.error(`Failed with code ${err.exitCode}`)
		console.error(err.stderr.toString())
		throw new Error(`Error executing the script: ${error instanceof Error ? error.message : err.stderr.toString()}`, {
			cause: error,
		})
	}
}
