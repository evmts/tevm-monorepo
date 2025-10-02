import type { SolcAst } from '@tevm/solc'
import type { CompilationOutputOption } from '../CompilationOutputOption.js'
import type { CompiledSourceContractOutput } from './CompiledSourceContractOutput.js'

export interface CompiledSource<TCompilationOutput extends CompilationOutputOption[] = CompilationOutputOption[]> {
	ast: SolcAst
	id: number
	contract: {
		[sourceName: string]: CompiledSourceContractOutput<TCompilationOutput>
	}
}
