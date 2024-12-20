import type { Effect } from 'effect/Effect'
import type { ReadonlyRecord } from 'effect/Record'
import type { ValidateUserConfigError } from './config/index.js'
import type { DefineConfigError } from './defineConfig.js'
import type { LoadFoundryConfigError } from './foundry/index.js'

/**
 * Configuration of the solidity compiler
 * When resolved with defaults it is a {@link ResolvedCompilerConfig}
 */
export type CompilerConfig = {
	/**
	 * A glob pattern or array of glob patterns indicating which ABIs should be resolved as const.
	 * This allows for more precise typing of ABIs in TypeScript.
	 */
	jsonAsConst?: string | readonly string[] | undefined
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
	remappings?: ReadonlyRecord<string, string> | undefined
	/**
	 * If debug is true tevm will write the .d.ts files in the ts server and publish extra debug info to a debug file
	 */
	debug?: boolean | undefined
	/**
	 * Location of the tevm cache folder
	 */
	cacheDir?: string | undefined
}

/*
 * User provided function that returns a raw CompilerConfig
 */
export type ConfigFactory = () => CompilerConfig

/**
 * A fully resolved compiler config with defaults filled in
 * See {@link CompilerConfig}
 */
export type ResolvedCompilerConfig = {
	/**
	 * A glob pattern or array of glob patterns indicating which ABIs should be resolved as const.
	 * This allows for more precise typing of ABIs in TypeScript.
	 */
	jsonAsConst: readonly string[]
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
	remappings: ReadonlyRecord<string, string>
	/**
	 * If debug is true tevm will write the .d.ts files in the ts server and publish extra debug info to a debug file
	 */
	debug?: boolean | undefined
	/**
	 * Location of the tevm cache folder
	 */
	cacheDir: string
}

export type DefineConfigErrorType = ValidateUserConfigError | LoadFoundryConfigError

/**
 * Creates an Tevm config
 * Takes a user provided configFactory
 * @example
 * import { defineConfig } from 'tevm/config'
 * export default defineConfig({
 * 	foundryProject: true,
 * 		libs: ['libs/contracts'],
 *	})
 */
export type DefineConfig = (configFactory: ConfigFactory) => {
	configFn: (configFilePath: string) => Effect<ResolvedCompilerConfig, DefineConfigError, never>
}
