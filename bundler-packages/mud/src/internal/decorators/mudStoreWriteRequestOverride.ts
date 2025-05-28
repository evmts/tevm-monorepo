import type { Logger } from '@tevm/logger'
import type { MemoryClient } from '@tevm/memory-client'
import { type Address, createAddressFromString } from '@tevm/utils'
import { type Client, type TransactionReceipt, concatHex, encodeFunctionData, publicActions } from 'viem'
import { type TxStatusSubscriber, notifyTxStatus } from '../../subscribeTx.js'
import type { SessionClient } from '../../types.js'
import { generateTxIdentifier } from '../txIdentifier.js'

export const mudStoreWriteRequestOverride =
	(client: Client | SessionClient, logger?: Logger) =>
	({
		memoryClient,
		storeAddress,
		txStatusSubscribers,
	}: { memoryClient: MemoryClient; storeAddress: Address; txStatusSubscribers: Set<TxStatusSubscriber> }) => {
		const vm = memoryClient.transport.tevm.getVm()
		const txPool = memoryClient.transport.tevm.getTxPool()

		// Only methods we can intercept on the entrykit session client are writeContract and signUserOperation
		if (client.type === 'bundlerClient' && 'writeContract' in client) {
			const publicClient = client.client.extend(publicActions)
			const originalWriteContract = client.writeContract

			client.writeContract = async function interceptedWriteContract(args) {
				const txIdentifier = generateTxIdentifier()

				const originalRes = originalWriteContract({ ...args, dataSuffix: txIdentifier })
				logger?.debug(
					{ functionName: args.functionName, args: args.args, response: originalRes },
					'Intercepted writeContract',
				)

				const simulateTx = async () => {
					notifyTxStatus(txStatusSubscribers)({
						id: txIdentifier,
						status: 'simulating',
						timestamp: Date.now(),
					})

					// TODO: this should definitely be avoided
					// clear the fork cache so it doesn't try to read `getStorageAt` from it,
					// which would bypass the request we're intercepting in the mudStoreGetStorageAtOverride
					// by fetching the initial never-modified fork cache
					;(await vm).stateManager._baseState.forkCache.storage.clearStorage(createAddressFromString(storeAddress))

					logger?.debug({ functionName: args.functionName, args: args.args }, 'Simulating MUD tx with tevmContract')
					try {
						const { txHash: optimisticTxHash, errors } = await memoryClient.tevmCall({
							to: args.address,
							data: concatHex([
								encodeFunctionData({
									abi: args.abi,
									functionName: args.functionName,
									args: args.args,
								}),
								txIdentifier,
							]),
							caller: client.userAddress,
							throwOnFail: false,
							skipBalance: true,
							addToMempool: true,
							blockTag: 'pending',
						})

						// TODO: should we throw or should we still attempt to broadcast?
						if (errors) {
							logger?.warn(
								{ functionName: args.functionName, args: args.args, errors },
								'Errors during tevmContract call.',
							)
						} else {
							logger?.debug(
								{ functionName: args.functionName, args: args.args, optimisticTxHash },
								'Optimistic tx executed successfully.',
							)
						}

						notifyTxStatus(txStatusSubscribers)({
							id: txIdentifier,
							status: 'optimistic',
							timestamp: Date.now(),
						})

						const txHash = await originalRes
						notifyTxStatus(txStatusSubscribers)({
							id: txIdentifier,
							hash: txHash,
							status: 'optimistic',
							timestamp: Date.now(),
						})
						// Whenever the tx is mined on the actual network, remove it from the pending block
						// if we didn't intercept getStorageAt requests we would want to mine the tx to update the fork state additionally
						const receipt = (await publicClient.waitForTransactionReceipt({ hash: txHash })) as TransactionReceipt
						notifyTxStatus(txStatusSubscribers)({
							id: txIdentifier,
							hash: txHash,
							status: receipt.status === 'success' ? 'confirmed' : 'reverted',
							timestamp: Date.now(),
						})

						logger?.debug(
							{ functionName: args.functionName, args: args.args, txHash },
							'Method completed successfully.',
						)
						if (optimisticTxHash) (await txPool).removeByHash(optimisticTxHash)
					} catch (error) {
						logger?.error({ functionName: args.functionName, args: args.args, error }, 'Method failed with error.')
						throw error
					}
				}

				simulateTx()
				return originalRes
			}
		}

		// TODO: see how it's done when not using entrykit and implement; might able to just be intercept and copy eth_sendRawTransaction
		// const originalRequest = client.request
		// // @ts-expect-error - Type 'unknown' is not assignable to type '_returnType'.
		// client.request = async function interceptedRequest(
		// 	requestArgs: any,
		// 	options: any,
		// ): ReturnType<EIP1193RequestFn> {
		// 	if (
		// 		requestArgs.method === 'eth_sendRawTransaction' &&
		// 		requestArgs.params &&
		// 		Array.isArray(requestArgs.params) &&
		// 		requestArgs.params[0]?.toLowerCase() === storeAddress.toLowerCase()
		// 	) {
		// 		logger?.debug({ storeAddress }, 'MUD Intercept: eth_sendRawTransaction')

		// 		try {
		// 			// Intercept non-entrykit write requests/send transaction
		// 		} catch (error: any) {
		// 		}
		// 	}

		// 	return originalRequest.call(this, requestArgs, options)
		// }
	}
