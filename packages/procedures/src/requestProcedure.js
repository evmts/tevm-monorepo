import { ethAccountsProcedure } from './eth/ethAccountsProcedure.js'
import { ethCallProcedure } from './eth/ethCallProcedure.js'
import { ethSignProcedure } from './eth/ethSignProcedure.js'
import { ethSignTransactionProcedure } from './eth/ethSignTransactionProcedure.js'
import {
	blockNumberProcedure,
	callProcedure,
	chainIdProcedure,
	dumpStateProcedure,
	gasPriceProcedure,
	getAccountProcedure,
	getBalanceProcedure,
	getCodeProcedure,
	getStorageAtProcedure,
	loadStateProcedure,
	scriptProcedure,
	setAccountProcedure,
} from './index.js'
import { BlockHeader } from '@ethereumjs/block'
import {
	ethSendTransactionHandler,
	testAccounts,
	traceCallHandler,
} from '@tevm/actions'
import { createJsonRpcFetcher } from '@tevm/jsonrpc'
import { bytesToHex, hexToBigInt, hexToBytes, numberToHex } from '@tevm/utils'


/**
 * @param {Uint8Array} a
 * @param {Uint8Array} b
 */
const uintEquals = (a, b) => {
	if (a.length !== b.length) {
		return false;
	}

	for (let i = 0; i < a.length; i++) {
		if (a[i] !== b[i]) {
			return false;
		}
	}

	return true;
}


// Keep this in sync with TevmProvider.ts

/**
 * Request handler for JSON-RPC requests.
 *
 * This implementation of the Tevm requestProcedure spec
 * implements it via the ethereumjs VM.
 *
 * Most users will want to use `Tevm.request` instead of
 * this method but this method may be desired if hyper optimizing
 * bundle size.
 *
 * @param {import('@tevm/base-client').BaseClient} client
 * @returns {import('@tevm/procedures-types').TevmJsonRpcRequestHandler}
 * @example
 * ```typescript
 * const blockNumberResponse = await tevm.request({
 *  method: 'eth_blockNumber',
 *  params: []
 *  id: 1
 *  jsonrpc: '2.0'
 * })
 * const accountResponse = await tevm.request({
 *  method: 'tevm_getAccount',
 *  params: [{address: '0x123...'}]
 *  id: 1
 *  jsonrpc: '2.0'
 * })
 * ```
 */
