import type { Overrides } from 'ethers'

export type ContractMethodArgs<A extends ReadonlyArray<any>> =
	| [...A, Overrides]
	| A
