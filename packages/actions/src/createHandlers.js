import { MethodNotSupportedError } from '@tevm/errors'
import { ethAccountsProcedure } from './eth/ethAccountsProcedure.js'
import { testAccounts } from './eth/utils/testAccounts.js'
import { anvilDealJsonRpcProcedure } from './anvil/anvilDealProcedure.js'
import { anvilDropTransactionJsonRpcProcedure } from './anvil/anvilDropTransactionProcedure.js'
import { anvilDumpStateJsonRpcProcedure } from './anvil/anvilDumpStateProcedure.js'
import { anvilGetAutomineJsonRpcProcedure } from './anvil/anvilGetAutomineProcedure.js'
import { anvilImpersonateAccountJsonRpcProcedure } from './anvil/anvilImpersonateAccountProcedure.js'
import { anvilLoadStateJsonRpcProcedure } from './anvil/anvilLoadStateProcedure.js'
import { anvilResetJsonRpcProcedure } from './anvil/anvilResetProcedure.js'
import { anvilSetBalanceJsonRpcProcedure } from './anvil/anvilSetBalanceProcedure.js'
import { anvilSetCodeJsonRpcProcedure } from './anvil/anvilSetCodeProcedure.js'
import { anvilSetCoinbaseJsonRpcProcedure } from './anvil/anvilSetCoinbaseProcedure.js'
import { anvilSetNonceJsonRpcProcedure } from './anvil/anvilSetNonceProcedure.js'
import { anvilSetStorageAtJsonRpcProcedure } from './anvil/anvilSetStorageAtProcedure.js'
import { anvilStopImpersonatingAccountJsonRpcProcedure } from './anvil/anvilStopImpersonatingAccountProcedure.js'
import { callProcedure } from './Call/callProcedure.js'
import { dumpStateProcedure } from './DumpState/dumpStateProcedure.js'
import { debugTraceBlockJsonRpcProcedure } from './debug/debugTraceBlockProcedure.js'
import { debugTraceCallJsonRpcProcedure } from './debug/debugTraceCallProcedure.js'
import { debugTraceStateJsonRpcProcedure } from './debug/debugTraceStateProcedure.js'
import { debugTraceTransactionJsonRpcProcedure } from './debug/debugTraceTransactionProcedure.js'
import { blockNumberProcedure } from './eth/blockNumberProcedure.js'
import { chainIdHandler } from './eth/chainIdHandler.js'
import { chainIdProcedure } from './eth/chainIdProcedure.js'
import { ethBlobBaseFeeJsonRpcProcedure } from './eth/ethBlobBaseFeeProcedure.js'
import { ethCallProcedure } from './eth/ethCallProcedure.js'
import { ethCoinbaseJsonRpcProcedure } from './eth/ethCoinbaseProcedure.js'
import { ethCreateAccessListProcedure } from './eth/ethCreateAccessListProcedure.js'
import { ethEstimateGasJsonRpcProcedure } from './eth/ethEstimateGasProcedure.js'
import { ethGetBlockByHashJsonRpcProcedure } from './eth/ethGetBlockByHashProcedure.js'
import { ethGetBlockByNumberJsonRpcProcedure } from './eth/ethGetBlockByNumberProcedure.js'
import { ethGetBlockTransactionCountByHashJsonRpcProcedure } from './eth/ethGetBlockTransactionCountByHashProcedure.js'
import { ethGetBlockTransactionCountByNumberJsonRpcProcedure } from './eth/ethGetBlockTransactionCountByNumberProcedure.js'
import { ethGetFilterChangesProcedure } from './eth/ethGetFilterChangesProcedure.js'
import { ethGetFilterLogsProcedure } from './eth/ethGetFilterLogsProcedure.js'
import { ethGetLogsProcedure } from './eth/ethGetLogsProcedure.js'
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
import { ethUninstallFilterJsonRpcProcedure } from './eth/ethUninstallFilterProcedure.js'
import { gasPriceProcedure } from './eth/gasPriceProcedure.js'
import { getBalanceProcedure } from './eth/getBalanceProcedure.js'
import { getCodeProcedure } from './eth/getCodeProcedure.js'
import { getStorageAtProcedure } from './eth/getStorageAtProcedure.js'
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
		eth_getFilterChanges: ethGetFilterChangesProcedure(client),
		eth_newPendingTransactionFilter: ethNewPendingTransactionFilterProcedure(client),
		eth_blobBaseFee: ethBlobBaseFeeJsonRpcProcedure(client),
	}

	const anvilHandlers = {
		anvil_deal: anvilDealJsonRpcProcedure(client),
		anvil_setCode: anvilSetCodeJsonRpcProcedure(client),
		anvil_setBalance: anvilSetBalanceJsonRpcProcedure(client),
		anvil_setNonce: anvilSetNonceJsonRpcProcedure(client),
		anvil_setChainId: chainIdHandler(client),
		anvil_getAutomine: anvilGetAutomineJsonRpcProcedure(client),
		anvil_setCoinbase: anvilSetCoinbaseJsonRpcProcedure(client),
		anvil_mine: mineProcedure(client),
		anvil_reset: anvilResetJsonRpcProcedure(client),
		anvil_dropTransaction: anvilDropTransactionJsonRpcProcedure(client),
		anvil_dumpState: anvilDumpStateJsonRpcProcedure(client),
		anvil_loadState: anvilLoadStateJsonRpcProcedure(client),
		anvil_setStorageAt: anvilSetStorageAtJsonRpcProcedure(client),
		anvil_impersonateAccount: anvilImpersonateAccountJsonRpcProcedure(client),
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
		debug_traceBlockByHash: debugTraceBlockJsonRpcProcedure(client),
		debug_traceBlockByNumber: debugTraceBlockJsonRpcProcedure(client),
		debug_traceCall: debugTraceCallJsonRpcProcedure(client),
		debug_traceTransaction: debugTraceTransactionJsonRpcProcedure(client),
		debug_traceState: debugTraceStateJsonRpcProcedure(client),
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
