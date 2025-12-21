import { MethodNotSupportedError } from '@tevm/errors'
import { anvilAddBalanceJsonRpcProcedure } from './anvil/anvilAddBalanceProcedure.js'
import { anvilAutoImpersonateAccountJsonRpcProcedure } from './anvil/anvilAutoImpersonateAccountProcedure.js'
import { anvilDealErc20JsonRpcProcedure } from './anvil/anvilDealErc20Procedure.js'
import { anvilDealJsonRpcProcedure } from './anvil/anvilDealProcedure.js'
import { anvilDropAllTransactionsJsonRpcProcedure } from './anvil/anvilDropAllTransactionsProcedure.js'
import { anvilDropTransactionJsonRpcProcedure } from './anvil/anvilDropTransactionProcedure.js'
import { anvilDumpStateJsonRpcProcedure } from './anvil/anvilDumpStateProcedure.js'
import { anvilGetAutomineJsonRpcProcedure } from './anvil/anvilGetAutomineProcedure.js'
import { anvilGetIntervalMiningJsonRpcProcedure } from './anvil/anvilGetIntervalMiningProcedure.js'
import { anvilImpersonateAccountJsonRpcProcedure } from './anvil/anvilImpersonateAccountProcedure.js'
import { anvilLoadStateJsonRpcProcedure } from './anvil/anvilLoadStateProcedure.js'
import { anvilMetadataJsonRpcProcedure } from './anvil/anvilMetadataProcedure.js'
import { anvilNodeInfoJsonRpcProcedure } from './anvil/anvilNodeInfoProcedure.js'
import { anvilRemovePoolTransactionsJsonRpcProcedure } from './anvil/anvilRemovePoolTransactionsProcedure.js'
import { anvilResetJsonRpcProcedure } from './anvil/anvilResetProcedure.js'
import { anvilRevertJsonRpcProcedure } from './anvil/anvilRevertProcedure.js'
import { anvilSetAutomineJsonRpcProcedure } from './anvil/anvilSetAutomineProcedure.js'
import { anvilSetBalanceJsonRpcProcedure } from './anvil/anvilSetBalanceProcedure.js'
import { anvilSetBlockGasLimitJsonRpcProcedure } from './anvil/anvilSetBlockGasLimitProcedure.js'
import { anvilSetCodeJsonRpcProcedure } from './anvil/anvilSetCodeProcedure.js'
import { anvilSetCoinbaseJsonRpcProcedure } from './anvil/anvilSetCoinbaseProcedure.js'
import { anvilSetErc20AllowanceJsonRpcProcedure } from './anvil/anvilSetErc20AllowanceProcedure.js'
import { anvilSetIntervalMiningJsonRpcProcedure } from './anvil/anvilSetIntervalMiningProcedure.js'
import { anvilSetLoggingEnabledJsonRpcProcedure } from './anvil/anvilSetLoggingEnabledProcedure.js'
import { anvilSetMinGasPriceJsonRpcProcedure } from './anvil/anvilSetMinGasPriceProcedure.js'
import { anvilSetNextBlockBaseFeePerGasJsonRpcProcedure } from './anvil/anvilSetNextBlockBaseFeePerGasProcedure.js'
import { anvilSetNonceJsonRpcProcedure } from './anvil/anvilSetNonceProcedure.js'
import { anvilSetRpcUrlJsonRpcProcedure } from './anvil/anvilSetRpcUrlProcedure.js'
import { anvilSetStorageAtJsonRpcProcedure } from './anvil/anvilSetStorageAtProcedure.js'
import { anvilSnapshotJsonRpcProcedure } from './anvil/anvilSnapshotProcedure.js'
import { anvilStopImpersonatingAccountJsonRpcProcedure } from './anvil/anvilStopImpersonatingAccountProcedure.js'
import { callProcedure } from './Call/callProcedure.js'
import { dumpStateProcedure } from './DumpState/dumpStateProcedure.js'
import { debugDumpBlockJsonRpcProcedure } from './debug/debugDumpBlockProcedure.js'
import { debugGetModifiedAccountsByHashJsonRpcProcedure } from './debug/debugGetModifiedAccountsByHashProcedure.js'
import { debugGetModifiedAccountsByNumberJsonRpcProcedure } from './debug/debugGetModifiedAccountsByNumberProcedure.js'
import { debugGetRawBlockJsonRpcProcedure } from './debug/debugGetRawBlockProcedure.js'
import { debugGetRawHeaderJsonRpcProcedure } from './debug/debugGetRawHeaderProcedure.js'
import { debugGetRawReceiptsJsonRpcProcedure } from './debug/debugGetRawReceiptsProcedure.js'
import { debugGetRawTransactionJsonRpcProcedure } from './debug/debugGetRawTransactionProcedure.js'
import { debugIntermediateRootsJsonRpcProcedure } from './debug/debugIntermediateRootsProcedure.js'
import { debugPreimageJsonRpcProcedure } from './debug/debugPreimageProcedure.js'
import { debugStorageRangeAtJsonRpcProcedure } from './debug/debugStorageRangeAtProcedure.js'
import { debugTraceBlockByHashJsonRpcProcedure } from './debug/debugTraceBlockByHashProcedure.js'
import { debugTraceBlockByNumberJsonRpcProcedure } from './debug/debugTraceBlockByNumberProcedure.js'
import { debugTraceBlockJsonRpcProcedure } from './debug/debugTraceBlockProcedure.js'
import { debugTraceCallJsonRpcProcedure } from './debug/debugTraceCallProcedure.js'
import { debugTraceChainJsonRpcProcedure } from './debug/debugTraceChainProcedure.js'
import { debugTraceStateJsonRpcProcedure } from './debug/debugTraceStateProcedure.js'
import { debugTraceTransactionJsonRpcProcedure } from './debug/debugTraceTransactionProcedure.js'
import { blockNumberProcedure } from './eth/blockNumberProcedure.js'
import { chainIdHandler } from './eth/chainIdHandler.js'
import { chainIdProcedure } from './eth/chainIdProcedure.js'
import { ethAccountsProcedure } from './eth/ethAccountsProcedure.js'
import { ethBlobBaseFeeJsonRpcProcedure } from './eth/ethBlobBaseFeeProcedure.js'
import { ethCallProcedure } from './eth/ethCallProcedure.js'
import { ethCoinbaseJsonRpcProcedure } from './eth/ethCoinbaseProcedure.js'
import { ethCreateAccessListProcedure } from './eth/ethCreateAccessListProcedure.js'
import { ethEstimateGasJsonRpcProcedure } from './eth/ethEstimateGasProcedure.js'
import { ethFeeHistoryProcedure } from './eth/ethFeeHistoryProcedure.js'
import { ethGetBlockByHashJsonRpcProcedure } from './eth/ethGetBlockByHashProcedure.js'
import { ethGetBlockByNumberJsonRpcProcedure } from './eth/ethGetBlockByNumberProcedure.js'
import { ethGetBlockReceiptsJsonRpcProcedure } from './eth/ethGetBlockReceiptsProcedure.js'
import { ethGetBlockTransactionCountByHashJsonRpcProcedure } from './eth/ethGetBlockTransactionCountByHashProcedure.js'
import { ethGetBlockTransactionCountByNumberJsonRpcProcedure } from './eth/ethGetBlockTransactionCountByNumberProcedure.js'
import { ethGetFilterChangesProcedure } from './eth/ethGetFilterChangesProcedure.js'
import { ethGetFilterLogsProcedure } from './eth/ethGetFilterLogsProcedure.js'
import { ethGetLogsProcedure } from './eth/ethGetLogsProcedure.js'
import { ethGetProofProcedure } from './eth/ethGetProofProcedure.js'
import { ethGetTransactionByBlockHashAndIndexJsonRpcProcedure } from './eth/ethGetTransactionByBlockHashAndIndexProcedure.js'
import { ethGetTransactionByBlockNumberAndIndexJsonRpcProcedure } from './eth/ethGetTransactionByBlockNumberAndIndexProcedure.js'
import { ethGetTransactionByHashJsonRpcProcedure } from './eth/ethGetTransactionByHashProcedure.js'
import { ethGetTransactionCountProcedure } from './eth/ethGetTransactionCountProcedure.js'
import { ethGetTransactionReceiptJsonRpcProcedure } from './eth/ethGetTransactionReceiptProcedure.js'
import { ethNewBlockFilterProcedure } from './eth/ethNewBlockFilterProcedure.js'
import { ethNewFilterJsonRpcProcedure } from './eth/ethNewFilterProcedure.js'
import { ethNewPendingTransactionFilterProcedure } from './eth/ethNewPendingTransactionFilterProcedure.js'
import { ethProtocolVersionJsonRpcProcedure } from './eth/ethProtocolVersionProcedure.js'
import { ethSendRawTransactionJsonRpcProcedure } from './eth/ethSendRawTransactionProcedure.js'
import { ethSendTransactionJsonRpcProcedure } from './eth/ethSendTransactionProcedure.js'
import { ethSimulateV1Procedure } from './eth/ethSimulateV1Procedure.js'
import { ethSubscribeJsonRpcProcedure } from './eth/ethSubscribeProcedure.js'
import { ethUninstallFilterJsonRpcProcedure } from './eth/ethUninstallFilterProcedure.js'
import { ethUnsubscribeJsonRpcProcedure } from './eth/ethUnsubscribeProcedure.js'
import { gasPriceProcedure } from './eth/gasPriceProcedure.js'
import { getBalanceProcedure } from './eth/getBalanceProcedure.js'
import { getCodeProcedure } from './eth/getCodeProcedure.js'
import { getStorageAtProcedure } from './eth/getStorageAtProcedure.js'
import { maxPriorityFeePerGasProcedure } from './eth/maxPriorityFeePerGasProcedure.js'
import { testAccounts } from './eth/utils/testAccounts.js'
import { getAccountProcedure } from './GetAccount/getAccountProcedure.js'
import { loadStateProcedure } from './LoadState/loadStateProcedure.js'
import { mineProcedure } from './Mine/mineProcedure.js'
import { setAccountProcedure } from './SetAccount/setAccountProcedure.js'

