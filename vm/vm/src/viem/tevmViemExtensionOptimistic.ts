import type { OptimisticResult, TypedError, ViemTevmClient } from './types.js'
import type { Abi } from 'abitype'
import { parse, stringify } from 'superjson'
import type { Account, Chain, Hex, Transport, WriteContractParameters } from 'viem'
import { waitForTransactionReceipt } from 'viem/actions'

export const tevmViemExtensionOptimistic = () => {
	const decorator = <
		TTransport extends Transport = Transport,
		TChain extends Chain | undefined = Chain | undefined,
		TAccount extends Account | undefined = Account | undefined,
	>(
		client: Pick<
			import('viem').WalletClient<TTransport, TChain, TAccount>,
			'request' | 'writeContract'
		>,
	) => {
		return {
			writeContractOptimistic: async function* <
				TAbi extends Abi | readonly unknown[] = Abi,
				TFunctionName extends string = string,
				TChainOverride extends Chain | undefined = Chain | undefined,
			>(
				action: WriteContractParameters<
					TAbi,
					TFunctionName,
					TChain,
					TAccount,
					TChainOverride
				>,
			): AsyncGenerator<OptimisticResult<TAbi, TFunctionName, TChain>> {
				/**
				 * @type {Array<import('./types.js').TypedError<string>>}
				 */
				const errors: TypedError<string>[] = []
				const getErrorsIfExist = () => (errors.length > 0 ? { errors } : {})
				const tevmRequest: ViemTevmClient['tevmRequest'] = async (request) => {
					return parse(
						JSON.stringify(
							await client.request({
								method: request.method as any,
								params: JSON.parse(stringify(request.params)),
							}),
						),
					)
				}

				const writeContractResult = client.writeContract(action)
				const optimisticResult = tevmRequest({
					method: 'tevm_contractCall',
					params: /** @type {any}*/ (action as any),
				})

				try {
					yield {
						success: true,
						tag: 'OPTIMISTIC_RESULT',
						data: /** @type {any}*/ (await optimisticResult),
						...getErrorsIfExist(),
					}
				} catch (error) {
					errors.push(/** @type {any}*/(error as any))
					yield {
						success: false,
						tag: 'OPTIMISTIC_RESULT',
						error: /** @type {any} */ error as any,
						...getErrorsIfExist(),
					}
				}

				/**
				 * @type {import('viem').Hex | undefined}
				 **/
				let hash: Hex | undefined = undefined
				try {
					hash = await writeContractResult
					yield {
						success: true,
						tag: 'HASH',
						data: /** @type {any}*/ hash,
						...getErrorsIfExist(),
					}
				} catch (error) {
					errors.push(/** @type {any}*/(error as any))
					yield {
						success: false,
						tag: 'HASH',
						error: /** @type {any}*/ error as any,
						...getErrorsIfExist(),
					}
				}

				if (hash) {
					try {
						const receipt = await waitForTransactionReceipt(
							/** @type{any}*/(client as any),
							{ hash },
						)
						yield {
							success: true,
							tag: 'RECEIPT',
							data: /** @type {any} */ (receipt as any),
							...getErrorsIfExist(),
						}
					} catch (error) {
						errors.push(/** @type {any}*/(error as any))
						yield {
							success: false,
							tag: 'RECEIPT',
							error: /** @type {any} */ (error as any),
							errors,
							...getErrorsIfExist(),
						}
					}
				}
				return
			},
		}
	}
	return decorator
}
