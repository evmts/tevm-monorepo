import { fileExists as defaultFileExists } from './fileExists.js'

/**
 * Configuration of the solidity compiler
 */
export type CompilerConfig = {
  /**
   * Solc version to use  (e.g. "0.8.13")
   * @defaults "0.8.13"
   * @see https://www.npmjs.com/package/solc
   */
  solcVersion?: string
  /**
   * If set to true it will resolve forge remappings and libs
   * Set to "path/to/forge/executable" to use a custom forge executable
   */
  foundryProject?: boolean | string
  /**
   * Sets directories to search for solidity imports in
   * Read autoamtically for forge projects if forge: true
   */
  libs?: string[]
  /**
   * Remap the location of contracts
   */
  remappings?: Record<string, string>
}

export type ResolvedCompilerConfig = Required<CompilerConfig>

export type DefineConfig = (configFactory: () => CompilerConfig) => {
  configFn: (configFilePath: string) => ResolvedCompilerConfig
}

export type LoadConfig = (
  configFilePath: string,
  logger?: Pick<typeof console, 'error' | 'warn'>,
) => ResolvedCompilerConfig

export type LoadConfigAsync = (
  configFilePath: string,
  logger?: Pick<typeof console, 'error' | 'warn'>,
  fileExists?: typeof defaultFileExists,
) => Promise<ResolvedCompilerConfig>

