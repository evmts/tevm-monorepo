import { parseArgs as nodeParseArgs } from 'node:util'
import { argsSchema } from './argsSchema.js'

/**
 * @param {string[]} rawArgs
 */
export const parseArgs = (rawArgs) => {
	const args = nodeParseArgs({
		...argsSchema,
		args: rawArgs,
	})
	const tevmRunIndex = rawArgs.findIndex((arg) => arg.endsWith('tevm-run') || arg.endsWith('tevm-run.js'))
	// remove the bun arg and the tevm-run.js arg
	args.positionals = args.positionals.slice(tevmRunIndex + 1)
	if (args.positionals.length === 0) {
		console.error('Usage: tevm-run <scriptPath> [positionals...]')
		throw new Error('No script path provided.')
	}
	return args
}