export const requestProcedure = (client) => {
	return async (request) => {
		switch (request.method) {
			case 'tevm_call':
				return /**@type any*/ (callProcedure(client)(request))
			case /** @type {any} */ ('tevm_contract'): {
				/**
				 * @type {import('@tevm/errors').UnsupportedMethodError}
				 */
				const err = {
					_tag: 'UnsupportedMethodError',
					name: 'UnsupportedMethodError',
					message:
						'UnsupportedMethodError: tevm_contract is not supported. Encode the contract arguments and use tevm_call instead.',
				}
				return /**@type any*/ ({
					id: /** @type any*/ (request).id,
					jsonrpc: '2.0',
					error: {
						code: err._tag,
						message: err.message,
					},
				})
			}
			case 'tevm_getAccount':
				return /**@type any*/ (getAccountProcedure)(client)(request)
			case 'tevm_setAccount':
				return /**@type any*/ (setAccountProcedure)(client)(request)
			case 'tevm_script':
				return /**@type any*/ (scriptProcedure)(client)(request)
			case 'eth_blockNumber':
				return /** @type any */ (blockNumberProcedure(client)(request))
			case 'tevm_dumpState':
				return /** @type any */ (dumpStateProcedure)(client)(request)
			case 'tevm_loadState': {
				return /** @type any */ (loadStateProcedure)(client)(request)
			}
			case 'eth_chainId':
				return /** @type any */ (chainIdProcedure(client.getChainId)(request))
			case 'eth_call':
				return /** @type any */ (ethCallProcedure(client)(request))
			case 'eth_getCode':
				return /** @type any */ (getCodeProcedure(client)(request))
			case 'eth_getStorageAt':
				return /** @type any */ (getStorageAtProcedure(client)(request))
			case 'eth_gasPrice':
				// TODO this vm.blockchain should not be type any
				return /** @type any */ (gasPriceProcedure(client)(request))
			case 'eth_getBalance':
				return /** @type any */ (getBalanceProcedure(client)(request))
			// TODO move all wallet methods to seperate decorator
			case 'eth_sign':
				return ethSignProcedure(testAccounts)(request)
			case 'eth_signTransaction':
				return ethSignTransactionProcedure({
					accounts: testAccounts,
					getChainId: client.getChainId,
				})(request)
			case 'eth_accounts':
				return ethAccountsProcedure(testAccounts)(request)
			case 'eth_mining':
				return Promise.resolve(false)
			case 'eth_syncing':
				return Promise.resolve(false)
			case 'anvil_setCode':
			case /** @type {'anvil_setCode'}*/ ('ganache_setCode'):
			case /** @type {'anvil_setCode'}*/ ('hardhat_setCode'): {
				/**
				 * @type {import('@tevm/procedures-types').AnvilSetCodeJsonRpcRequest}
				 */
				const codeRequest = request
				const result = setAccountProcedure(client)({
					jsonrpc: codeRequest.jsonrpc,
					method: 'tevm_setAccount',
					params: codeRequest.params,
					...(codeRequest.id ? { id: codeRequest.id } : {}),
				})
				return {
					...result,
					method: codeRequest.method,
				}
			}
			case 'anvil_setBalance':
			case /** @type {'anvil_setBalance'}*/ ('ganache_setBalance'):
			case /** @type {'anvil_setBalance'}*/ ('hardhat_setBalance'): {
				/**
				 * @type {import('@tevm/procedures-types').AnvilSetBalanceJsonRpcRequest}
				 */
				const balanceRequest = request
				const balanceResult = setAccountProcedure(client)({
					jsonrpc: balanceRequest.jsonrpc,
					method: 'tevm_setAccount',
					params: [
						{
							address: balanceRequest.params[0].address,
							balance: balanceRequest.params[0].balance,
						},
					],
					...(balanceRequest.id ? { id: balanceRequest.id } : {}),
				})
				return {
					...balanceResult,
					method: balanceRequest.method,
				}
			}
			case 'anvil_setNonce':
			case /** @type {'anvil_setNonce'}*/ ('ganache_setNonce'):
			case /** @type {'anvil_setNonce'}*/ ('hardhat_setNonce'): {
				/**
				 * @type {import('@tevm/procedures-types').AnvilSetNonceJsonRpcRequest}
				 **/
				const nonceRequest = request
				const nonceResult = setAccountProcedure(client)({
					jsonrpc: nonceRequest.jsonrpc,
					method: 'tevm_setAccount',
					params: [
						{
							address: nonceRequest.params[0].address,
							nonce: nonceRequest.params[0].nonce,
						},
					],
					...(nonceRequest.id ? { id: nonceRequest.id } : {}),
				})
				return {
					...nonceResult,
					method: nonceRequest.method,
				}
			}
			case 'anvil_setChainId':
			case /** @type {'anvil_setChainId'}*/ ('hardhat_setChainId'):
			case /** @type {'anvil_setChainId'}*/ ('ganache_setChainId'): {
				const chainId =
					/** @type {import('@tevm/procedures-types').AnvilSetChainIdJsonRpcRequest}*/ (
						request
					).params[0].chainId
				if (!Number.isInteger(chainId) || chainId <= 0) {
					return {
						...(request.id ? { id: request.id } : {}),
						method: request.method,
						jsonrpc: request.jsonrpc,
						error: {
							code: -32602,
							message: `Invalid id ${chainId}. Must be a positive integer.`,
						},
					}
				}
				client.setChainId(chainId)
				return {
					...(request.id ? { id: request.id } : {}),
					method: request.method,
					jsonrpc: request.jsonrpc,
					result: true,
				}
			}
			case 'eth_coinbase': {
				if (client.mode === 'normal') {
					return {
						...(request.id ? { id: request.id } : {}),
						method: request.method,
						jsonrpc: request.jsonrpc,
						// same default as hardhat
						result: await client
							.getVm()
							.then((vm) => vm.blockchain.getCanonicalHeadHeader())
							.then((header) => header.coinbase),
					}
				}
				if (!client.forkUrl) {
					throw new Error(
						'Fatal error! Client is in mode fork or proxy but no forkUrl is set! This indicates a bug in the client.',
					)
				}
				const fetcher = createJsonRpcFetcher(client.forkUrl)
				return fetcher.request(/** @type any*/(request))
			}
			// TODO move this to it's own procedure
			case 'eth_sendTransaction': {
				const sendTransactionRequest =
					/** @type {import('@tevm/procedures-types').EthSendTransactionJsonRpcRequest}*/ (
						request
					)
				const txHash = await ethSendTransactionHandler(client)({
					from: request.params[0].from,
					...(request.params[0].data ? { data: request.params[0].data } : {}),
					...(request.params[0].to ? { to: request.params[0].to } : {}),
					...(request.params[0].gas
						? { gas: hexToBigInt(request.params[0].gas) }
						: {}),
					...(request.params[0].gasPrice
						? { gasPrice: hexToBigInt(request.params[0].gasPrice) }
						: {}),
					...(request.params[0].value
						? { value: hexToBigInt(request.params[0].value) }
						: {}),
				})
				return {
					method: sendTransactionRequest.method,
					result: txHash,
					jsonrpc: '2.0',
					...(sendTransactionRequest.id
						? { id: sendTransactionRequest.id }
						: {}),
				}
			}
			// TODO move this to it's own procedure
			case 'eth_sendRawTransaction': {
				const sendTransactionRequest =
					/** @type {import('@tevm/procedures-types').EthSendRawTransactionJsonRpcRequest}*/ (
						request
					)
				const txHash = await ethSendTransactionHandler(client)({
					data: request.params[0],
				})
				return {
					method: sendTransactionRequest.method,
					result: txHash,
					jsonrpc: '2.0',
					...(sendTransactionRequest.id
						? { id: sendTransactionRequest.id }
						: {}),
				}
			}
			// TODO move this to it's own procedure
			case 'eth_estimateGas': {
				const estimateGasRequest =
					/** @type {import('@tevm/procedures-types').EthEstimateGasJsonRpcRequest}*/ (
						request
					)
				const callResult = await callProcedure(client)({
					...estimateGasRequest,
					params: [...estimateGasRequest.params],
					method: 'tevm_call',
				})
				return {
					method: estimateGasRequest.method,
					result: callResult.result?.gas,
					jsonrpc: '2.0',
					...(estimateGasRequest.id ? { id: estimateGasRequest.id } : {}),
				}
			}
			case 'anvil_getAutomine':
			case /** @type {'anvil_getAutomine'}*/ ('hardhat_getAutomine'):
			case /** @type {'anvil_getAutomine'}*/ ('ganache_getAutomine'):
				return client.miningConfig.type === 'auto'
			case 'anvil_setCoinbase':
			case /** @type {'anvil_setCoinbase'}*/ ('hardhat_setCoinbase'):
			case /** @type {'anvil_setCoinbase'}*/ ('ganache_setCoinbase'): {
				const vm = await client.getVm()
				const header = await vm.blockchain.getCanonicalHeadHeader()
				const newHeader = BlockHeader.fromHeaderData({
					...header.raw(),
					coinbase: request.params[0],
				})
				vm.blockchain.putHeader(newHeader)
				return {
					method: request.method,
					result: true,
					jsonrpc: '2.0',
					...(request.id ? { id: request.id } : {}),
				}
			}
			case 'debug_traceCall': {
				const debugTraceCallRequest =
					/** @type {import('@tevm/procedures-types').DebugTraceCallJsonRpcRequest}*/
					(request)
				const {
					blockTag,
					tracer,
					to,
					gas,
					data,
					from,
					value,
					timeout,
					gasPrice,
					tracerConfig,
				} = debugTraceCallRequest.params[0]
				const traceResult = await traceCallHandler(client)({
					tracer,
					...(to !== undefined ? { to } : {}),
					...(from !== undefined ? { from } : {}),
					...(gas !== undefined ? { gas: hexToBigInt(gas) } : {}),
					...(gasPrice !== undefined
						? { gasPrice: hexToBigInt(gasPrice) }
						: {}),
					...(value !== undefined ? { value: hexToBigInt(value) } : {}),
					...(data !== undefined ? { data } : {}),
					...(blockTag !== undefined ? { blockTag } : {}),
					...(timeout !== undefined ? { timeout } : {}),
					...(tracerConfig !== undefined ? { tracerConfig } : {}),
				})
				return {
					method: debugTraceCallRequest.method,
					result: {
						gas: numberToHex(traceResult.gas),
						failed: traceResult.failed,
						returnValue: traceResult.returnValue,
						structLogs: traceResult.structLogs.map((log) => {
							return {
								gas: numberToHex(log.gas),
								gasCost: numberToHex(log.gasCost),
								op: log.op,
								pc: log.pc,
								stack: log.stack,
								depth: log.depth,
							}
						}),
					},
					jsonrpc: '2.0',
					...(debugTraceCallRequest.id ? { id: debugTraceCallRequest.id } : {}),
				}
			}
			case 'eth_getTransactionReceipt':
				const getTransactionReceiptRequest =
					/** @type {import('@tevm/procedures-types').EthGetTransactionReceiptJsonRpcRequest}*/
					(request)
				const [
					txHash
				] = getTransactionReceiptRequest.params[0]

				if (!txHash) {
					return {
						jsonrpc: '2.0',
						...(request.id ? { id: request.id } : {}),
						method: request.method,
						error: {
							code: -32602,
							message: 'Invalid params',
						},
					}
				}

				const receiptsManager = await client.getReceiptsManager()
				const chain = await client.getChain()

				const result = await receiptsManager.getReceiptByTxHash(hexToBytes(/** @type {import('@tevm/utils').Hex}*/(txHash)))
				if (!result) return null
				const [receipt, blockHash, txIndex, logIndex] = result
				const block = await chain.getBlock(blockHash)
				// Check if block is in canonical chain
				const blockByNumber = await chain.getBlock(block.header.number)
				if (!uintEquals(blockByNumber.hash(), block.hash())) {
					return null
				}

				const parentBlock = await chain.getBlock(block.header.parentHash)
				const tx = block.transactions[txIndex]
				if (!tx) {
					// TODO check proxy url
					return {
						jsonrpc: '2.0',
						...(request.id ? { id: request.id } : {}),
						method: request.method,
						error: {
							// TODO wrong code
							code: -32602,
							message: 'No tx found',
						},
					}
				}
				// TODO handle legacy tx
				const effectiveGasPrice =
					 /** @type any*/(tx).maxPriorityFeePerGas <
						/** @type any*/(tx).maxFeePerGas - (block.header.baseFeePerGas ?? 0n)
						? /** @type any*/(tx).maxPriorityFeePerGas
						: /** @type any*/(tx).maxFeePerGas -
						(block.header.baseFeePerGas ?? 0n) +
						(block.header.baseFeePerGas ?? 0n)

				const vm = await client.getVm()
				const vmCopy = await vm.shallowCopy()
				vmCopy.common.setHardfork(tx.common.hardfork())
				// Run tx through copied vm to get tx gasUsed and createdAddress
				const runBlockResult = await vmCopy.runBlock({
					block,
					root: parentBlock.header.stateRoot,
					skipBlockValidation: true,
				})

				const res = runBlockResult.results[txIndex]
				if (!res) {
					throw new Error('No result for tx this indicates a bug in the client')
				}
				const { totalGasSpent, createdAddress } = res
				const { blobGasPrice, blobGasUsed } = /** @type {any}*/(runBlockResult.receipts[txIndex])
				return ({
					blockHash: bytesToHex(block.hash()),
					blockNumber: numberToHex(block.header.number),
					cumulativeGasUsed: numberToHex(receipt.cumulativeBlockGasUsed),
					effectiveGasPrice: numberToHex(effectiveGasPrice),
					from: tx.getSenderAddress().toString(),
					gasUsed: numberToHex(totalGasSpent),
					to: tx.to?.toString() ?? null,
					transactionHash: bytesToHex(tx.hash()),
					transactionIndex: numberToHex(txIndex),
					contractAddress: createdAddress?.toString() ?? null,
					logs: await Promise.all(
						receipt.logs.map((log, i) =>
						({
							address: bytesToHex(log[0]),
							blockHash: block ? bytesToHex(block.hash()) : null,
							blockNumber: block ? numberToHex(block.header.number) : null,
							data: bytesToHex(log[2]),
							logIndex: numberToHex(logIndex + i),
							removed: false,
							topics: log[1].map(bytes => bytesToHex(bytes)),
							transactionIndex: txIndex !== undefined ? numberToHex(txIndex) : null,
							transactionHash: tx !== undefined ? bytesToHex(tx.hash()) : null,
						})
						),
					),
					logsBloom: bytesToHex(receipt.bitvector),
					root:
						/** @type any*/(receipt).stateRoot instanceof Uint8Array
							? bytesToHex(/** @type any*/(receipt).stateRoot)
							: undefined,
					status:
						(/** @type any*/(receipt).status) instanceof Uint8Array
							? numberToHex(/** @type any*/(receipt).status)
							: undefined,
					blobGasUsed: blobGasUsed !== undefined ? numberToHex(blobGasUsed) : undefined,
					blobGasPrice: blobGasPrice !== undefined ? numberToHex(blobGasPrice) : undefined,
				})

			case 'eth_getLogs':
			case 'eth_newFilter':
			case 'eth_getFilterLogs':
			case 'eth_getBlockByHash':
			case 'eth_newBlockFilter':
			case 'eth_protocolVersion':
			case 'eth_uninstallFilter':
			case 'eth_getBlockByNumber':
			case 'eth_getFilterChanges':
			case 'eth_getTransactionCount':
			case 'eth_getTransactionByHash':
			case 'eth_getUncleCountByBlockHash':
			case 'eth_getUncleCountByBlockNumber':
			case 'eth_getUncleByBlockHashAndIndex':
			case 'eth_newPendingTransactionFilter':
			case 'eth_getUncleByBlockNumberAndIndex':
			case 'eth_getBlockTransactionCountByHash':
			case 'eth_getBlockTransactionCountByNumber':
			case 'eth_getTransactionByBlockHashAndIndex':
			case 'eth_getTransactionByBlockNumberAndIndex':
			case 'debug_traceTransaction':
			case 'anvil_mine':
			case 'anvil_reset':
			case 'anvil_dumpState':
			case 'anvil_loadState':
			case 'anvil_setStorageAt':
			case 'anvil_dropTransaction':
			case 'anvil_impersonateAccount':
			case 'anvil_stopImpersonatingAccount':
				throw new Error(
					`Method ${request.method} is not implemented yet. Currently tevm is always on auto-impersonate`,
				)
			default: {
				/**
				 * @type {import('@tevm/errors').UnsupportedMethodError}
				 */
				const err = {
					_tag: 'UnsupportedMethodError',
					name: 'UnsupportedMethodError',
					message: `UnsupportedMethodError: Unknown method ${
						/**@type any*/ (request).method
						}`,
				}
				return /** @type {any}*/ ({
					id: /** @type any*/ (request).id ?? null,
					method: /** @type any*/ (request).method,
					jsonrpc: '2.0',
					error: {
						code: -32601,
						message: err.message,
					},
				})
			}
		}
	}
}
