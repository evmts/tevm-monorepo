'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.getTransactionError = void 0
const node_js_1 = require('../../errors/node.js')
const transaction_js_1 = require('../../errors/transaction.js')
const getNodeError_js_1 = require('./getNodeError.js')
function getTransactionError(err, { docsPath, ...args }) {
	let cause = (0, getNodeError_js_1.getNodeError)(err, args)
	if (cause instanceof node_js_1.UnknownNodeError) cause = err
	return new transaction_js_1.TransactionExecutionError(cause, {
		docsPath,
		...args,
	})
}
exports.getTransactionError = getTransactionError
//# sourceMappingURL=getTransactionError.js.map
