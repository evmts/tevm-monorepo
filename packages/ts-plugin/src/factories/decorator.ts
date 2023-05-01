import type { Logger } from './logger'
import type typescript from 'typescript/lib/tsserverlibrary'

/**
 * Internal type representing a leangauge service host decorator.
 * @internal
 * @see {@link LanguageServiceHost}
 */
export type Decorator = (
  createInfo: typescript.server.PluginCreateInfo,
  ts: typeof typescript,
  logger: Logger,
) => typescript.LanguageServiceHost

/**
 * Type of function passed into createDecorator
 * @see {@link createDecorator}
 * @example
 * const decoratorFn: DecoratorFn = (createInfo, ts, logger) => ({
 * getScriptKind: (fileName) => {
 *   if (fileName.endsWith('.sol')) {
 *     return ts.ScriptKind.TS
 *   }
 *   return createInfo.languageServiceHost.getScriptKind(fileName)
 *   },
 * })
 */
export type PartialDecorator = (
  createInfo: typescript.server.PluginCreateInfo,
  ts: typeof typescript,
  logger: Logger,
) => Partial<typescript.LanguageServiceHost>

/**
 * Creates a decorator from a DecoratorFn
 * A decoratorFn is a function that returns a partial LanguageServiceHost
 * @see {@link PartialDecorator}
 * @example
 * const DecoratorFn: DecoratorFn = (createInfo, ts, logger) => ({
 *  getScriptKind: (fileName) => {
 *   if (fileName.endsWith('.json')) {
 *    return ts.ScriptKind.JSON
 *  } else {
 *   return ts.ScriptKind.TS
 * }
 * },
 * })
 */
export const createDecorator = (decorator: PartialDecorator): Decorator => {
  return (createInfo, ts, logger) => {
    const host = createInfo.languageServiceHost
    const proxy = decorator(createInfo, ts, logger)
    return new Proxy(host, {
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
 * const composedDecorators = composeDecorators(
 *   decorator1,
 *   decorator2,
 *   decorator3,
 *   decorator4,
 * )
 */
export const composeDecorators = (...decorators: Decorator[]): Decorator => {
  return (createInfo, ts, logger) => {
    if (decorators.length === 0) {
      return createInfo.languageServiceHost
    }

    const [nextDecorator, ...restDecorators] = decorators

    const decoratedHost = nextDecorator(createInfo, ts, logger)

    const decoratedCreateInfo = {
      ...createInfo,
      languageServiceHost: decoratedHost,
    }

    return composeDecorators(...restDecorators)(decoratedCreateInfo, ts, logger)
  }
}
