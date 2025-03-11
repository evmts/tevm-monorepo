import type { FileAccessObject } from '@tevm/base-bundler'
import type { ResolvedCompilerConfig } from '@tevm/config'
import type typescript from 'typescript/lib/tsserverlibrary.js'
import type { Logger } from './logger.js'

/**
 * Represents a function that transforms a TypeScript LanguageServiceHost.
 *
 * A host decorator takes the original LanguageServiceHost from the TypeScript
 * language service and returns a modified version that alters or extends its behavior.
 * This is the primary mechanism used by this plugin to intercept and modify
 * TypeScript language service operations.
 *
 * @internal
 * @see {@link typescript.LanguageServiceHost}
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
 * Creates a full LanguageServiceHost decorator from a partial decorator function.
 *
 * This factory simplifies creating decorators by allowing you to specify only the
 * methods you want to override. The resulting decorator uses JavaScript Proxy to
 * intercept only the specified methods while delegating all other method calls
 * to the original LanguageServiceHost.
 *
 * @param decorator - A function that returns partial LanguageServiceHost implementation
 * @returns A complete HostDecorator function that can be used to decorate a LanguageServiceHost
 * @see {@link PartialHostDecorator}
 * @example
 * ```typescript
 * // Create a decorator that overrides the getScriptKind method
 * const jsonDecorator = createHostDecorator((createInfo, ts) => ({
 *   getScriptKind: (fileName) => {
 *     if (fileName.endsWith('.json')) {
 *       return ts.ScriptKind.JSON
 *     }
 *     return createInfo.languageServiceHost.getScriptKind(fileName)
 *   }
 * }))
 * ```
 */
export const createHostDecorator = (decorator: PartialHostDecorator): HostDecorator => {
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
 * Composes multiple HostDecorator functions into a single decorator.
 *
 * This utility allows combining multiple independent decorators that each modify
 * different aspects of the TypeScript LanguageServiceHost. The decorators are
 * applied in the order they are provided (first to last).
 *
 * The composition works by chaining decorators, where each decorator receives
 * the result of applying all previous decorators.
 *
 * @param decorators - Array of HostDecorator functions to compose
 * @returns A single HostDecorator that applies all the provided decorators
 * @example
 * ```typescript
 * // Combine multiple decorators into one
 * const combinedDecorator = decorateHost(
 *   scriptKindDecorator,
 *   moduleResolverDecorator,
 *   scriptSnapshotDecorator
 * )
 *
 * // Apply all decorators at once
 * const decoratedHost = combinedDecorator(createInfo, typescript, logger, config, fao)
 * ```
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
