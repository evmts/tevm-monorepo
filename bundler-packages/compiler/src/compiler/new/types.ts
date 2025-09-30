import type {
	Releases,
	SolcContractOutput,
	SolcDebugSettings,
	SolcErrorEntry,
	SolcEvmVersion,
	SolcLanguage,
	SolcMetadataSettings,
	SolcModelChecker,
	SolcOptimizer,
	SolcOutputSelection,
	SolcRemapping,
} from '@tevm/solc'
import type { Abi } from 'abitype'
import type { ASTNode } from 'solc-typed-ast'

// import type { CompilationOutput as CompilationOutputOption } from 'solc-typed-ast'

// Roughly here we use @tevm/solc (solc-js) for compilation and solc-typed-ast for AST but also
// for some useful types

// TODO: need to type that in @tevm/solc
export type SolcAst = any

/* -------------------------------------------------------------------------- */
/*                                   COMPILE                                  */
/* -------------------------------------------------------------------------- */
/* --------------------------------- OPTIONS -------------------------------- */
export type CompilationOutputOption = SolcOutputSelection[string][string][number]

// All of the below options can be overridden on a per-compilation basis
export interface CompileBaseOptions<TCompilationOutput extends CompilationOutputOption[] = CompilationOutputOption[]> {
	// Solc settings
	/**
	 * EVM version
	 *
	 * default: latest stable hardfork
	 * @see {@link SolcEvmVersion}
	 */
	hardfork?: SolcEvmVersion
	/**
	 * The compilation output selection
	 *
	 * Use '*' to select all outputs
	 *
	 * default: ['ast', 'abi', 'evm.bytecode', 'evm.deployedBytecode', 'storageLayout']
	 */
	compilationOutput?: TCompilationOutput
	/**
	 * Optimizer settings with optional components details
	 *
	 * default: none
	 * @see {@link SolcOptimizer}
	 */
	optimizer?: SolcOptimizer
	/**
	 * Whether to use the IR compiler
	 *
	 * default: false
	 */
	viaIR?: boolean
	/**
	 * Optional settings to inject/strip revert strings and debug assembly/Yul code
	 * @see {@link SolcDebugSettings}
	 */
	debug?: SolcDebugSettings
	/**
	 * Optional settings to specify how to handle the suffixing of the metadata
	 * @see {@link SolcMetadataSettings}
	 */
	metadata?: SolcMetadataSettings
	// TODO: check the current state of these experimental options
	modelChecker?: SolcModelChecker

	/**
	 * Remappings to apply in order to the source code of compiled contracts
	 */
	remappings?: SolcRemapping
	// TODO: figure out how this works
	libraries?: Record<string, Record<string, string>>

	// Additional compiler settings
	/**
	 * Language of the source code
	 *
	 * Note: this can be used to set a compiler-level language, e.g. to create an AST compiler, and overriden
	 * on a per-compilation basis
	 *
	 * default: Solidity
	 * @see {@link SolcLanguage}
	 */
	language?: SolcLanguage
	/**
	 * Solc version
	 *
	 * Note: this can be used to set a compiler-level version and overriden on a per-compilation basis
	 *
	 * If not provided, it will extract all the pragmas and use the most recent compatible version using solc-typed-ast
	 * @see {@link Releases}
	 */
	solcVersion?: keyof Releases
	/**
	 * Whether to throw on version mismatc, i.e. if the provided version is
	 * not listed as a compatible version for the provided sources
	 *
	 * default: true
	 */
	throwOnVersionMismatch?: boolean
	/**
	 * Whether to cache the compilation results
	 *
	 * default: true
	 */
	cacheEnabled?: boolean
	/**
	 * Directory to cache the compilation results
	 *
	 * default: memory
	 * TODO: does it make sense to cache and default to memory?
	 */
	cacheDirectory?: string
}

export type ValidatedCompileBaseOptions = Omit<
	CompileBaseOptions,
	'language' | 'compilationOutput' | 'hardfork' | 'solcVersion'
