import {
  getScriptKindDecorator,
  getScriptSnapshotDecorator,
  resolveModuleNameLiteralsDecorator,
} from './decorators'
import { composeDecorators, createLogger } from './factories'
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
 * @see https://github.com/microsoft/TypeScript/wiki/Writing-a-Language-Service-Plugin#decorator-creation
 */
export const tsPlugin = ({
  typescript: ts,
}: {
  typescript: typeof typescript
}) => {
  /**
   * Compose the decorators into a single decorator
   */
  const lsDecorator = composeDecorators(
    /**
     * Decorates ts-server with functionality to treat `.sol` files as `.ts` files
     * @see {@link resolveModuleNameLiteralsDecorator}
     */
    getScriptKindDecorator,
    /**
     * Decorates ts-server to return correct metadata for `.sol` files
     * @see {@link resolveModuleNameLiteralsDecorator}
     */
    resolveModuleNameLiteralsDecorator,
    /**
     * Decorates ts-server with functionality to generate `.d.ts` files for `.sol` files
     * @see {@link resolveModuleNameLiteralsDecorator}
     */
    getScriptSnapshotDecorator,
  )

  /**
   * Decorates the ts-server host with functionality to handle `.sol` files.
   * @see https://github.com/microsoft/TypeScript/wiki/Writing-a-Language-Service-Plugin#decorator-creation
   */
  const create = (
    createInfo: typescript.server.PluginCreateInfo,
  ): typescript.LanguageServiceHost => {
    return lsDecorator(createInfo, ts, createLogger(createInfo))
  }

  return {
    create,
  }
}
