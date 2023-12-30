import type { Account } from '../../accounts/types.js'
import type { EstimateGasParameters } from '../../actions/public/estimateGas.js'
import type { BaseError } from '../../errors/base.js'
import { EstimateGasExecutionError } from '../../errors/estimateGas.js'
import type { Chain } from '../../types/chain.js'
export declare function getEstimateGasError(
	err: BaseError,
	{
		docsPath,
		...args
	}: Omit<EstimateGasParameters, 'account'> & {
		account?: Account
		chain?: Chain
		docsPath?: string
	},
): EstimateGasExecutionError
//# sourceMappingURL=getEstimateGasError.d.ts.map
