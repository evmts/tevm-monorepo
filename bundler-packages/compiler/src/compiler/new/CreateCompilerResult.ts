import type { Releases, SolcAst, SolcLanguage } from '@tevm/solc'
import type { Address } from '@tevm/utils'
import type { ASTNode } from 'solc-typed-ast'
import type { CompilationOutputOption } from './compiler/CompilationOutputOption.js'
import type { CompileBaseOptions } from './compiler/CompileBaseOptions.js'
import type { CompileFilesResult } from './compiler/CompileFilesResult.js'
import type { CompileSourceResult } from './compiler/CompileSourceResult.js'
import type { ExtractContractsFromAstResult } from './compiler/ExtractContractsFromAstResult.js'
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
		source: TLanguage extends 'SolidityAST' ? ASTNode | SolcAst : string,
		options: CompileBaseOptions<TCompilationOutput>,
	) => Promise<CompileSourceResult<TCompilationOutput>>

	// Compile files
	compileFiles: <
		TSourcePaths extends string[] = string[],
		TCompilationOutput extends CompilationOutputOption[] = CompilationOutputOption[],
	>(
		files: TSourcePaths,
		options: CompileBaseOptions<TCompilationOutput>,
	) => Promise<CompileFilesResult<TCompilationOutput, TSourcePaths>>

	// Construct Solidity source code from ASTs
	extractContractsFromAst: (ast: ASTNode | SolcAst, options: CompileBaseOptions) => ExtractContractsFromAstResult

	// Fetch verified contract from various providers using whatsabi & return the same api as the compiler
	fetchVerifiedContract: (address: Address, options: WhatsabiBaseOptions) => Promise<FetchVerifiedContractResult>
	// TODO: is this useful? maybe we can so some batching here
	fetchVerifiedContracts: (addresses: Address[], options: WhatsabiBaseOptions) => Promise<FetchVerifiedContractsResult>

	// Load a solc version (this can be used to lazily load solc, otherwise it's loaded on first compilation)
	loadSolcVersion: (version: keyof Releases | keyof Releases[]) => Promise<this>

	clearCache: () => Promise<this>
}
