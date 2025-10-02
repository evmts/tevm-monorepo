import type { Address } from '@tevm/utils'
import type { FetchVerifiedContractResult } from './FetchVerifiedContractResult.js'

// TODO: depends if we have this function
export interface FetchVerifiedContractsResult {
	contractOutput: {
		[address: Address]: FetchVerifiedContractResult
	}
}