> &
	Required<Pick<CompileBaseOptions, 'language' | 'compilationOutput' | 'hardfork' | 'solcVersion'>>

/* --------------------------------- RESULT --------------------------------- */
export type CompiledSourceContractOutput<
	TOutputSelection extends readonly CompilationOutputOption[] = readonly CompilationOutputOption[],
> = TOutputSelection[number] extends '*'
	? SolcContractOutput
	: WithCompilationOutput<TOutputSelection, 'abi', { abi: Abi }> &
			WithCompilationOutput<TOutputSelection, 'metadata', { metadata: string }> &
			WithCompilationOutput<TOutputSelection, 'userdoc', { userdoc: SolcContractOutput['userdoc'] }> &
			WithCompilationOutput<TOutputSelection, 'devdoc', { devdoc: SolcContractOutput['devdoc'] }> &
			WithCompilationOutput<TOutputSelection, 'ir', { ir: string }> &
			WithCompilationOutput<TOutputSelection, 'storageLayout', { storageLayout: SolcContractOutput['storageLayout'] }> &
			WithCompilationOutput<TOutputSelection, 'evm', { evm: SolcContractOutput['evm'] }> &
			WithCompilationOutput<TOutputSelection, 'ewasm', { ewasm: SolcContractOutput['ewasm'] }>

export interface CompiledSource<TCompilationOutput extends CompilationOutputOption[] = CompilationOutputOption[]> {
	ast: SolcAst
	id: number
	contract: {
		[sourceName: string]: CompiledSourceContractOutput<TCompilationOutput>
	}
}

export interface CompileBaseResult {
	// TODO: should we separate errors (type: 'error') and logs (type: 'warning' | 'info')? Or is this needless abstraction?
	errors?: SolcErrorEntry[] | undefined

	// TODO
	// artifacts
	// modules
	// solcInput
	// solcOutput
}

/**
 * Result of converting AST to source code
 * - input: AST (raw from solc or universal from solc-typed-ast)
 * - output: map of file paths to regenerated Solidity source code
 *
 * @example
 * {
 *   "contracts/Main.sol": "import './Lib.sol';\ncontract Main {...}",
 *   "contracts/Lib.sol": "library Lib {...}"
 * }
 */
export interface GenerateContractsFromAstResult {
	[sourcePath: string]: string
}

/**
 * Result of compiling Solidity source code
 * - input: Map of file paths to source code (same as GenerateContractsFromAstResult)
 * - output: Nested structure with both per-file ASTs and per-contract artifacts
 *
 * @example
 * {
 *   "contracts/Main.sol": {
 *     ast: {...},
 *     id: 0,
 *     contract: {
 *       "Main": { abi: [...], bytecode: "0x..." }
 *     }
 *   },
 *   "contracts/Lib.sol": {
 *     ast: {...},
 *     id: 1,
 *     contract: {
 *       "Lib": { abi: [...], bytecode: "0x..." }
 *     }
 *   }
 * }
 */
export interface CompileContractsResult<
	TCompilationOutput extends CompilationOutputOption[] = CompilationOutputOption[],
	TSourcePaths extends string[] = string[],
> extends CompileBaseResult {
	compilationResult: {
		[sourcePath in TSourcePaths & string]: CompiledSource<TCompilationOutput>
	}
}

export interface CompileSourceResult<TCompilationOutput extends CompilationOutputOption[] = CompilationOutputOption[]>
	extends CompileContractsResult<TCompilationOutput> {}

export interface CompileFilesResult<
	TCompilationOutput extends CompilationOutputOption[] = CompilationOutputOption[],
	TFilePaths extends string[] = string[],
> extends CompileContractsResult<TCompilationOutput, TFilePaths> {}

export interface CompileSourceWithShadowResult<
	TCompilationOutput extends CompilationOutputOption[] = CompilationOutputOption[],
> extends CompileContractsResult<TCompilationOutput> {}

