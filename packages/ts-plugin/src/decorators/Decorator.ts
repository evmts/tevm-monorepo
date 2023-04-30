import { Logger } from '../factories'
import { LanguageServiceHost } from 'typescript'
import type typescript from 'typescript/lib/tsserverlibrary'

export type Decorator = (
  createInfo: typescript.server.PluginCreateInfo,
  ts: typeof typescript,
  logger: Logger,
) => LanguageServiceHost
