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
	if (args.positionals.length < 2) {
		console.error('Usage: tevm-run <scriptPath> [positionals...]')
		process.exit(1)
	}
	// remove the bun arg and the tevm-run.js arg
	args.positionals = args.positionals.slice(2)
	return args
}
