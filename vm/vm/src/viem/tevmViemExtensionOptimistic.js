import { parse, stringify } from 'superjson'

/**
 * @type {import('./types.js').ViemTevmOptimisticExtension}
 */
export const tevmViemExtensionOptimistic = () => {
	return (client) => {
		return {
			writeContractOptimistic: async (action) => {
				/**
				 * @type {import('./types.js').ViemTevmClient['tevmRequest']}
				 */
				const tevmRequest = async (request) => {
					return /** @type {any} */ (
						parse(
							JSON.stringify(
								await client.request({
									method: /** @type {any}*/ (request.method),
									params: /** @type {any}*/ (
										JSON.parse(stringify(request.params))
									),
								}),
							),
						)
					)
				}

				const writeContractResult = client.writeContract(action)
				const optimisticResult = tevmRequest({
					method: 'tevm_contractCall',
					params: /** @type {any}*/ (action),
				})

				// wait for one of the two results to come back
				// This allows us to reject right away if the optimistic result fails
				const error = await Promise.race([
					writeContractResult,
					optimisticResult,
				])
					.then(() => undefined)
					.catch((err) => err)

				// If error wait for all the promises to resolve before throwing
				// We may want to consider using async generators or event emitters in future
				if (error) {
					const errors = await Promise.allSettled([
						writeContractResult,
						optimisticResult,
					]).then((results) => {
						return results.filter((result) => result.status === 'rejected')
					})
					if (errors.length === 1) {
						throw errors[0]
					}
					throw new AggregateError(errors)
				}

				// Return the result as soon as at least 1 of them is available
				return {
					optimisticResult: () => optimisticResult,
					result: () => writeContractResult,
				}
			},
		}
	}
}
