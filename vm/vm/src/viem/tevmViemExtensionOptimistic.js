import { parse, stringify } from 'superjson'
import { waitForTransactionReceipt } from 'viem/actions'

/**
 * @type {import('./types.js').ViemTevmOptimisticExtension}
 */
export const tevmViemExtensionOptimistic = () => {
	return (client) => {
		return {
			writeContractOptimistic: async function*(action) {
				/**
				 * @type {Array<import('./types.js').TypedError<string>>}
				 */
				const errors = []
				const getErrorsIfExist = () => errors.length > 0 ? { errors } : {}
				/**
				 * @type {import('./types.js').ViemTevmClient['tevmRequest']}
				 */
				const tevmRequest = async (request) => {
					return /** @type {any} */ (
						parse(
							JSON.stringify(
								await client.request({
									method: /** @type {any}*/ (request.method),
									params: /** @type {any}*/ (JSON.parse(stringify(request.params))),
								}),
							),
						)
					)
				}

				const writeContractResult = client.writeContract(action);
				const optimisticResult = tevmRequest({
					method: 'tevm_contractCall',
					params: /** @type {any}*/(action),
				});

				try {
					yield { success: true, tag: 'OPTIMISTIC_RESULT', data: /** @type {any}*/(await optimisticResult), ...getErrorsIfExist() };
				} catch (error) {
					errors.push(/** @type {any}*/(error))
					yield { success: false, tag: 'OPTIMISTIC_RESULT', error: /** @type {any} */ error, ...getErrorsIfExist() };
				}

				/**
				 * @type {import('viem').Hex | undefined}
				 **/
				let hash = undefined
				try {
					hash = await writeContractResult;
					yield { success: true, tag: 'HASH', data: /** @type {any}*/hash, ...getErrorsIfExist() };
				} catch (error) {
					errors.push(/** @type {any}*/(error))
					yield { success: false, tag: 'HASH', error: /** @type {any}*/error, ...getErrorsIfExist() };
				}

				if (hash) {
					try {
						const receipt = await waitForTransactionReceipt(/** @type{any}*/(client), { hash })
						yield { success: true, tag: 'RECEIPT', data: /** @type {any} */(receipt), ...getErrorsIfExist() };
					} catch (error) {
						errors.push(/** @type {any}*/(error))
						yield { success: false, tag: 'RECEIPT', error: /** @type {any} */(error), errors, ...getErrorsIfExist() };
					}
				}
			},
		}
	}
}
