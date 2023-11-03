import type { Cache } from './createCache.js'
import type { ResolvedCompilerConfig } from '@evmts/config'
import type { ModuleInfo, SolcInputDescription, SolcOutput } from '@evmts/solc'
import type { Effect } from 'effect/Effect'
import type { Node } from 'solidity-ast/node.js'

export type BundlerResult = {
	code: string
	modules: Record<'string', ModuleInfo>
	solcInput: SolcInputDescription
	solcOutput: SolcOutput
	asts?: Record<string, Node> | undefined
}

export type FileAccessObject = {
	readFile: (path: string, encoding: BufferEncoding) => Promise<string>
	readFileSync: (path: string, encoding: BufferEncoding) => string
	existsSync: (path: string) => boolean
}

export type AsyncBundler = (
	module: string,
	basedir: string,
	includeAst: boolean,
) => Effect<never, never, BundlerResult>

export type SyncBundler = (
	module: string,
	basedir: string,
	includeAst: boolean,
) => Effect<never, never, BundlerResult>

export type Bundler = (
	config: ResolvedCompilerConfig,
	fao: FileAccessObject,
	cache?: Cache,
) => Effect<never, never, {
	/**
	 * The name of the plugin.
	 */
	name: string
	/**
	 * The configuration of the plugin.
	 */
	config: ResolvedCompilerConfig
	include?: string[]
	exclude?: string[]
	/**
	 * Resolves .d.ts representation of the solidity module
	 */
	resolveDts: AsyncBundler
	/**
	 * Resolves .d.ts representation of the solidity module
	 */
	resolveDtsSync: SyncBundler
	/**
	 * Resolves typescript representation of the solidity module
	 */
	resolveTsModule: AsyncBundler
	/**
	 * Resolves typescript representation of the solidity module
	 */
	resolveTsModuleSync: SyncBundler
	/**
	 * Resolves cjs representation of the solidity module
	 */
	resolveCjsModule: AsyncBundler
	/**
	 * Resolves cjs representation of the solidity module
	 */
	resolveCjsModuleSync: SyncBundler
	/**
	 * Resolves the esm representation of the solidity module
	 */
	resolveEsmModule: AsyncBundler
	/**
	 * Resolves the esm representation of the solidity module
	 */
	resolveEsmModuleSync: SyncBundler
}>