/* -------------------------------------------------------------------------- */
/*                                  WHATSABI                                  */
/* -------------------------------------------------------------------------- */
/* --------------------------------- OPTIONS -------------------------------- */
// TODO: this and all these types are in whatsabi directly
export interface WhatsabiBaseOptions extends CompileBaseOptions {
	chainId?: number
	// followProxies, loaders api keys, etc
}

export interface FetchVerifiedContractOptions {
	address: `0x${string}`
}

export interface FetchVerifiedContractsOptions {
	addresses: `0x${string}`[]
}

/* --------------------------------- RESULT --------------------------------- */
// TODO: make whatsabi output the same api as compile functions
// TODO: here we might want to get the same ast object with useful methods as the compiler api
export interface FetchVerifiedContractResult {
	contractOutput: CompiledSourceContractOutput
}

export interface FetchVerifiedContractsResult {
	contractOutput: {
		[address: `0x${string}`]: FetchVerifiedContractResult
	}
}

export type FetchVerifiedContracts = (options: FetchVerifiedContractsOptions) => Promise<FetchVerifiedContractsResult>

/* -------------------------------------------------------------------------- */
/*                                  COMPILER                                  */
/* -------------------------------------------------------------------------- */
export interface Compiler {
	// Compile source code directly
	// Pass base options to override constructor options during this compilation
	compileSource: <
		TLanguage extends SolcLanguage = SolcLanguage,
		TCompilationOutput extends CompilationOutputOption[] = CompilationOutputOption[],
	>(
		options: CompileBaseOptions<TCompilationOutput> & {
			source: TLanguage extends 'SolidityAST' ? ASTNode | SolcAst : string
		},
	) => Promise<CompileSourceResult<TCompilationOutput>>

	// Compile files
	compileFiles: <
		TSourcePaths extends string[] = string[],
		TCompilationOutput extends CompilationOutputOption[] = CompilationOutputOption[],
	>(
		options: CompileBaseOptions<TCompilationOutput> & { files: TSourcePaths },
	) => Promise<CompileFilesResult<TCompilationOutput, TSourcePaths>>

	// Construct Solidity source code from ASTs
	generateContractsFromAst: (options: CompileBaseOptions & { ast: ASTNode | SolcAst }) => GenerateContractsFromAstResult

	// Fetch verified contract from various providers using whatsabi & return the same api as the compiler
	fetchVerifiedContract: (options: FetchVerifiedContractOptions) => Promise<FetchVerifiedContractResult>
	// TODO: is this useful? maybe we can so some batching here
	fetchVerifiedContracts: (options: FetchVerifiedContractsOptions) => Promise<FetchVerifiedContractsResult>

	// Load a solc version (this can be used to lazily load solc, otherwise it's loaded on first compilation)
	loadSolcVersion: (version: keyof Releases | keyof Releases[]) => Promise<this>

	clearCache: () => Promise<void>
}

export interface CreateCompilerOptions extends CompileBaseOptions, WhatsabiBaseOptions {}
export interface CreateCompilerResult extends Compiler {}
export type CreateCompiler = (options?: CreateCompilerOptions) => CreateCompilerResult

/* -------------------------------------------------------------------------- */
/*                                   HELPERS                                  */
/* -------------------------------------------------------------------------- */
export type Logger = {
	info: (...messages: string[]) => void
	error: (...message: string[]) => void
	warn: (...message: string[]) => void
	debug: (...message: string[]) => void
	log: (...message: string[]) => void
}

/**
 * Helper type to conditionally include an object in the output based on compilation output selection
 * @template TOutputSelection - The compilation output selection array
 * @template Path - The path to check in the selection (e.g., 'abi', 'evm', 'metadata')
 * @template Output - The object to include if the path is selected
 */
type WithCompilationOutput<
	TOutputSelection extends readonly string[],
	Path extends string,
	Output extends object,
> = TOutputSelection[number] extends '*' | Path | `${Path}.${string}` ? Output : {}
