import { createLogger } from './factories'
import { languageServiceHostDecorator } from './languageServiceHost'
import type typescript from 'typescript/lib/tsserverlibrary'

/**
 * [Typescript plugin factory](https://github.com/microsoft/TypeScript/wiki/Writing-a-Language-Service-Plugin)
 * @example
 * ```json
 * {
 *   "plugins": [{ "name": "evmts-ts-plugin"}]
 * }
 * @see {@link languageServiceHostDecorator}
 * @see {@link createLogger}
 * @see {@link typescript.server.PluginCreateInfo}
 */
const init = (modules: {
  typescript: typeof typescript
}) => {
  return {
    /**
     * @see https://github.com/microsoft/TypeScript/wiki/Writing-a-Language-Service-Plugin#decorator-creation
     * @see {@link languageServiceHostDecorator}
     * @see {@link createLogger}
     * @see {@link typescript.server.PluginCreateInfo}
     */
    create: (createInfo: typescript.server.PluginCreateInfo) => {
      const logger = createLogger(createInfo)
      return languageServiceHostDecorator(
        createInfo,
        modules.typescript,
        logger,
      )
    },
  }
}

export = init
