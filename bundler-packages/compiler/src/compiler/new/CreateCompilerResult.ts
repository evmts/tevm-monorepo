import type { Releases, SolcLanguage, SolcOutput } from '@tevm/solc'
import type { Address } from '@tevm/utils'
import type { AstInput } from './compiler/AstInput.js'
import type { CompilationOutputOption } from './compiler/CompilationOutputOption.js'
import type { CompileBaseOptions } from './compiler/CompileBaseOptions.js'
import type { CompileFilesResult } from './compiler/CompileFilesResult.js'
import type { CompileSourceResult } from './compiler/CompileSourceResult.js'
import type { FetchVerifiedContractResult } from './whatsabi/FetchVerifiedContractResult.js'
import type { FetchVerifiedContractsResult } from './whatsabi/FetchVerifiedContractsResult.js'
import type { WhatsabiBaseOptions } from './whatsabi/WhatsabiBaseOptions.js'

export interface CreateCompilerResult {
	// Compile source code directly
	// Pass base options to override constructor options during this compilation
	compileSource: <
		TLanguage extends SolcLanguage = SolcLanguage,
		TCompilationOutput extends CompilationOutputOption[] = CompilationOutputOption[],
	>(
		source: TLanguage extends 'SolidityAST' ? AstInput : string,
		options: CompileBaseOptions<TLanguage, TCompilationOutput>,
	) => Promise<CompileSourceResult<TCompilationOutput>>

	// Compile files
	compileFiles: <
		TLanguage extends SolcLanguage = SolcLanguage,
		TCompilationOutput extends CompilationOutputOption[] = CompilationOutputOption[],
		TSourcePaths extends string[] = string[],
	>(
		files: TSourcePaths,
		options: CompileBaseOptions<TLanguage, TCompilationOutput>,
	) => Promise<CompileFilesResult<TCompilationOutput, TSourcePaths>>

	// Construct Solidity source code from Solc output
	extractContractsFromSolcOutput: (
		solcOutput: SolcOutput,
		options: CompileBaseOptions,
	) => { [sourcePath: string]: string }
	// Construct Solidity source code from a single AST
	extractContractsFromAst: (ast: AstInput, options: CompileBaseOptions) => string

	// Fetch verified contract from various providers using whatsabi & return the same api as the compiler
	fetchVerifiedContract: (address: Address, options: WhatsabiBaseOptions) => Promise<FetchVerifiedContractResult>
	// TODO: is this useful? maybe we can so some batching here
	fetchVerifiedContracts: (addresses: Address[], options: WhatsabiBaseOptions) => Promise<FetchVerifiedContractsResult>

	// Load a solc version (this can be used to lazily load solc, otherwise it's loaded on first compilation)
	loadSolcVersion: (version: keyof Releases | keyof Releases[]) => Promise<this>

	clearCache: () => Promise<this>
}
