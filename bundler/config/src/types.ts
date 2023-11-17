import type { ValidateUserConfigError } from './config/index.js'
import type { DefineConfigError } from './defineConfig.js'
import type { LoadFoundryConfigError } from './foundry/index.js'
import type { Effect } from 'effect/Effect'
import type { ReadonlyRecord } from 'effect/ReadonlyRecord'

/**
 * Configuration of the solidity compiler
 * When resolved with defaults it is a {@link ResolvedCompilerConfig}
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
	/**
	 * If debug is true evmts will write the .d.ts files in the ts server and publish extra debug info to a debug file
	 */
	debug?: boolean | undefined
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
	/**
	 * If debug is true evmts will write the .d.ts files in the ts server and publish extra debug info to a debug file
	 */
	debug?: boolean | undefined
}

export type DefineConfigErrorType =
	| ValidateUserConfigError
	| LoadFoundryConfigError

/**
 * Creates an EVMts config
 * Takes a user provided configFactory
 * @example
 * import { defineConfig } from 'evmts/config'
 * export default defineConfig({
 * 	foundryProject: true,
 * 		libs: ['libs/contracts'],
 *	})
 */
export type DefineConfig = (configFactory: ConfigFactory) => {
	configFn: (
		configFilePath: string,
	) => Effect<never, DefineConfigError, ResolvedCompilerConfig>
}
