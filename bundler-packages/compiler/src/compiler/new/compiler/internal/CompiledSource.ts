import type { SolcAst } from '@tevm/solc'
import type { CompilationOutputOption } from '../CompilationOutputOption.js'
import type { CompiledSourceContractOutput } from './CompiledSourceContractOutput.js'

export interface CompiledSource<
	TCompilationOutput extends CompilationOutputOption[] | undefined = CompilationOutputOption[] | undefined,
> {
	ast: Extract<
		TCompilationOutput extends CompilationOutputOption[] ? TCompilationOutput[number] : never,
		'ast' | '*'
	> extends never
		? undefined
		: SolcAst
	id: number
	contract: {
		[sourceName: string]: CompiledSourceContractOutput<TCompilationOutput>
	}
}
