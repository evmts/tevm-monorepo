import { UnknownNodeError } from '../../errors/node.js'
import { TransactionExecutionError } from '../../errors/transaction.js'
import { getNodeError } from './getNodeError.js'
export function getTransactionError(err, { docsPath, ...args }) {
	let cause = getNodeError(err, args)
	if (cause instanceof UnknownNodeError) cause = err
	return new TransactionExecutionError(cause, {
		docsPath,
		...args,
	})
}
//# sourceMappingURL=getTransactionError.js.map
