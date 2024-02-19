import type { Cache } from '@tevm/bundler-cache'
import type { ModuleInfo } from '@tevm/compiler'
import type { ResolvedCompilerConfig } from '@tevm/config'
import type { SolcInputDescription, SolcOutput } from '@tevm/solc'
import type { mkdirSync, statSync } from 'fs'
import type { mkdir, stat, writeFile } from 'fs/promises'
import type { Node } from 'solidity-ast/node.js'

export type BundlerResult = {
	code: string
	modules: Record<'string', ModuleInfo>
	solcInput: SolcInputDescription
	solcOutput: SolcOutput
	asts?: Record<string, Node> | undefined
}

/**
 * Generalized interface for accessing file system
 * Allows this package to be used in browser environments or otherwise pluggable
 */
export type FileAccessObject = {
	writeFileSync: (path: string, data: string) => void
	writeFile: typeof writeFile
	readFile: (path: string, encoding: BufferEncoding) => Promise<string>
	readFileSync: (path: string, encoding: BufferEncoding) => string
	exists: (path: string) => Promise<boolean>
	existsSync: (path: string) => boolean
	statSync: typeof statSync
	stat: typeof stat
	mkdirSync: typeof mkdirSync
	mkdir: typeof mkdir
}

export type AsyncBundlerResult = (
	module: string,
	basedir: string,
	includeAst: boolean,
	includeBytecode: boolean,
) => Promise<BundlerResult>

export type SyncBundlerResult = (
	module: string,
	basedir: string,
	includeAst: boolean,
	includeBytecode: boolean,
) => BundlerResult

export type Bundler = (
	config: ResolvedCompilerConfig,
	logger: Logger,
	fao: FileAccessObject,
	solc: any,
	cache: Cache,
	/**
	 * The name of the package that contains the contract package
	 * If not included the bundler will attempt to autodetect the package
	 */
	contractPackage?: '@tevm/contract' | 'tevm/contract',
) => {
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

export type SolidityResolver = (
	config: ResolvedCompilerConfig,
	logger: Logger,
) => {
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
