import type { CallParameters } from '../../actions/public/call.js'
import type { BaseError } from '../../errors/base.js'
import { CallExecutionError } from '../../errors/contract.js'
import type { Chain } from '../../types/chain.js'
export declare function getCallError(
	err: BaseError,
	{
		docsPath,
		...args
	}: CallParameters & {
		chain?: Chain
		docsPath?: string
	},
): CallExecutionError
//# sourceMappingURL=getCallError.d.ts.map
