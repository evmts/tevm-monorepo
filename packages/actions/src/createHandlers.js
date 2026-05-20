import { createAddress } from '@tevm/address'
import { MethodNotSupportedError } from '@tevm/errors'
import { keccak256, numberToHex } from '@tevm/utils'
import { anvilAddBalanceJsonRpcProcedure } from './anvil/anvilAddBalanceProcedure.js'
import { anvilAutoImpersonateAccountJsonRpcProcedure } from './anvil/anvilAutoImpersonateAccountProcedure.js'
import { anvilDealErc20JsonRpcProcedure } from './anvil/anvilDealErc20Procedure.js'
import { anvilDealJsonRpcProcedure } from './anvil/anvilDealProcedure.js'
import { anvilDropAllTransactionsJsonRpcProcedure } from './anvil/anvilDropAllTransactionsProcedure.js'
import { anvilDropTransactionJsonRpcProcedure } from './anvil/anvilDropTransactionProcedure.js'
import { anvilDumpStateJsonRpcProcedure } from './anvil/anvilDumpStateProcedure.js'
import { anvilEnableTracesJsonRpcProcedure } from './anvil/anvilEnableTracesProcedure.js'
import { anvilGetAutomineJsonRpcProcedure } from './anvil/anvilGetAutomineProcedure.js'
import { anvilGetIntervalMiningJsonRpcProcedure } from './anvil/anvilGetIntervalMiningProcedure.js'
import { anvilImpersonateAccountJsonRpcProcedure } from './anvil/anvilImpersonateAccountProcedure.js'
import { anvilIncreaseTimeJsonRpcProcedure } from './anvil/anvilIncreaseTimeProcedure.js'
import { anvilLoadStateJsonRpcProcedure } from './anvil/anvilLoadStateProcedure.js'
import { anvilMetadataJsonRpcProcedure } from './anvil/anvilMetadataProcedure.js'
import { anvilMineDetailedJsonRpcProcedure } from './anvil/anvilMineDetailedProcedure.js'
import { anvilNodeInfoJsonRpcProcedure } from './anvil/anvilNodeInfoProcedure.js'
import { anvilRemoveBlockTimestampIntervalJsonRpcProcedure } from './anvil/anvilRemoveBlockTimestampIntervalProcedure.js'
import { anvilRemovePoolTransactionsJsonRpcProcedure } from './anvil/anvilRemovePoolTransactionsProcedure.js'
import { anvilResetJsonRpcProcedure } from './anvil/anvilResetProcedure.js'
import { anvilRevertJsonRpcProcedure } from './anvil/anvilRevertProcedure.js'
import { anvilSetAutomineJsonRpcProcedure } from './anvil/anvilSetAutomineProcedure.js'
import { anvilSetBalanceJsonRpcProcedure } from './anvil/anvilSetBalanceProcedure.js'
import { anvilSetBlockGasLimitJsonRpcProcedure } from './anvil/anvilSetBlockGasLimitProcedure.js'
import { anvilSetBlockTimestampIntervalJsonRpcProcedure } from './anvil/anvilSetBlockTimestampIntervalProcedure.js'
import { anvilSetChainIdJsonRpcProcedure } from './anvil/anvilSetChainIdProcedure.js'
import { anvilSetCodeJsonRpcProcedure } from './anvil/anvilSetCodeProcedure.js'
import { anvilSetCoinbaseJsonRpcProcedure } from './anvil/anvilSetCoinbaseProcedure.js'
import { anvilSetErc20AllowanceJsonRpcProcedure } from './anvil/anvilSetErc20AllowanceProcedure.js'
import { anvilSetIntervalMiningJsonRpcProcedure } from './anvil/anvilSetIntervalMiningProcedure.js'
import { anvilSetLoggingEnabledJsonRpcProcedure } from './anvil/anvilSetLoggingEnabledProcedure.js'
import { anvilSetMinGasPriceJsonRpcProcedure } from './anvil/anvilSetMinGasPriceProcedure.js'
import { anvilSetNextBlockBaseFeePerGasJsonRpcProcedure } from './anvil/anvilSetNextBlockBaseFeePerGasProcedure.js'
import { anvilSetNextBlockTimestampJsonRpcProcedure } from './anvil/anvilSetNextBlockTimestampProcedure.js'
import { anvilSetNonceJsonRpcProcedure } from './anvil/anvilSetNonceProcedure.js'
import { anvilSetPrevRandaoJsonRpcProcedure } from './anvil/anvilSetPrevRandaoProcedure.js'
import { anvilSetRpcUrlJsonRpcProcedure } from './anvil/anvilSetRpcUrlProcedure.js'
import { anvilSetStorageAtJsonRpcProcedure } from './anvil/anvilSetStorageAtProcedure.js'
import { anvilSetTimeJsonRpcProcedure } from './anvil/anvilSetTimeProcedure.js'
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
import {
	clearEngineState,
	engineExchangeCapabilitiesProcedure,
	engineExchangeTransitionConfigurationV1Procedure,
	engineForkchoiceUpdatedProcedure,
	engineGetBlobsProcedure,
	engineGetClientVersionV1Procedure,
	engineGetPayloadBodiesByHashProcedure,
	engineGetPayloadBodiesByRangeProcedure,
	engineGetPayloadProcedure,
	engineNewPayloadProcedure,
	testingBuildBlockV1Procedure,
} from './engine/engineProcedures.js'
import { blockNumberProcedure } from './eth/blockNumberProcedure.js'
import { chainIdProcedure } from './eth/chainIdProcedure.js'
import { ethAccountsProcedure } from './eth/ethAccountsProcedure.js'
import { ethBlobBaseFeeJsonRpcProcedure } from './eth/ethBlobBaseFeeProcedure.js'
import { ethCallProcedure } from './eth/ethCallProcedure.js'
import { ethCoinbaseJsonRpcProcedure } from './eth/ethCoinbaseProcedure.js'
import {
	debugGetBadBlocksJsonRpcProcedure,
	ethGetBlockAccessListJsonRpcProcedure,
	ethGetStorageValuesJsonRpcProcedure,
	ethGetUncleByBlockHashAndIndexJsonRpcProcedure,
	ethGetUncleByBlockNumberAndIndexJsonRpcProcedure,
	ethGetUncleCountByBlockHashJsonRpcProcedure,
	ethGetUncleCountByBlockNumberJsonRpcProcedure,
	ethGetWorkJsonRpcProcedure,
	ethHashrateJsonRpcProcedure,
	ethSubmitHashrateJsonRpcProcedure,
	ethSubmitWorkJsonRpcProcedure,
} from './eth/ethCompatibilityNoopsProcedure.js'
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
import { ethSignProcedure } from './eth/ethSignProcedure.js'
import { ethSignTransactionProcedure } from './eth/ethSignTransactionProcedure.js'
import { ethSimulateV1Procedure } from './eth/ethSimulateV1Procedure.js'
import { ethSimulateV2Procedure } from './eth/ethSimulateV2Procedure.js'
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
import { captureSnapshotMetadata, restoreSnapshotState } from './internal/snapshotMetadata.js'
import { loadStateProcedure } from './LoadState/loadStateProcedure.js'
import { mineProcedure } from './Mine/mineProcedure.js'
import { setAccountProcedure } from './SetAccount/setAccountProcedure.js'
import { tevmLightSyncStatusProcedure } from './tevm/tevmLightSyncStatusProcedure.js'
import { txToJsonRpcTx } from './utils/txToJsonRpcTx.js'

