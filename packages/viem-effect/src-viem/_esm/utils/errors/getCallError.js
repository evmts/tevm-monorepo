import { CallExecutionError } from '../../errors/contract.js'
import { UnknownNodeError } from '../../errors/node.js'
import { getNodeError } from './getNodeError.js'
export function getCallError(err, { docsPath, ...args }) {
	let cause = getNodeError(err, args)
	if (cause instanceof UnknownNodeError) cause = err
	return new CallExecutionError(cause, {
		docsPath,
		...args,
	})
}
//# sourceMappingURL=getCallError.js.map
