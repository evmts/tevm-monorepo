import { pino } from 'pino'

/**
 * Creates a tevm logger instance
 * Wraps [pino](https://github.com/pinojs/pino/blob/master/docs/api.md)
 * @param {import('./LogOptions.js').LogOptions} options
 * @returns {import('./Logger.js').Logger} A logger instance
 */
export const createLogger = (options) => {
	const pinoLogger = pino({
		name: options.name,
		level: options.level,
	})
	return pinoLogger
}
