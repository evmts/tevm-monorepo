import {
  getScriptKindDecorator,
  getScriptSnapshotDecorator,
  resolveModuleNameLiteralsDecorator,
} from './decorators'
import { composeDecorators, createConfig, createLogger } from './factories'
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
  /**
   * We must always use this version of typescript to ensure compatibility with the
   * version of typescript used by the client
   */
  typescript: ts,
}: {
  typescript: typeof typescript
}) => {
  /**
   * Compose the 3 decorators into a single decorator
   *
   * `getScriptKindDecorator`
   * Decorates ts-server with functionality to treat `.sol` files as `.ts` files
   * @see {@link resolveModuleNameLiteralsDecorator}
   *
   * `resolveModuleNameLiteralsDecorator`
   * Decorates ts-server to return correct metadata for `.sol` files
   * @see {@link resolveModuleNameLiteralsDecorator}
   *
   * `getScriptSnapshotDecorator`
   * Decorates ts-server with functionality to generate `.d.ts` files for `.sol` files
   * @see {@link resolveModuleNameLiteralsDecorator}
   *
   */
  const decorator = composeDecorators(
    getScriptKindDecorator,
    resolveModuleNameLiteralsDecorator,
    getScriptSnapshotDecorator,
  )

  /**
   * Decorates the ts-server host with functionality to handle `.sol` files.
   * @see https://github.com/microsoft/TypeScript/wiki/Writing-a-Language-Service-Plugin#decorator-creation
   */
  const create = (
    createInfo: typescript.server.PluginCreateInfo,
  ): typescript.LanguageServiceHost => {
    const config = createConfig(createInfo)
    const logger = createLogger(createInfo)
    const lsHost = decorator(createInfo, ts, logger, config)
    return lsHost
  }

  return {
    create,
  }
}
