import { Logger } from '../factories'
import { LanguageServiceHost } from 'typescript'
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
) => LanguageServiceHost
