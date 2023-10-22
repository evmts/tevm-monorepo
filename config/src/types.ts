import type { fileExists as defaultFileExists } from './utils/fileExists.js'
import type { LoadFoundryConfigError } from './utils/loadFoundryConfig.js'
import type { ValidateUserConfigError } from './utils/validateUserConfig.js'
import type { Effect } from 'effect/Effect'
import type { ReadonlyRecord } from 'effect/ReadonlyRecord'

/**
 * Configuration of the solidity compiler
 */
export type CompilerConfig = {
	/**
	 * If set to true it will resolve forge remappings and libs
	 * Set to "path/to/forge/executable" to use a custom forge executable
	 */
	foundryProject?: boolean | string | undefined
	/**
	 * Sets directories to search for solidity imports in
	 * Read autoamtically for forge projects if forge: true
	 */
	libs?: readonly string[] | undefined
	/**
	 * Remap the location of contracts
	 */
	remappings?: ReadonlyRecord<string> | undefined
}

/*
 * User provided function that returns a raw CompilerConfig
 */
export type ConfigFactory = () => CompilerConfig

export type ResolvedCompilerConfig = {
	/**
	 * If set to true it will resolve forge remappings and libs
	 * Set to "path/to/forge/executable" to use a custom forge executable
	 */
	foundryProject: boolean | string
	/**
	 * Sets directories to search for solidity imports in
	 * Read autoamtically for forge projects if forge: true
	 */
	libs: readonly string[]
	/**
	 * Remap the location of contracts
	 */
	remappings: ReadonlyRecord<string>
}

export type DefineConfig = (configFactory: ConfigFactory) => {
	configFn: (
		configFilePath: string,
	) => Effect<
		never,
		ValidateUserConfigError | LoadFoundryConfigError,
		ResolvedCompilerConfig
	>
}

export type LoadConfigAsync = (
	configFilePath: string,
	logger?: Pick<typeof console, 'error' | 'warn'>,
	fileExists?: typeof defaultFileExists,
) => Promise<ResolvedCompilerConfig>
