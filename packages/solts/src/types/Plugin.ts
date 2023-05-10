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
  resolveJson: (module: string) => string
  /**
   * Resolves .d.ts representation of the solidity module
   */
  resolveDts: (module: string) => string
  /**
   * Resolves typescript representation of the solidity module
   */
  resolveTsModule: (module: string) => string
  /**
   * Resolves cjs representation of the solidity module
   */
  resolveCjsModule: (module: string) => string
  /**
   * Resolves the esm representation of the solidity module
   */
  resolveEsmModule: (module: string) => string
  /**
   * Resolves the paths of the artifacts files for a given solidity module
   */
  resolveArtifactPathsSync: (module: string) => Set<string>
}
