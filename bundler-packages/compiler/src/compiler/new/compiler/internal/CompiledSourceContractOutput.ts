import type { SolcContractOutput } from '@tevm/solc'
import type { Abi } from 'abitype'
import type { CompilationOutputOption } from '../CompilationOutputOption.js'

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
