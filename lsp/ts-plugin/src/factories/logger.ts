import type typescript from 'typescript/lib/tsserverlibrary.js'

/**
 * Interface for the logger used throughout the ts-plugin.
 * Provides standard logging methods with consistent formatting.
 *
 * All log messages are prefixed with `[tevm-ts-plugin]` for easier identification
 * in TypeScript server logs.
 *
 * @see {@link createLogger} - Factory function to create a logger instance
 */
export type Logger = {
	info: (msg: string) => void
	warn: (msg: string) => void
	error: (msg: string) => void
	log: (msg: string) => void
}

/**
 * Creates a logger that forwards messages to the TypeScript language service logger.
 *
 * This factory wraps the TypeScript project service logger to provide consistent
 * formatting and logging levels for the Tevm TypeScript plugin. All messages are
 * prefixed with `[tevm-ts-plugin]` and appropriate level indicators for easier
 * identification in the TypeScript server logs.
 *
 * @param pluginCreateInfo - The TypeScript plugin creation info containing the project service
 * @returns A Logger instance with info, warn, error, and log methods
 * @see {@link Logger} - The logger interface
 *
 * @example
 * ```typescript
 * // Create a logger from plugin creation info
 * const logger = createLogger(createInfo);
 *
 * // Log messages at different levels
 * logger.info('Plugin initialized');
 * logger.warn('Config file not found, using defaults');
 * logger.error('Failed to compile contract');
 * logger.log('Processing file: Contract.sol');
 * ```
 */
export const createLogger = (pluginCreateInfo: typescript.server.PluginCreateInfo): Logger => {
	const info = (msg: string) => pluginCreateInfo.project.projectService.logger.info(`[tevm-ts-plugin] ${msg}`)
	const warn = (msg: string) => pluginCreateInfo.project.projectService.logger.info(`[tevm-ts-plugin] warning: ${msg}`)
	const error = (msg: string) => pluginCreateInfo.project.projectService.logger.info(`[tevm-ts-plugin] error: ${msg}`)
	const log = (msg: string) => pluginCreateInfo.project.projectService.logger.info(`[tevm-ts-plugin] log: ${msg}`)
	return { info, warn, error, log }
}
