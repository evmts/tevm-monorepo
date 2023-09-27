import { getDefaultSolcVersion } from './getDefaultSolcVersion'
import { z } from 'zod'

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

export const CompilerConfigValidator = z.strictObject({
	name: z.literal('@evmts/ts-plugin').optional(),
	solcVersion: z.string().optional(),
	foundryProject: z.union([z.boolean(), z.string()]).optional(),
	libs: z.array(z.string()).optional(),
}).describe('Configuration for EVMts')

export const defaultConfig = {
	get solcVersion() {
		return getDefaultSolcVersion()
	},
	foundryProject: false,
	remappings: {},
	libs: [],
}
