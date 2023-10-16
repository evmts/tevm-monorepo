import type typescript from 'typescript/lib/tsserverlibrary.js'

/**
 * The logger used internally within the package
 * @see {@link createLogger}
 */
export type Logger = {
	info: (msg: string) => void
	warn: (msg: string) => void
	error: (msg: string) => void
	log: (msg: string) => void
}

/**
 * Factory to create a logger
 * @see {@link Logger}
 * @example
 * const logger = createLogger(createInfo)
 * logger.info('hello world')
 */
export const createLogger = (
	pluginCreateInfo: typescript.server.PluginCreateInfo,
): Logger => {
	const info = (msg: string) =>
		pluginCreateInfo.project.projectService.logger.info(
			`[evmts-ts-plugin] ${msg}`,
		)
	const warn = (msg: string) =>
		pluginCreateInfo.project.projectService.logger.info(
			`[evmts-ts-plugin] warning: ${msg}`,
		)
	const error = (msg: string) =>
		pluginCreateInfo.project.projectService.logger.info(
			`[evmts-ts-plugin] error: ${msg}`,
		)
	const log = (msg: string) =>
		pluginCreateInfo.project.projectService.logger.info(
			`[evmts-ts-plugin] log: ${msg}`,
		)
	return { info, warn, error, log }
}
