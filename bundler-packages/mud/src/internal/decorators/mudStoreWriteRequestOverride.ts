import type { MemoryClient } from '@tevm/memory-client'
import { type Address, EthjsAddress } from '@tevm/utils'
import { type Client, type TransactionReceipt, publicActions } from 'viem'
import { type TxStatusSubscriber, notifyTxStatus } from '../../subscribeTx.js'
import type { SessionClient } from '../../types.js'

export const mudStoreWriteRequestOverride =
	(client: Client | SessionClient) =>
	({
		memoryClient,
		storeAddress,
		txStatusSubscribers,
	}: { memoryClient: MemoryClient; storeAddress: Address; txStatusSubscribers: Set<TxStatusSubscriber> }) => {
		const logger = memoryClient.transport.tevm.logger
		const vm = memoryClient.transport.tevm.getVm()
		const txPool = memoryClient.transport.tevm.getTxPool()

		// Only methods we can intercept on the entrykit session client are writeContract and signUserOperation
		if (client.type === 'bundlerClient' && 'writeContract' in client) {
			const publicClient = client.client.extend(publicActions)
			const originalWriteContract = client.writeContract

			client.writeContract = async function interceptedWriteContract(args) {
				const originalRes = originalWriteContract(args)
				logger.debug('Intercepted writeContract', { args, response: originalRes })

				const simulateTx = async () => {
					const txId = crypto.randomUUID()
					notifyTxStatus(txStatusSubscribers)({
						id: txId,
						status: 'simulating',
						timestamp: Date.now(),
					})

					// TODO: this should definitely be avoided
					// clear the fork cache so it doesn't try to read `getStorageAt` from it,
					// which would bypass the request we're intercepting in the mudStoreGetStorageAtOverride
					// by fetching the initial never-modified fork cache
					;(await vm).stateManager._baseState.forkCache.storage.clearContractStorage(
						EthjsAddress.fromString(storeAddress),
					)

					try {
						const { txHash: optimisticTxHash, errors } = await memoryClient.tevmContract({
							to: args.address,
							abi: args.abi,
							functionName: args.functionName,
							args: args.args,
							caller: client.userAddress,
							throwOnFail: false,
							skipBalance: true,
							addToMempool: true,
							blockTag: 'pending',
						})

						// TODO: should we throw or should we still attempt to broadcast?
						if (errors) logger.warn('Errors during tevmContract call:', errors)

						notifyTxStatus(txStatusSubscribers)({
							id: txId,
							status: 'optimistic',
							timestamp: Date.now(),
						})

						const txHash = await originalRes
						notifyTxStatus(txStatusSubscribers)({
							id: txId,
							hash: txHash,
							status: 'optimistic',
							timestamp: Date.now(),
						})
						// Whenever the tx is mined on the actual network, remove it from the pending block
						// if we didn't intercept getStorageAt requests we would want to mine the tx to update the fork state additionally
						const receipt = (await publicClient.waitForTransactionReceipt({ hash: txHash })) as TransactionReceipt
						notifyTxStatus(txStatusSubscribers)({
							id: txId,
							hash: txHash,
							status: receipt.status === 'success' ? 'confirmed' : 'reverted',
							timestamp: Date.now(),
						})

						logger.debug(`Method ${args.functionName} completed successfully. Hash:`, txHash)
						if (optimisticTxHash) (await txPool).removeByHash(optimisticTxHash)
					} catch (error) {
						logger.error(`Method ${args.functionName} failed with error:`, error)
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
		// 		logger.debug(`MUD Intercept: eth_sendRawTransaction ${storeAddress}`)

		// 		try {
		// 			// Intercept non-entrykit write requests/send transaction
		// 		} catch (error: any) {
		// 		}
		// 	}

		// 	return originalRequest.call(this, requestArgs, options)
		// }
	}
