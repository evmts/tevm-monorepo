import { Logger, createProxy } from '../factories'
import { Decorator } from './Decorator'
import type typescript from 'typescript/lib/tsserverlibrary'

export type DecoratorFn = (
  createInfo: typescript.server.PluginCreateInfo,
  ts: typeof typescript,
  logger: Logger,
) => Partial<typescript.LanguageServiceHost>

export const createDecorator =
  (decorator: DecoratorFn): Decorator =>
  (createInfo, ts, logger) => {
    const host = createInfo.languageServiceHost
    return createProxy(host, decorator(createInfo, ts, logger))
  }
