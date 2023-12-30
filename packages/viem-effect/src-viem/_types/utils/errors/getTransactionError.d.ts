import type { Account } from '../../accounts/types.js'
import type { SendTransactionParameters } from '../../actions/wallet/sendTransaction.js'
import type { BaseError } from '../../errors/base.js'
import { TransactionExecutionError } from '../../errors/transaction.js'
import type { Chain } from '../../types/chain.js'
export type GetTransactionErrorParameters = Omit<
	SendTransactionParameters,
	'account' | 'chain'
> & {
	account: Account
	chain?: Chain
	docsPath?: string
}
export declare function getTransactionError(
	err: BaseError,
	{ docsPath, ...args }: GetTransactionErrorParameters,
): TransactionExecutionError
//# sourceMappingURL=getTransactionError.d.ts.map
