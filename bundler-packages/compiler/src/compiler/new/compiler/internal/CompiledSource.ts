import type { SolcAst } from '@tevm/solc'
import type { CompilationOutputOption } from '../CompilationOutputOption.js'
import type { CompiledSourceContractOutput } from './CompiledSourceContractOutput.js'

export interface CompiledSource<TCompilationOutput extends CompilationOutputOption[] = CompilationOutputOption[]> {
	ast: Extract<TCompilationOutput[number], 'ast' | '*'> extends never ? undefined : SolcAst
	id: number
	contract: {
		[sourceName: string]: CompiledSourceContractOutput<TCompilationOutput>
	}
}
