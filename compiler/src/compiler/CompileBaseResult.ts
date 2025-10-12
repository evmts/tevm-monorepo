import type { SolcErrorEntry } from '@tevm/solc'

export interface CompileBaseResult {
	// TODO: should we separate errors (type: 'error') and logs (type: 'warning' | 'info')? Or is this needless abstraction?
	errors?: SolcErrorEntry[] | undefined

	// TODO
	// artifacts
	// modules
	// solcInput
	// solcOutput
}
