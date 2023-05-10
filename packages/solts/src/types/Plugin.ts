import { Logger } from './Logger'

export type Plugin<TConfig> = (
  config: TConfig,
  logger: Logger,
) => {
  /**
   * The name of the plugin.
   */
  name: string
  /**
   * The configuration of the plugin.
   */
  config: TConfig
  include?: string[]
  exclude?: string[]
  /**
   * Resolves json representation of the solidity module
   */
  resolveJson: (module: string) => Promise<string>
  /**
   * Resolves json representation of the solidity module
   */
  resolveJsonSync: (module: string) => string
  /**
   * Resolves .d.ts representation of the solidity module
   */
  resolveDts: (module: string) => Promise<string>
  /**
   * Resolves .d.ts representation of the solidity module
   */
  resolveDtsSync: (module: string) => string
  /**
   * Resolves typescript representation of the solidity module
   */
  resolveTsModule: (module: string) => Promise<string>
  /**
   * Resolves typescript representation of the solidity module
   */
  resolveTsModuleSync: (module: string) => string
  /**
   * Resolves cjs representation of the solidity module
   */
  resolveCjsModule: (module: string) => Promise<string>
  /**
   * Resolves cjs representation of the solidity module
   */
  resolveCjsModuleSync: (module: string) => string
  /**
   * Resolves the esm representation of the solidity module
   */
  resolveEsmModule: (module: string) => Promise<string>
  /**
   * Resolves the esm representation of the solidity module
   */
  resolveEsmModuleSync: (module: string) => string
  /**
   * Resolves the paths of the artifacts files for a given solidity module
   */
  resolveArtifactPaths: (module: string) => Promise<Set<string>>
  /**
   * Resolves the paths of the artifacts files for a given solidity module
   */
  resolveArtifactPathsSync: (module: string) => Set<string>
}
