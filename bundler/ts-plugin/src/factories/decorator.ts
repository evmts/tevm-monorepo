import type { Logger } from './logger.js'
import { FileAccessObject } from '@evmts/base'
import { ResolvedCompilerConfig } from '@evmts/config'
import type typescript from 'typescript/lib/tsserverlibrary.js'

/**
 * Internal type representing a leangauge service host decorator.
 * @internal
 * @see {@link LanguageServiceHost}
 */
export type HostDecorator = (
	createInfo: typescript.server.PluginCreateInfo,
	ts: typeof typescript,
	logger: Logger,
	config: ResolvedCompilerConfig,
	fao: FileAccessObject,
) => typescript.LanguageServiceHost

/**
 * Type of function passed into createDecorator
 * @see {@link createHostDecorator}
 * @example
 * const decoratorFn: PartialDecorator = (createInfo, ts, logger) => ({
 * getScriptKind: (fileName) => {
 *   if (fileName.endsWith('.sol')) {
 *     return ts.ScriptKind.TS
 *   }
 *   return createInfo.languageServiceHost.getScriptKind(fileName)
 *   },
 * })
 */
export type PartialHostDecorator = (
	createInfo: typescript.server.PluginCreateInfo,
	ts: typeof typescript,
	logger: Logger,
	config: ResolvedCompilerConfig,
	fao: FileAccessObject,
) => Partial<typescript.LanguageServiceHost>

/**
 * Creates a decorator from a DecoratorFn
 * A decoratorFn is a function that returns a partial LanguageServiceHost
 * @see {@link PartialHostDecorator}
 * @example
 * const DecoratorFn: PartialDecorator = (createInfo, ts, logger) => ({
 *  getScriptKind: (fileName) => {
 *   if (fileName.endsWith('.json')) {
 *    return ts.ScriptKind.JSON
 *  } else {
 *   return ts.ScriptKind.TS
 * }
 * },
 * })
 */
export const createHostDecorator = (
	decorator: PartialHostDecorator,
): HostDecorator => {
	return (createInfo, ...rest) => {
		const proxy = decorator(createInfo, ...rest)
		return new Proxy(createInfo.languageServiceHost, {
			get(target, key) {
				// If the key is one of the keys that are to be proxied, return the proxy value.
				if (key in proxy) {
					return proxy[key as keyof typescript.LanguageServiceHost]
				}
				// Otherwise, return the host value.
				return target[key as keyof typescript.LanguageServiceHost]
			},
		})
	}
}

/**
 * Util used to turn an array of decorators into a single decorator
 * @example
 * const composedDecorators = decorate(
 *   decorator1,
 *   decorator2,
 *   decorator3,
 *   decorator4,
 * )
 */
export const decorateHost = (...decorators: HostDecorator[]): HostDecorator => {
	return (createInfo, ...rest) => {
		if (decorators.length === 0) {
			return createInfo.languageServiceHost
		}

		const [nextDecorator, ...restDecorators] = decorators

		const decoratedHost = nextDecorator(createInfo, ...rest)

		const decoratedCreateInfo = new Proxy(createInfo, {
			get(target, key) {
				if (key === 'languageServiceHost') {
					return decoratedHost
				}
				return target[key as keyof typeof target]
			},
		})

		return decorateHost(...restDecorators)(decoratedCreateInfo, ...rest)
	}
}
