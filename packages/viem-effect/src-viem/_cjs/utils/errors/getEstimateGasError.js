'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.getEstimateGasError = void 0
const estimateGas_js_1 = require('../../errors/estimateGas.js')
const node_js_1 = require('../../errors/node.js')
const getNodeError_js_1 = require('./getNodeError.js')
function getEstimateGasError(err, { docsPath, ...args }) {
	let cause = (0, getNodeError_js_1.getNodeError)(err, args)
	if (cause instanceof node_js_1.UnknownNodeError) cause = err
	return new estimateGas_js_1.EstimateGasExecutionError(cause, {
		docsPath,
		...args,
	})
}
exports.getEstimateGasError = getEstimateGasError
//# sourceMappingURL=getEstimateGasError.js.map