/**
 * @typedef {ReturnType<typeof createHandlers>} RequestHandlers
 */

/**
 * @internal
 * Creates a mapping of methods to jsonrpc request handlers
 * @param {import('@tevm/node').TevmNode} client
 * @returns Request handlers
 * @example
 */
export const createHandlers = (client) => {
	const tevmHandlers = {
		tevm_call: callProcedure(client),
		/**
		 * @param {any} request
		 */
		tevm_contract: (request) => {
			const err = new MethodNotSupportedError(
				'UnsupportedMethodError: tevm_contract is not supported. Encode the contract arguments and use tevm_call instead.',
			)
			return /**@type any*/ ({
				id: /** @type any*/ (request).id,
				method: request.method,
				jsonrpc: '2.0',
				error: {
					code: err._tag,
					message: err.message,
				},
			})
		},
		tevm_getAccount: getAccountProcedure(client),
		tevm_setAccount: setAccountProcedure(client),
		tevm_dumpState: dumpStateProcedure(client),
		tevm_loadState: loadStateProcedure(client),
		tevm_miner: mineProcedure(client),
	}

	const ethHandlers = {
		eth_accounts: ethAccountsProcedure(testAccounts),
		eth_blockNumber: blockNumberProcedure(client),
		eth_chainId: chainIdProcedure(client),
		eth_call: ethCallProcedure(client),
		eth_createAccessList: ethCreateAccessListProcedure(client),
		eth_getCode: getCodeProcedure(client),
		eth_getStorageAt: getStorageAtProcedure(client),
		eth_gasPrice: gasPriceProcedure(client),
		eth_maxPriorityFeePerGas: maxPriorityFeePerGasProcedure(client),
		eth_feeHistory: ethFeeHistoryProcedure(client),
		eth_getBalance: getBalanceProcedure(client),
		eth_coinbase: ethCoinbaseJsonRpcProcedure(client),
		eth_mining:
			/**
			 * @param {any} request}
			 */
			(request) => {
				return {
					result: client.status === 'MINING',
					method: request.method,
					jsonrpc: '2.0',
					...(request.id ? { id: request.id } : {}),
				}
			},
		eth_syncing:
			/**
			 * @param {any} request}
			 */
			(request) => {
				return {
					result: client.status === 'SYNCING',
					method: request.method,
					jsonrpc: '2.0',
					...(request.id ? { id: request.id } : {}),
				}
			},
		eth_sendTransaction: ethSendTransactionJsonRpcProcedure(client),
		eth_sendRawTransaction: ethSendRawTransactionJsonRpcProcedure(client),
		eth_estimateGas: ethEstimateGasJsonRpcProcedure(client),
		eth_getTransactionReceipt: ethGetTransactionReceiptJsonRpcProcedure(client),
		eth_getBlockReceipts: ethGetBlockReceiptsJsonRpcProcedure(client),
		eth_getLogs: ethGetLogsProcedure(client),
		eth_getBlockByHash: ethGetBlockByHashJsonRpcProcedure(client),
		eth_getBlockByNumber: ethGetBlockByNumberJsonRpcProcedure(client),
		eth_getBlockTransactionCountByHash: ethGetBlockTransactionCountByHashJsonRpcProcedure(client),
		eth_getBlockTransactionCountByNumber: ethGetBlockTransactionCountByNumberJsonRpcProcedure(client),
		eth_getTransactionByHash: ethGetTransactionByHashJsonRpcProcedure(client),
		eth_getTransactionByBlockHashAndIndex: ethGetTransactionByBlockHashAndIndexJsonRpcProcedure(client),
		eth_getTransactionByBlockNumberAndIndex: ethGetTransactionByBlockNumberAndIndexJsonRpcProcedure(client),
		eth_protocolVersion: ethProtocolVersionJsonRpcProcedure(),
		eth_getTransactionCount: ethGetTransactionCountProcedure(client),
		eth_newFilter: ethNewFilterJsonRpcProcedure(client),
		eth_getFilterLogs: ethGetFilterLogsProcedure(client),
		eth_newBlockFilter: ethNewBlockFilterProcedure(client),
		eth_uninstallFilter: ethUninstallFilterJsonRpcProcedure(client),
		eth_subscribe: ethSubscribeJsonRpcProcedure(client),
		eth_unsubscribe: ethUnsubscribeJsonRpcProcedure(client),
		eth_getFilterChanges: ethGetFilterChangesProcedure(client),
		eth_newPendingTransactionFilter: ethNewPendingTransactionFilterProcedure(client),
		eth_blobBaseFee: ethBlobBaseFeeJsonRpcProcedure(client),
		eth_getProof: ethGetProofProcedure(client),
		eth_simulateV1: ethSimulateV1Procedure(client),
	}

	/**
	 * Creates the anvil_increaseTime handler
	 * This is a factory function to share the implementation with evm_increaseTime
	 * @param {string} methodName
	 */
	const createIncreaseTimeHandler =
		(methodName) =>
		/**
		 * Jump forward in time by the given amount of time, in seconds.
		 * @param {any} request
		 * @returns {Promise<{method: string, result: string, jsonrpc: '2.0', id?: any}>}
		 */
		async (request) => {
			const seconds = BigInt(request.params[0])
			const vm = await client.getVm()
			const latestBlock = await vm.blockchain.getCanonicalHeadBlock()
			const currentTimestamp = latestBlock.header.timestamp
			const newTimestamp = currentTimestamp + seconds
			client.setNextBlockTimestamp(newTimestamp)
			return {
				method: methodName,
				// Return the number of seconds increased (as hex, matching ganache behavior)
				result: `0x${seconds.toString(16)}`,
				jsonrpc: '2.0',
				...(request.id ? { id: request.id } : {}),
			}
		}

	const anvilHandlers = {
		anvil_addBalance: anvilAddBalanceJsonRpcProcedure(client),
		anvil_autoImpersonateAccount: anvilAutoImpersonateAccountJsonRpcProcedure(client),
		anvil_deal: anvilDealJsonRpcProcedure(client),
		anvil_dealErc20: anvilDealErc20JsonRpcProcedure(client),
		anvil_dropAllTransactions: anvilDropAllTransactionsJsonRpcProcedure(client),
		anvil_dropTransaction: anvilDropTransactionJsonRpcProcedure(client),
		anvil_dumpState: anvilDumpStateJsonRpcProcedure(client),
		anvil_getAutomine: anvilGetAutomineJsonRpcProcedure(client),
		anvil_getIntervalMining: anvilGetIntervalMiningJsonRpcProcedure(client),
		anvil_impersonateAccount: anvilImpersonateAccountJsonRpcProcedure(client),
		anvil_increaseTime: createIncreaseTimeHandler('anvil_increaseTime'),
		anvil_loadState: anvilLoadStateJsonRpcProcedure(client),
		anvil_metadata: anvilMetadataJsonRpcProcedure(client),
		anvil_mine: mineProcedure(client),
		anvil_nodeInfo: anvilNodeInfoJsonRpcProcedure(client),
		anvil_removePoolTransactions: anvilRemovePoolTransactionsJsonRpcProcedure(client),
		anvil_reset: anvilResetJsonRpcProcedure(client),
		anvil_revert: anvilRevertJsonRpcProcedure(client),
		anvil_setAutomine: anvilSetAutomineJsonRpcProcedure(client),
		anvil_setBalance: anvilSetBalanceJsonRpcProcedure(client),
		anvil_setBlockGasLimit: anvilSetBlockGasLimitJsonRpcProcedure(client),
		anvil_setChainId: chainIdHandler(client),
		anvil_setCode: anvilSetCodeJsonRpcProcedure(client),
		anvil_setCoinbase: anvilSetCoinbaseJsonRpcProcedure(client),
		anvil_setErc20Allowance: anvilSetErc20AllowanceJsonRpcProcedure(client),
		anvil_setIntervalMining: anvilSetIntervalMiningJsonRpcProcedure(client),
		anvil_setLoggingEnabled: anvilSetLoggingEnabledJsonRpcProcedure(client),
		anvil_setMinGasPrice: anvilSetMinGasPriceJsonRpcProcedure(client),
		anvil_setNextBlockBaseFeePerGas: anvilSetNextBlockBaseFeePerGasJsonRpcProcedure(client),
		anvil_setNonce: anvilSetNonceJsonRpcProcedure(client),
		anvil_setRpcUrl: anvilSetRpcUrlJsonRpcProcedure(client),
		anvil_setStorageAt: anvilSetStorageAtJsonRpcProcedure(client),
		anvil_snapshot: anvilSnapshotJsonRpcProcedure(client),
		anvil_stopImpersonatingAccount: anvilStopImpersonatingAccountJsonRpcProcedure(client),
	}
	const tevmAnvilHandlers = Object.fromEntries(
		Object.entries(anvilHandlers).map(([key, value]) => {
			return [key.replace('anvil', 'tevm'), value]
		}),
	)
	const ganacheHandlers = Object.fromEntries(
		Object.entries(anvilHandlers).map(([key, value]) => {
			return [key.replace('anvil', 'ganache'), value]
		}),
	)
	const hardhatHandlers = Object.fromEntries(
		Object.entries(anvilHandlers).map(([key, value]) => {
			return [key.replace('anvil', 'hardhat'), value]
		}),
	)

	const debugHandlers = {
		debug_traceBlock: debugTraceBlockJsonRpcProcedure(client),
		debug_traceBlockByHash: debugTraceBlockByHashJsonRpcProcedure(client),
		debug_traceBlockByNumber: debugTraceBlockByNumberJsonRpcProcedure(client),
		debug_traceCall: debugTraceCallJsonRpcProcedure(client),
		debug_traceTransaction: debugTraceTransactionJsonRpcProcedure(client),
		debug_traceChain: debugTraceChainJsonRpcProcedure(client),
		debug_traceState: debugTraceStateJsonRpcProcedure(client),
		debug_dumpBlock: debugDumpBlockJsonRpcProcedure(client),
		debug_getModifiedAccountsByNumber: debugGetModifiedAccountsByNumberJsonRpcProcedure(client),
		debug_getModifiedAccountsByHash: debugGetModifiedAccountsByHashJsonRpcProcedure(client),
		debug_intermediateRoots: debugIntermediateRootsJsonRpcProcedure(client),
		debug_preimage: debugPreimageJsonRpcProcedure(client),
		debug_storageRangeAt: debugStorageRangeAtJsonRpcProcedure(client),
		debug_getRawBlock: debugGetRawBlockJsonRpcProcedure(client),
		debug_getRawHeader: debugGetRawHeaderJsonRpcProcedure(client),
		debug_getRawTransaction: debugGetRawTransactionJsonRpcProcedure(client),
		debug_getRawReceipts: debugGetRawReceiptsJsonRpcProcedure(client),
	}

	const evmHandlers = {
		/**
		 * @param {any} request
		 */
		evm_setNextBlockTimestamp: (request) => {
			const timestamp = BigInt(request.params[0])
			client.setNextBlockTimestamp(timestamp)
			return {
				method: request.method,
				result: null,
				jsonrpc: '2.0',
				...(request.id ? { id: request.id } : {}),
			}
		},
		evm_increaseTime: createIncreaseTimeHandler('evm_increaseTime'),
		/**
		 * Sets the block gas limit for the next block
		 * @param {any} request
		 */
		evm_setBlockGasLimit: (request) => {
			const gasLimit = BigInt(request.params[0])
			client.setNextBlockGasLimit(gasLimit)
			return {
				method: request.method,
				result: null,
				jsonrpc: '2.0',
				...(request.id ? { id: request.id } : {}),
			}
		},
		/**
		 * Creates a snapshot of the current state
		 * @param {any} request
		 * @returns {Promise<{method: string, result: string, jsonrpc: '2.0', id?: any}>}
		 */
		evm_snapshot: async (request) => {
			const vm = await client.getVm()
			const stateRoot = vm.stateManager._baseState.getCurrentStateRoot()
			const state = await vm.stateManager.dumpCanonicalGenesis()
			const snapshotId = client.addSnapshot(stateRoot, state)
			return {
				method: request.method,
				result: snapshotId,
				jsonrpc: '2.0',
				...(request.id ? { id: request.id } : {}),
			}
		},
		/**
		 * Reverts to a previous snapshot
		 * @param {any} request
		 * @returns {Promise<{method: string, result: boolean, jsonrpc: '2.0', id?: any}>}
		 */
		evm_revert: async (request) => {
			const snapshotId = request.params[0]
			const snapshot = client.getSnapshot(snapshotId)
			if (!snapshot) {
				return {
					method: request.method,
					result: false,
					jsonrpc: '2.0',
					...(request.id ? { id: request.id } : {}),
				}
			}
			try {
				const vm = await client.getVm()
				// Save the state root with its associated state
				vm.stateManager.saveStateRoot(
					/** @type {any} */ (Uint8Array.from(Buffer.from(snapshot.stateRoot.slice(2), 'hex'))),
					snapshot.state,
				)
				// Set the state root to revert to that state
				await vm.stateManager.setStateRoot(
					/** @type {any} */ (Uint8Array.from(Buffer.from(snapshot.stateRoot.slice(2), 'hex'))),
				)
				// Delete all snapshots from this ID onwards (they are now invalid)
				client.deleteSnapshotsFrom(snapshotId)
				return {
					method: request.method,
					result: true,
					jsonrpc: '2.0',
					...(request.id ? { id: request.id } : {}),
				}
			} catch (e) {
				client.logger.error(e, 'evm_revert failed')
				return {
					method: request.method,
					result: false,
					jsonrpc: '2.0',
					...(request.id ? { id: request.id } : {}),
				}
			}
		},
	}

	const allHandlers = {
		...tevmHandlers,
		...ethHandlers,
		...anvilHandlers,
		...tevmAnvilHandlers,
		...ganacheHandlers,
		...hardhatHandlers,
		...debugHandlers,
		...evmHandlers,
	}

	return allHandlers
}
