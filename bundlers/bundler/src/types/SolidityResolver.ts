import { Logger } from './Logger'

export type SolidityResolver<TConfig> = (
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
	 * Resolves .d.ts representation of the solidity module
	 */
	resolveDts: (module: string, basedir: string) => Promise<string>
	/**
	 * Resolves .d.ts representation of the solidity module
	 */
	resolveDtsSync: (module: string, basedir: string) => string
	/**
	 * Resolves typescript representation of the solidity module
	 */
	resolveTsModule: (module: string, basedir: string) => Promise<string>
	/**
	 * Resolves typescript representation of the solidity module
	 */
	resolveTsModuleSync: (module: string, basedir: string) => string
	/**
	 * Resolves cjs representation of the solidity module
	 */
	resolveCjsModule: (module: string, basedir: string) => Promise<string>
	/**
	 * Resolves cjs representation of the solidity module
	 */
	resolveCjsModuleSync: (module: string, basedir: string) => string
	/**
	 * Resolves the esm representation of the solidity module
	 */
	resolveEsmModule: (module: string, basedir: string) => Promise<string>
	/**
	 * Resolves the esm representation of the solidity module
	 */
	resolveEsmModuleSync: (module: string, basedir: string) => string
}
