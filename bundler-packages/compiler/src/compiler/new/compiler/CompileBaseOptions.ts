import type { LogOptions } from '@tevm/logger'
import type {
	Releases,
	SolcDebugSettings,
	SolcEvmVersion,
	SolcLanguage,
	SolcMetadataSettings,
	SolcModelChecker,
	SolcOptimizer,
	SolcRemapping,
} from '@tevm/solc'
import type { CompilationOutputOption } from './CompilationOutputOption.js'

// All of the below options can be overridden on a per-compilation basis
export interface CompileBaseOptions<TCompilationOutput extends CompilationOutputOption[] = CompilationOutputOption[]> {
	// Solc settings
	/**
	 * EVM version
	 *
	 * default: latest stable hardfork
	 * @see {@link SolcEvmVersion}
	 */
	hardfork?: SolcEvmVersion | undefined
	/**
	 * The compilation output selection
	 *
	 * Use '*' to select all outputs
	 *
	 * default: ['ast', 'abi', 'evm.bytecode', 'evm.deployedBytecode', 'storageLayout']
	 */
	compilationOutput?: TCompilationOutput | undefined
	/**
	 * Optimizer settings with optional components details
	 *
	 * default: none
	 * @see {@link SolcOptimizer}
	 */
	optimizer?: SolcOptimizer | undefined
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
	debug?: SolcDebugSettings | undefined
	/**
	 * Optional settings to specify how to handle the suffixing of the metadata
	 * @see {@link SolcMetadataSettings}
	 */
	metadata?: SolcMetadataSettings | undefined
	// TODO: check the current state of these experimental options
	modelChecker?: SolcModelChecker | undefined

	/**
	 * Remappings to apply in order to the source code of compiled contracts
	 */
	remappings?: SolcRemapping | undefined
	// TODO: figure out how this works
	libraries?: Record<string, Record<string, string>> | undefined

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
	language?: SolcLanguage | undefined
	/**
	 * Solc version
	 *
	 * Note: this can be used to set a compiler-level version and overriden on a per-compilation basis
	 *
	 * If not provided, it will extract all the pragmas and use the most recent compatible version using solc-typed-ast
	 * @see {@link Releases}
	 */
	solcVersion?: keyof Releases | undefined
	/**
	 * Whether to throw on version mismatc, i.e. if the provided version is
	 * not listed as a compatible version for the provided sources
	 *
	 * default: true
	 */
	throwOnVersionMismatch?: boolean | undefined
	/**
	 * Whether to cache the compilation results
	 *
	 * default: true
	 */
	cacheEnabled?: boolean | undefined
	/**
	 * Directory to cache the compilation results
	 *
	 * default: memory
	 * TODO: does it make sense to cache and default to memory?
	 */
	cacheDirectory?: string | undefined

	/**
	 * Pino logger
	 */
	loggingLevel?: LogOptions['level'] | undefined
}
