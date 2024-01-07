import { tevmViemExtension } from './tevmViemExtension.js'
import { waitForTransactionReceipt } from 'viem/actions'

export const tevmViemExtensionOptimistic = () => {
	/**
	 * @type {import('./ViemTevmOptimisticClientDecorator.js').ViemTevmOptimisticClientDecorator}
	 */
	const decorator = (client) => {
		const tevmClient = tevmViemExtension()(client)
		/**
		 * @type {import("./ViemTevmOptimisticClient.js").ViemTevmOptimisticClient['tevm']['writeContractOptimistic']}
		 */
		const writeContractOptimistic = async function* (action) {
			/**
			 * @type {Array<import('./TypedError.js').TypedError<string>>}
			 */
			const errors = []
			const getErrorsIfExist = () => (errors.length > 0 ? { errors } : {})

			const writeContractResult = client.writeContract(/** @type any*/ (action))
			const optimisticResult = client.request({
				jsonrpc: '2.0',
				method: /** @type {any}*/ ('tevm_contract'),
				params: /** @type {any}*/ (action),
			})

			try {
				yield {
					success: true,
					tag: 'OPTIMISTIC_RESULT',
					data: /** @type {any} */ (await optimisticResult),
					...getErrorsIfExist(),
				}
			} catch (error) {
				errors.push(/** @type {any}*/ (error))
				yield {
					success: false,
					tag: 'OPTIMISTIC_RESULT',
					error: /** @type {any} */ (error),
					...getErrorsIfExist(),
				}
			}

			/**
			 * @type {import('viem').Hex | undefined}
			 **/
			let hash = undefined
			try {
				hash = await writeContractResult
				yield {
					success: true,
					tag: 'HASH',
					data: /** @type {any}*/ (hash),
					...getErrorsIfExist(),
				}
			} catch (error) {
				errors.push(/** @type {any}*/ (error))
				yield {
					success: false,
					tag: 'HASH',
					error: /** @type {any}*/ (error),
					...getErrorsIfExist(),
				}
			}

			if (hash) {
				try {
					const receipt = await waitForTransactionReceipt(
						/** @type{any}*/ (client),
						{ hash },
					)
					yield {
						success: true,
						tag: 'RECEIPT',
						data: /** @type {any} */ (receipt),
						...getErrorsIfExist(),
					}
				} catch (error) {
					errors.push(/** @type {any}*/ (error))
					yield {
						success: false,
						tag: 'RECEIPT',
						error: /** @type {any} */ (error),
						errors,
						...getErrorsIfExist(),
					}
				}
			}
			return
		}
		return {
			...tevmClient,
			tevm: {
				...tevmClient.tevm,
				writeContractOptimistic: /** @type any */ (writeContractOptimistic),
			},
		}
	}
	return decorator
}
