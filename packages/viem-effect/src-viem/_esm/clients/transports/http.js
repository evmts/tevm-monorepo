import { RpcRequestError } from '../../errors/request.js'
import { UrlRequiredError } from '../../errors/transport.js'
import { createBatchScheduler } from '../../utils/promise/createBatchScheduler.js'
import { rpc } from '../../utils/rpc.js'
import { createTransport } from './createTransport.js'
/**
 * @description Creates a HTTP transport that connects to a JSON-RPC API.
 */
export function http(
	/** URL of the JSON-RPC API. Defaults to the chain's public RPC URL. */
	url,
	config = {},
) {
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
		if (!url_) throw new UrlRequiredError()
		return createTransport(
			{
				key,
				name,
				async request({ method, params }) {
					const body = { method, params }
					const { schedule } = createBatchScheduler({
						id: `${url}`,
						wait,
						shouldSplitBatch(requests) {
							return requests.length > batchSize
						},
						fn: (body) =>
							rpc.http(url_, {
								body,
								fetchOptions,
								timeout,
							}),
					})
					const fn = async (body) =>
						batch
							? schedule(body)
							: [await rpc.http(url_, { body, fetchOptions, timeout })]
					const [{ error, result }] = await fn(body)
					if (error)
						throw new RpcRequestError({
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
//# sourceMappingURL=http.js.map
