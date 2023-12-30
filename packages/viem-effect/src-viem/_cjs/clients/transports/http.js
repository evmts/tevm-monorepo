'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.http = void 0
const request_js_1 = require('../../errors/request.js')
const transport_js_1 = require('../../errors/transport.js')
const createBatchScheduler_js_1 = require('../../utils/promise/createBatchScheduler.js')
const rpc_js_1 = require('../../utils/rpc.js')
const createTransport_js_1 = require('./createTransport.js')
function http(url, config = {}) {
	const {
		batch,
		fetchOptions,
		key = 'http',
		name = 'HTTP JSON-RPC',
		retryDelay,
	} = config
	return ({ chain, retryCount: retryCount_, timeout: timeout_ }) => {
		const { batchSize = 1000, wait = 0 } =
			typeof batch === 'object' ? batch : {}
		const retryCount = config.retryCount ?? retryCount_
		const timeout = timeout_ ?? config.timeout ?? 10000
		const url_ = url || chain?.rpcUrls.default.http[0]
		if (!url_) throw new transport_js_1.UrlRequiredError()
		return (0, createTransport_js_1.createTransport)(
			{
				key,
				name,
				async request({ method, params }) {
					const body = { method, params }
					const { schedule } = (0,
					createBatchScheduler_js_1.createBatchScheduler)({
						id: `${url}`,
						wait,
						shouldSplitBatch(requests) {
							return requests.length > batchSize
						},
						fn: (body) =>
							rpc_js_1.rpc.http(url_, {
								body,
								fetchOptions,
								timeout,
							}),
					})
					const fn = async (body) =>
						batch
							? schedule(body)
							: [await rpc_js_1.rpc.http(url_, { body, fetchOptions, timeout })]
					const [{ error, result }] = await fn(body)
					if (error)
						throw new request_js_1.RpcRequestError({
							body,
							error,
							url: url_,
						})
					return result
				},
				retryCount,
				retryDelay,
				timeout,
				type: 'http',
			},
			{
				url,
			},
		)
	}
}
exports.http = http
//# sourceMappingURL=http.js.map
