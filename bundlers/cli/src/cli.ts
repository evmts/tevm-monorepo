// #!/usr/bin/env node
import { cac } from 'cac'

import * as packageJson from '../package.json'
import { generate } from './commands'
import { loadConfig } from '@evmts/config'
import * as dotenv from 'dotenv'

export const cli = async (
	logger: Pick<typeof console, 'error' | 'warn' | 'log' | 'info'>,
) => {
	dotenv.config()
	const cli = cac('evmts')

	cli
		.command(
			'generate',
			'generate contracts based on Evmts config in tsconfig.json',
		)
		.example((name) => `${name} generate`)
		.action(async () => {
			logger.log('Generating contracts...')
			const evmtsConfig = loadConfig(process.cwd(), console)
			await generate(evmtsConfig, logger)
		})

	cli.help()
	cli.version(packageJson.version)

	try {
		// Parse CLI args without running command
		cli.parse(process.argv, { run: false })
		if (!cli.matchedCommand) {
			if (cli.args.length === 0) cli.outputHelp()
			else throw new Error(`Unknown command: ${cli.args.join(' ')}`)
		}
		await cli.runMatchedCommand()
	} catch (error) {
		logger.error(`\n${(error as Error).message}`)
		process.exit(1)
	}
}
