import { loadConfig } from '../src/loadConfig.js'
import { LogLevel, Logger } from 'effect'
import {
	catchAll,
	fail,
	flatMap,
	logError,
	provide,
	runSync,
	succeed,
} from 'effect/Effect'
import { join } from 'path'
import { z } from 'zod'

const ANSI = {
	Reset: '\x1b[0m',
	Bold: '\x1b[1m',
}

export const logger = Logger.make(({ logLevel, message }) => {
	if (logLevel._tag === 'Debug') {
		globalThis.console.log(`[${logLevel.label}] ${message}`)
	} else {
		globalThis.console.log(
			`${ANSI.Bold}[${logLevel.label}] ${message}${ANSI.Reset}`,
		)
	}
})

export const validFixtureNames = [
	'basic',
	'configFnThrows',
	'invalid',
	'invalidJson',
	'js',
	'jsonc',
	'withFoundry',
] as const

export const expectedErrors = ['configFnThrows', 'invalid', 'invalidJson']

export const validFixtureValidator = z.union([
	z.literal(validFixtureNames[0]),
	z.literal(validFixtureNames[1]),
	z.literal(validFixtureNames[2]),
	z.literal(validFixtureNames[3]),
	z.literal(validFixtureNames[4]),
	z.literal(validFixtureNames[5]),
	z.literal(validFixtureNames[6]),
])

const layer = Logger.replace(Logger.defaultLogger, logger)

export const runFixture = (name: string) => {
	const parsedName = validFixtureValidator.safeParse(name)
	if (!parsedName.success) {
		console.error('Invalid fixture name:', name, { validFixtureNames })
		process.exit(1)
	}
	const { data: validName } = parsedName
	const configDir = join(__dirname, '..', 'src', 'fixtures', validName)
	console.log('loading', configDir, '...')
	runSync(
		provide(
			loadConfig(configDir).pipe(
				flatMap((config) => {
					if (expectedErrors.includes(validName)) {
						return fail(config)
					}
					return succeed(config)
				}),
				catchAll((e) => {
					if (expectedErrors.includes(validName)) {
						return succeed(e)
					}
					return logError(
						`error running ${validName} ${
							expectedErrors.includes(validName)
								? `should have errored but didn't`
								: 'error'
						}. Try running the individual fixture with "bun fixture ${validName}"`,
					).pipe(flatMap(() => fail(e)))
				}),
				Logger.withMinimumLogLevel(LogLevel.Debug),
			),
			layer,
		),
	)
}
