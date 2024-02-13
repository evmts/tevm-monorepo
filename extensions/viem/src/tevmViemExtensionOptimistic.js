import { tevmViemExtension } from './tevmViemExtension.js'
import { waitForTransactionReceipt } from 'viem/actions'

// TODO handle the transaction reverting
/**
 * @deprecated in favor of the viem transport
 * @experimental
 * This extension is highly experimental and should not be used in production.
 *
 * Creates a decorator to a viem wallet client that adds the `writeContractOptimistic` method to the `tevm` property.
 * It also decorates all the normal `tevm` methods from the [Tevm api](https://tevm.sh/generated/tevm/api/type-aliases/tevm/)
 * This enables viem to optimistically update the tevm state before the transaction is mined.
 * @example
 * ```ts
 * import { tevmViemExtensionOptimistic } from 'tevmViemExtensionOptimistic'
 * import { walletClient } from './walletClient.js'
 *
 * const client = walletClient.extend(tevmViemExtensionOptimistic())
 *
 * for (const result of client.tevm.writeContractOptimistic({
 *   from: '0x...',
 *   to: '0x...',
 *   abi: [...],
 *   functionName: 'transferFrom',
 *   args: ['0x...', '0x...', '1000000000000000000'],
 * })) {
 *	if (result.tag === 'OPTIMISTIC_RESULT') {
 *		expect(result).toEqual({
 *			data: mockRequestResponse as any,
 *			success: true,
 *			tag: 'OPTIMISTIC_RESULT',
 *		})
 *		expect((client.request as jest.Mock).mock.lastCall[0]).toEqual({
 *			method: 'tevm_contract',
					params: params,
 *			jsonrpc: '2.0',
 *		})
 *		expect((client.writeContract as jest.Mock).mock.lastCall[0]).toEqual({
 *			abi: params.abi,
 *			functionName: params.functionName,
 *			args: params.args,
 *			caller: params.caller,
 *			address: params.address,
 *			account: params.account,
 *			chain: params.chain,
 *		})
 *	} else if (result.tag === 'HASH') {
 *		expect(result).toEqual({
 *			data: mockWriteContractResponse,
 *			success: true,
 *			tag: 'HASH',
 *		})
 *	} else if (result.tag === 'RECEIPT') {
 *		expect(result).toEqual({
 *			data: mockTxReciept,
 *			success: true,
 *			tag: 'RECEIPT',
 *		})
 *		expect(mockWaitForTransactionReceipt.mock.lastCall[0]).toEqual(client)
 *		expect(mockWaitForTransactionReceipt.mock.lastCall[1]).toEqual({
 *			hash: mockWriteContractResponse,
 *		})
 *	}
 * }
 */
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