/**
 * @typedef {ReturnType<typeof createHandlers>} RequestHandlers
 * @typedef {Record<string, Record<string, any>>} TxpoolBucket
 */

/**
 * @internal
 * Creates a mapping of methods to jsonrpc request handlers
 * @param {import('@tevm/node').TevmNode} client
 * @returns Request handlers
 * @example
 */
export const createHandlers = (client) => {
	const engineEnabled = /** @type {any} */ (client).config?.engineApi !== false
	/** @type {ReturnType<typeof setInterval> | undefined} */
	let intervalMiningTimer
	const stopIntervalMiningTimer = () => {
		if (intervalMiningTimer !== undefined) {
			clearInterval(intervalMiningTimer)
			intervalMiningTimer = undefined
		}
	}
	/**
	 * @param {number} blockTime
	 */
	const startIntervalMiningTimer = (blockTime) => {
		stopIntervalMiningTimer()
		if (blockTime <= 0) return
		intervalMiningTimer = setInterval(async () => {
			if (client.miningConfig.type !== 'interval' || client.miningConfig.blockTime <= 0) return
			await mineProcedure(client)(/** @type {any} */ ({ jsonrpc: '2.0', method: 'anvil_mine', params: ['0x1', '0x0'] }))
		}, blockTime * 1000)
	}
	if (client.miningConfig.type === 'interval' && client.miningConfig.blockTime > 0) {
		startIntervalMiningTimer(client.miningConfig.blockTime)
	}
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
		tevm_mine: mineProcedure(client),
		// Backward-compatible alias for callers using the historical typo.
		tevm_miner: mineProcedure(client),
		tevm_lightSyncStatus: tevmLightSyncStatusProcedure(client),
		zevm_lightSyncStatus: tevmLightSyncStatusProcedure(client),
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
		eth_sign: ethSignProcedure(testAccounts),
		eth_signTransaction: ethSignTransactionProcedure({
			accounts: testAccounts,
			getChainId: async () => Number((await client.getVm()).common.ethjsCommon.chainId()),
		}),
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
		eth_blobGasPrice: ethBlobBaseFeeJsonRpcProcedure(client),
		eth_getProof: ethGetProofProcedure(client),
		eth_simulateV1: ethSimulateV1Procedure(client),
		eth_simulateV2: ethSimulateV2Procedure(client),
		eth_getStorageValues: ethGetStorageValuesJsonRpcProcedure(client),
		eth_getBlockAccessList: ethGetBlockAccessListJsonRpcProcedure(client),
		eth_getUncleCountByBlockHash: ethGetUncleCountByBlockHashJsonRpcProcedure(client),
		eth_getUncleCountByBlockNumber: ethGetUncleCountByBlockNumberJsonRpcProcedure(client),
		eth_getUncleByBlockHashAndIndex: ethGetUncleByBlockHashAndIndexJsonRpcProcedure(client),
		eth_getUncleByBlockNumberAndIndex: ethGetUncleByBlockNumberAndIndexJsonRpcProcedure(client),
		eth_getWork: ethGetWorkJsonRpcProcedure(),
		eth_hashrate: ethHashrateJsonRpcProcedure(),
		eth_submitHashrate: ethSubmitHashrateJsonRpcProcedure(),
		eth_submitWork: ethSubmitWorkJsonRpcProcedure(),
		/**
		 * @param {any} request
		 */
		eth_sendUnsignedTransaction: (request) => ({
			method: request.method,
			error: { code: -32004, message: 'Unsupported method: eth_sendUnsignedTransaction is not implemented in Tevm.' },
			jsonrpc: '2.0',
			...(request.id !== undefined ? { id: request.id } : {}),
		}),
	}

	/**
	 * @param {string | undefined} [senderFilter]
	 * @returns {Promise<{ pending: TxpoolBucket, queued: TxpoolBucket }>}
	 */
	const classifyTxpool = async (senderFilter) => {
		const txPool = await client.getTxPool()
		const vm = await client.getVm()
		/** @type {TxpoolBucket} */
		const pending = {}
		/** @type {TxpoolBucket} */
		const queued = {}
		for (const [sender, txs] of txPool.pool) {
			if (senderFilter && sender.toLowerCase() !== senderFilter.toLowerCase()) continue
			const account = await vm.stateManager.getAccount(createAddress(sender))
			let nextNonce = account?.nonce ?? 0n
			for (const tx of txs) {
				const innerTx = /** @type {any} */ (tx.tx ?? tx)
				const txNonce = BigInt(innerTx.nonce ?? innerTx.txData?.nonce ?? 0n)
				const isPending = txNonce === nextNonce
				const bucket = isPending ? pending : queued
				if (!bucket[sender]) bucket[sender] = {}
				bucket[sender][numberToHex(txNonce)] = innerTx
				if (isPending) nextNonce++
			}
		}
		return { pending, queued }
	}

	/**
	 * @param {string | undefined} [senderFilter]
	 */
	const toContentResult = async (senderFilter) => {
		const { pending, queued } = await classifyTxpool(senderFilter)
		const vm = await client.getVm()
		const block = await vm.blockchain.getCanonicalHeadBlock()
		/**
		 * @param {TxpoolBucket} bucket
		 */
		const mapBucket = (bucket) =>
			Object.fromEntries(
				Object.entries(bucket).map(([sender, byNonce]) => [
					sender,
					Object.fromEntries(Object.entries(byNonce).map(([nonce, tx]) => [nonce, txToJsonRpcTx(tx, block)])),
				]),
			)
		return { pending: mapBucket(pending), queued: mapBucket(queued) }
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
			const currentTimestamp = client.getNextBlockTimestamp() ?? latestBlock.header.timestamp
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

	const rawAnvilHandlers = {
		anvil_addBalance: anvilAddBalanceJsonRpcProcedure(client),
		anvil_autoImpersonateAccount: anvilAutoImpersonateAccountJsonRpcProcedure(client),
		anvil_deal: anvilDealJsonRpcProcedure(client),
		anvil_dealErc20: anvilDealErc20JsonRpcProcedure(client),
		anvil_dropAllTransactions: anvilDropAllTransactionsJsonRpcProcedure(client),
		anvil_dropTransaction: anvilDropTransactionJsonRpcProcedure(client),
		anvil_dumpState: anvilDumpStateJsonRpcProcedure(client),
		anvil_enableTraces: anvilEnableTracesJsonRpcProcedure(client),
		anvil_getAutomine: anvilGetAutomineJsonRpcProcedure(client),
		anvil_getIntervalMining: anvilGetIntervalMiningJsonRpcProcedure(client),
		anvil_impersonateAccount: anvilImpersonateAccountJsonRpcProcedure(client),
		anvil_increaseTime: anvilIncreaseTimeJsonRpcProcedure(client),
		anvil_loadState: async (
			/** @type {any} */
			request,
		) => {
			clearEngineState(client)
			return anvilLoadStateJsonRpcProcedure(client)(request)
		},
		anvil_metadata: anvilMetadataJsonRpcProcedure(client),
		anvil_mine: mineProcedure(client),
		anvil_mineDetailed: anvilMineDetailedJsonRpcProcedure(client),
		anvil_nodeInfo: anvilNodeInfoJsonRpcProcedure(client),
		anvil_removeBlockTimestampInterval: anvilRemoveBlockTimestampIntervalJsonRpcProcedure(client),
		anvil_removePoolTransactions: anvilRemovePoolTransactionsJsonRpcProcedure(client),
		anvil_reset: async (
			/** @type {any} */
			request,
		) => {
			clearEngineState(client)
			return anvilResetJsonRpcProcedure(client)(request)
		},
		anvil_revert: anvilRevertJsonRpcProcedure(client),
		anvil_setAutomine: anvilSetAutomineJsonRpcProcedure(client),
		anvil_setBalance: anvilSetBalanceJsonRpcProcedure(client),
		anvil_setBlockGasLimit: anvilSetBlockGasLimitJsonRpcProcedure(client),
		anvil_setBlockTimestampInterval: anvilSetBlockTimestampIntervalJsonRpcProcedure(client),
		anvil_setChainId: anvilSetChainIdJsonRpcProcedure(client),
		anvil_setCode: anvilSetCodeJsonRpcProcedure(client),
		anvil_setCoinbase: anvilSetCoinbaseJsonRpcProcedure(client),
		anvil_setErc20Allowance: anvilSetErc20AllowanceJsonRpcProcedure(client),
		anvil_setIntervalMining: anvilSetIntervalMiningJsonRpcProcedure(client),
		anvil_setLoggingEnabled: anvilSetLoggingEnabledJsonRpcProcedure(client),
		anvil_setMinGasPrice: anvilSetMinGasPriceJsonRpcProcedure(client),
		anvil_setPrevRandao: anvilSetPrevRandaoJsonRpcProcedure(client),
		anvil_setNextBlockBaseFeePerGas: anvilSetNextBlockBaseFeePerGasJsonRpcProcedure(client),
		anvil_setNextBlockTimestamp: anvilSetNextBlockTimestampJsonRpcProcedure(client),
		anvil_setNonce: anvilSetNonceJsonRpcProcedure(client),
		anvil_setRpcUrl: anvilSetRpcUrlJsonRpcProcedure(client),
		anvil_setStorageAt: anvilSetStorageAtJsonRpcProcedure(client),
		anvil_setTime: anvilSetTimeJsonRpcProcedure(client),
		anvil_snapshot: anvilSnapshotJsonRpcProcedure(client),
		anvil_stopImpersonatingAccount: anvilStopImpersonatingAccountJsonRpcProcedure(client),
	}
	const anvilHandlers = {
		...rawAnvilHandlers,
		anvil_setAutomine: async (
			/** @type {any} */
			request,
		) => {
			const response = await rawAnvilHandlers.anvil_setAutomine(request)
			stopIntervalMiningTimer()
			return response
		},
		anvil_setIntervalMining: async (
			/** @type {any} */
			request,
		) => {
			const response = await rawAnvilHandlers.anvil_setIntervalMining(request)
			const config = client.miningConfig
			if (config.type === 'interval') startIntervalMiningTimer(config.blockTime)
			return response
		},
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
		debug_getBadBlocks: debugGetBadBlocksJsonRpcProcedure(),
	}

	const evmHandlers = {
		evm_mine: mineProcedure(client),
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
		evm_setIntervalMining: anvilSetIntervalMiningJsonRpcProcedure(client),
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
			const metadata = await captureSnapshotMetadata(client, vm)
			const snapshotId = client.addSnapshot(stateRoot, state, metadata)
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
				await restoreSnapshotState(client, snapshot, vm)
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
	const engineHandlers = engineEnabled
		? {
				engine_exchangeCapabilities: engineExchangeCapabilitiesProcedure(),
				engine_exchangeTransitionConfigurationV1: engineExchangeTransitionConfigurationV1Procedure(),
				engine_getClientVersionV1: engineGetClientVersionV1Procedure(),
				engine_forkchoiceUpdatedV1: engineForkchoiceUpdatedProcedure(client),
				engine_forkchoiceUpdatedV2: engineForkchoiceUpdatedProcedure(client),
				engine_forkchoiceUpdatedV3: engineForkchoiceUpdatedProcedure(client),
				engine_forkchoiceUpdatedV4: engineForkchoiceUpdatedProcedure(client),
				engine_newPayloadV1: engineNewPayloadProcedure(client),
				engine_newPayloadV2: engineNewPayloadProcedure(client),
				engine_newPayloadV3: engineNewPayloadProcedure(client),
				engine_newPayloadV4: engineNewPayloadProcedure(client),
				engine_newPayloadV5: engineNewPayloadProcedure(client),
				engine_getPayloadV1: engineGetPayloadProcedure(client),
				engine_getPayloadV2: engineGetPayloadProcedure(client),
				engine_getPayloadV3: engineGetPayloadProcedure(client),
				engine_getPayloadV4: engineGetPayloadProcedure(client),
				engine_getPayloadV5: engineGetPayloadProcedure(client),
				engine_getPayloadV6: engineGetPayloadProcedure(client),
				engine_getPayloadBodiesByHashV1: engineGetPayloadBodiesByHashProcedure(),
				engine_getPayloadBodiesByHashV2: engineGetPayloadBodiesByHashProcedure(),
				engine_getPayloadBodiesByRangeV1: engineGetPayloadBodiesByRangeProcedure(),
				engine_getPayloadBodiesByRangeV2: engineGetPayloadBodiesByRangeProcedure(),
				engine_getBlobsV1: engineGetBlobsProcedure(),
				engine_getBlobsV2: engineGetBlobsProcedure(),
				engine_getBlobsV3: engineGetBlobsProcedure(),
				testing_buildBlockV1: testingBuildBlockV1Procedure(client),
			}
		: {}

	const rpcNamespaces = {
		anvil: anvilHandlers,
		debug: debugHandlers,
		engine: engineHandlers,
		eth: ethHandlers,
		evm: evmHandlers,
		ganache: ganacheHandlers,
		hardhat: hardhatHandlers,
		tevm: { ...tevmHandlers, ...tevmAnvilHandlers },
		txpool: { txpool_content: true, txpool_contentFrom: true, txpool_inspect: true, txpool_status: true },
		web3: { web3_clientVersion: true, web3_sha3: true },
		net: { net_version: true, net_listening: true, net_peerCount: true },
		rpc: { rpc_modules: true },
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
		...engineHandlers,
		/** @param {any} request */
		txpool_content: async (request) => ({
			method: request.method,
			result: await toContentResult(),
			jsonrpc: '2.0',
			...(request.id ? { id: request.id } : {}),
		}),
		/** @param {any} request */
		txpool_contentFrom: async (request) => ({
			method: request.method,
			result: await toContentResult(request.params?.[0]),
			jsonrpc: '2.0',
			...(request.id ? { id: request.id } : {}),
		}),
		/** @param {any} request */
		txpool_inspect: async (request) => {
			const { pending, queued } = await classifyTxpool()
			/** @param {any} tx */
			const inspectTx = (tx) =>
				`${tx.to ? tx.to.toString() : 'contract creation'}: ${tx.value ? numberToHex(tx.value) : '0x0'} wei + ${
					tx.gasLimit ? numberToHex(tx.gasLimit) : '0x0'
				} gas × ${tx.maxFeePerGas ? numberToHex(tx.maxFeePerGas) : tx.gasPrice ? numberToHex(tx.gasPrice) : '0x0'} wei`
			/** @param {TxpoolBucket} bucket */
			const mapBucket = (bucket) =>
				Object.fromEntries(
					Object.entries(bucket).map(([sender, byNonce]) => [
						sender,
						Object.fromEntries(Object.entries(byNonce).map(([nonce, tx]) => [nonce, inspectTx(tx)])),
					]),
				)
			return {
				method: request.method,
				result: { pending: mapBucket(pending), queued: mapBucket(queued) },
				jsonrpc: '2.0',
				...(request.id ? { id: request.id } : {}),
			}
		},
		/** @param {any} request */
		txpool_status: async (request) => {
			const { pending, queued } = await classifyTxpool()
			/** @param {TxpoolBucket} bucket */
			const count = (bucket) => Object.values(bucket).reduce((sum, byNonce) => sum + Object.keys(byNonce).length, 0)
			return {
				method: request.method,
				result: { pending: numberToHex(count(pending)), queued: numberToHex(count(queued)) },
				jsonrpc: '2.0',
				...(request.id ? { id: request.id } : {}),
			}
		},
		/** @param {any} request */
		web3_clientVersion: (request) => ({
			method: request.method,
			result: 'tevm/1.0.0',
			jsonrpc: '2.0',
			...(request.id ? { id: request.id } : {}),
		}),
		/** @param {any} request */
		web3_sha3: (request) => {
			const value = request?.params?.[0]
			if (typeof value !== 'string' || !value.startsWith('0x')) {
				return {
					method: request.method,
					error: { code: -32602, message: 'Invalid params: web3_sha3 expects a single hex string parameter' },
					jsonrpc: '2.0',
					...(request.id ? { id: request.id } : {}),
				}
			}
			return {
				method: request.method,
				result: keccak256(/** @type {import('@tevm/utils').Hex} */ (value)),
				jsonrpc: '2.0',
				...(request.id ? { id: request.id } : {}),
			}
		},
		/** @param {any} request */
		net_version: async (request) => {
			const vm = await client.getVm()
			const chainId = vm.common.ethjsCommon.chainId()
			return {
				method: request.method,
				result: numberToHex(typeof chainId === 'bigint' ? chainId : BigInt(chainId)),
				jsonrpc: '2.0',
				...(request.id ? { id: request.id } : {}),
			}
		},
		/** @param {any} request */
		net_listening: (request) => ({
			method: request.method,
			result: client.status !== 'STOPPED',
			jsonrpc: '2.0',
			...(request.id ? { id: request.id } : {}),
		}),
		/** @param {any} request */
		net_peerCount: (request) => ({
			method: request.method,
			result: '0x0',
			jsonrpc: '2.0',
			...(request.id ? { id: request.id } : {}),
		}),
		/** @param {any} request */
		rpc_modules: (request) => ({
			method: request.method,
			result: Object.fromEntries(
				Object.entries(rpcNamespaces)
					.filter(([, handlers]) => Object.keys(handlers).length > 0)
					.map(([namespace]) => [namespace, '1.0']),
			),
			jsonrpc: '2.0',
			...(request.id ? { id: request.id } : {}),
		}),
		/** @param {any} request */
		miner_start: (request) => anvilSetAutomineJsonRpcProcedure(client)({ ...request, params: [true] }),
		/** @param {any} request */
		miner_stop: (request) => anvilSetAutomineJsonRpcProcedure(client)({ ...request, params: [false] }),
	}

	return allHandlers
}
