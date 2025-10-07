import type { Releases, SolcLanguage, SolcOutput } from '@tevm/solc'
import type { Address } from '@tevm/utils'
import type { AstInput } from './compiler/AstInput.js'
import type { CompilationOutputOption } from './compiler/CompilationOutputOption.js'
import type { CompileBaseOptions } from './compiler/CompileBaseOptions.js'
import type { CompileFilesResult } from './compiler/CompileFilesResult.js'
import type { CompileSourceResult } from './compiler/CompileSourceResult.js'
import type { CompileSourceWithShadowOptions } from './compiler/CompileSourceWithShadowOptions.js'
import type { WhatsabiBaseOptions } from './whatsabi/WhatsabiBaseOptions.js'

export interface CreateCompilerResult {
	compileSource: <
		TLanguage extends SolcLanguage = SolcLanguage,
		TCompilationOutput extends CompilationOutputOption[] = CompilationOutputOption[],
	>(
		source: TLanguage extends 'SolidityAST' ? AstInput : string,
		options: CompileBaseOptions<TLanguage, TCompilationOutput>,
	) => CompileSourceResult<TCompilationOutput>

	compileSourceWithShadow: <
		TLanguage extends SolcLanguage = SolcLanguage,
		TCompilationOutput extends CompilationOutputOption[] = CompilationOutputOption[],
	>(
		source: TLanguage extends 'SolidityAST' ? AstInput : string,
		shadow: string,
		options: CompileBaseOptions<TLanguage, TCompilationOutput> & CompileSourceWithShadowOptions<TLanguage>,
	) => CompileSourceResult<TCompilationOutput>

	compileFiles: <
		TLanguage extends SolcLanguage = SolcLanguage,
		TCompilationOutput extends CompilationOutputOption[] = CompilationOutputOption[],
		TSourcePaths extends string[] = string[],
	>(
		files: TSourcePaths,
		options: CompileBaseOptions<TLanguage, TCompilationOutput>,
	) => Promise<CompileFilesResult<TCompilationOutput, TSourcePaths>>

	compileFilesSync: <
		TLanguage extends SolcLanguage = SolcLanguage,
		TCompilationOutput extends CompilationOutputOption[] = CompilationOutputOption[],
		TSourcePaths extends string[] = string[],
	>(
		files: TSourcePaths,
		options: CompileBaseOptions<TLanguage, TCompilationOutput>,
	) => CompileFilesResult<TCompilationOutput, TSourcePaths>

	compileFilesWithShadow: <
		TLanguage extends SolcLanguage = SolcLanguage,
		TCompilationOutput extends CompilationOutputOption[] = CompilationOutputOption[],
		TSourcePaths extends string[] = string[],
	>(
		files: TSourcePaths,
		shadow: string,
		options: CompileBaseOptions<TLanguage, TCompilationOutput> & CompileSourceWithShadowOptions<TLanguage>,
	) => Promise<CompileFilesResult<TCompilationOutput, TSourcePaths>>

	compileFilesWithShadowSync: <
		TLanguage extends SolcLanguage = SolcLanguage,
		TCompilationOutput extends CompilationOutputOption[] = CompilationOutputOption[],
		TSourcePaths extends string[] = string[],
	>(
		files: TSourcePaths,
		shadow: string,
		options: CompileBaseOptions<TLanguage, TCompilationOutput> & CompileSourceWithShadowOptions<TLanguage>,
	) => CompileFilesResult<TCompilationOutput, TSourcePaths>

	// Construct Solidity source code from Solc output
	extractContractsFromSolcOutput: (
		solcOutput: SolcOutput,
		options: CompileBaseOptions,
	) => { [sourcePath: string]: string }
	// Construct Solidity source code from a single AST
	extractContractsFromAst: (ast: AstInput, options: CompileBaseOptions) => string

	// Fetch verified contract from various providers using whatsabi & return the same api as the compiler
	fetchVerifiedContract: (address: Address, options: WhatsabiBaseOptions) => Promise<void>

	// Load a solc version; this must be done before any compilation (no input means latest version)
	loadSolc: (version: keyof Releases) => Promise<void>

	clearCache: () => Promise<void>
}
