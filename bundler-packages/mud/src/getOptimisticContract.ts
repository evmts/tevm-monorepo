import { type MemoryClient } from '@tevm/memory-client'
import {
	type Abi,
	type Account,
	type Chain,
	type Client,
	type GetContractParameters,
	type Transport,
	type WriteContractReturnType,
	getContract,
	publicActions,
} from 'viem'

/**
 * Wraps a `getContract` to intercept write calls and:
 * - simulate the call with Tevm on the pending block
 * - broadcast the tx as intended initially
 * - remove the tx from the pending pool when it's been mined on the actual network
 *
 * This allows us to use the pending block in the Tevm client as the optimistic state that we add
 * on top of the canonical state of the chain.
 */
export const getOptimisticContract =
	(memoryClient: MemoryClient) =>
	(
		params: GetContractParameters<
			Transport,
			Chain,
			Account,
			Abi,
			{ public: Client<Transport, Chain>; wallet: Client<Transport, Chain, Account> }
		>,
	) => {
		const logger = memoryClient.transport.tevm.logger
		const contract = getContract(params)
		if (contract.write === undefined) throw new Error('Wallet client must be provided.')
		const {
			client: { public: publicClient, wallet: walletClient },
			abi,
			address,
		} = params
		const { waitForTransactionReceipt } = publicClient.extend(publicActions)

		// TODO: we shouldn't have to do this but from the 2nd tx in the pool it starts failing because
		// "sender doesn't have enough funds to send tx"
		memoryClient.tevmDeal({
			account: walletClient.account.address,
			amount: 100000000000000000000n,
		})

		const wrappedContract = new Proxy(contract, {
			get(target, prop, receiver) {
				if (prop === 'write') {
					const writeObject = Reflect.get(target, prop, receiver)

					return new Proxy(writeObject, {
						get(writeTarget, methodName, writeReceiver) {
							const originalMethod = Reflect.get(writeTarget, methodName, writeReceiver)
							if (typeof originalMethod !== 'function') return originalMethod

							return async function (this: any, ...args: any[]) {
								logger.debug(`Calling method ${String(methodName)} with args:`, args)

								try {
									const { txHash: optimisticTxHash, errors } = await memoryClient.tevmContract({
										abi,
										from: walletClient.account.address,
										to: address,
										functionName: methodName.toString(),
										args: args,
										throwOnFail: false,
										skipBalance: true,
										addToMempool: true,
										blockTag: 'pending',
									})

									// TODO: should we throw or should we still attempt to broadcast?
									if (errors) logger.warn('Errors during tevmContract call:', errors)

									const txHash = (await Reflect.apply(
										originalMethod,
										this !== receiver ? this : writeTarget,
										args,
									)) as WriteContractReturnType
									logger.debug(`Method ${String(methodName)} completed successfully. Hash:`, txHash)

									// Whenever the tx is mined on the actual network, remove it from the pending block
									waitForTransactionReceipt({ hash: txHash })
										.then(() =>
											memoryClient.transport.tevm
												.getTxPool()
												.then((pool) => {
													if (optimisticTxHash) pool.removeByHash(optimisticTxHash.slice(2))
												})
												.catch((err) => {
													logger.error('Failed to remove tx from pool:', err)
												}),
										)
										.catch((err) => {
											logger.error('Failed to wait for tx receipt:', err)
										})

									return txHash
								} catch (error) {
									logger.error(`Method ${methodName.toString()} failed with error:`, error)
									throw error
								}
							}
						},
					})
				}

				return Reflect.get(target, prop, receiver)
			},
		})

		return wrappedContract
	}
