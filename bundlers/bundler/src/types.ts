import type { SolcInputDescription, SolcOutput } from './solc/solc'
import type { ResolvedConfig } from '@evmts/config'
import type { Node } from 'solidity-ast/node'

type BundlerResult = {
	code: string
	modules: Record<'string', ModuleInfo>
	solcInput: SolcInputDescription
	solcOutput: SolcOutput
	asts?: Record<string, Node> | undefined
}

type AsyncBundlerResult = (
	module: string,
	basedir: string,
	includeAst: boolean,
) => Promise<BundlerResult>

type SyncBundlerResult = (
	module: string,
	basedir: string,
	includeAst: boolean,
) => BundlerResult

export type Bundler = (
	config: ResolvedConfig,
	logger: Logger,
) => {
	/**
	 * The name of the plugin.
	 */
	name: string
	/**
	 * The configuration of the plugin.
	 */
	config: ResolvedConfig
	include?: string[]
	exclude?: string[]
	/**
	 * Resolves .d.ts representation of the solidity module
	 */
	resolveDts: AsyncBundlerResult
	/**
	 * Resolves .d.ts representation of the solidity module
	 */
	resolveDtsSync: SyncBundlerResult
	/**
	 * Resolves typescript representation of the solidity module
	 */
	resolveTsModule: AsyncBundlerResult
	/**
	 * Resolves typescript representation of the solidity module
	 */
	resolveTsModuleSync: SyncBundlerResult
	/**
	 * Resolves cjs representation of the solidity module
	 */
	resolveCjsModule: AsyncBundlerResult
	/**
	 * Resolves cjs representation of the solidity module
	 */
	resolveCjsModuleSync: SyncBundlerResult
	/**
	 * Resolves the esm representation of the solidity module
	 */
	resolveEsmModule: AsyncBundlerResult
	/**
	 * Resolves the esm representation of the solidity module
	 */
	resolveEsmModuleSync: SyncBundlerResult
}

export type Logger = {
	info: (...messages: string[]) => void
	error: (...message: string[]) => void
	warn: (...message: string[]) => void
	log: (...message: string[]) => void
}
/**
 * Copied from rollup (kinda)
 * @see https://rollupjs.org/plugin-development/#this-getmoduleinfo
 */
export interface ModuleInfo {
	id: string // the id of the module, for convenience
	rawCode: string | null // the source code of the module, `null` if external or not yet available
	code: string | null // the code after transformed to correctly resolve remappings and node_module imports
	importedIds: string[] // the module ids statically imported by this module
	resolutions: ModuleInfo[] // how statically imported ids were resolved, for use with this.load
}

export type SolidityResolver = (
	config: ResolvedConfig,
	logger: Logger,
) => {
	/**
	 * The name of the plugin.
	 */
	name: string
	/**
	 * The configuration of the plugin.
	 */
	config: ResolvedConfig
	include?: string[]
	exclude?: string[]
	/**
	 * Resolves .d.ts representation of the solidity module
	 */
	resolveDts: (module: string, basedir: string) => Promise<BundlerResult>
	/**
	 * Resolves .d.ts representation of the solidity module
	 */
	resolveDtsSync: (module: string, basedir: string) => BundlerResult
	/**
	 * Resolves typescript representation of the solidity module
	 */
	resolveTsModule: (module: string, basedir: string) => Promise<BundlerResult>
	/**
	 * Resolves typescript representation of the solidity module
	 */
	resolveTsModuleSync: (module: string, basedir: string) => BundlerResult
	/**
	 * Resolves cjs representation of the solidity module
	 */
	resolveCjsModule: (module: string, basedir: string) => Promise<BundlerResult>
	/**
	 * Resolves cjs representation of the solidity module
	 */
	resolveCjsModuleSync: (module: string, basedir: string) => BundlerResult
	/**
	 * Resolves the esm representation of the solidity module
	 */
	resolveEsmModule: (module: string, basedir: string) => Promise<BundlerResult>
	/**
	 * Resolves the esm representation of the solidity module
	 */
	resolveEsmModuleSync: (module: string, basedir: string) => BundlerResult
}
