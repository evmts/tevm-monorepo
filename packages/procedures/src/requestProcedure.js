import {
	chainIdHandler,
	ethSendTransactionHandler,
	forkAndCacheBlock,
	testAccounts,
	traceCallHandler,
} from '@tevm/actions'
import { Block, BlockHeader } from '@tevm/block'
import { createJsonRpcFetcher } from '@tevm/jsonrpc'
import { EthjsAccount, EthjsAddress, getAddress, hexToBigInt, hexToBytes, hexToNumber, numberToHex } from '@tevm/utils'
import { version as packageJsonVersion } from '../package.json'
import { ethAccountsProcedure } from './eth/ethAccountsProcedure.js'
import { ethCallProcedure } from './eth/ethCallProcedure.js'
import { ethGetTransactionReceiptJsonRpcProcedure } from './eth/ethGetTransactionReceiptProcedure.js'
import { ethSignProcedure } from './eth/ethSignProcedure.js'
import { ethSignTransactionProcedure } from './eth/ethSignTransactionProcedure.js'
import {
	blockNumberProcedure,
	callProcedure,
	chainIdProcedure,
	dumpStateProcedure,
	ethGetLogsProcedure,
	gasPriceProcedure,
	getAccountProcedure,
	getBalanceProcedure,
	getCodeProcedure,
	getStorageAtProcedure,
	loadStateProcedure,
	mineProcedure,
	scriptProcedure,
	setAccountProcedure,
} from './index.js'
import { blockToJsonRpcBlock } from './utils/blockToJsonRpcBlock.js'
import { txToJsonRpcTx } from './utils/txToJsonRpcTx.js'
import { createBaseClient } from '@tevm/base-client'
import { runTx } from '@tevm/vm'
import { TransactionFactory } from '@tevm/tx'

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
		await client.ready()
		client.logger.debug(request, 'JSON-RPC request received')
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
				return /** @type any */ (chainIdProcedure(client)(request))
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
					getChainId: () => chainIdHandler(client)().then((bigNumber) => Number(bigNumber)),
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
				const chainId = /** @type {import('@tevm/procedures-types').AnvilSetChainIdJsonRpcRequest}*/ (request).params[0]
					.chainId
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
				client.logger.warn('Warning: setChainId is currently a noop')
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
							.then((vm) => vm.blockchain.getCanonicalHeadBlock())
							.then((block) => block.header.coinbase),
					}
				}
				if (!client.forkTransport) {
					throw new Error(
						'Fatal error! Client is in mode fork or proxy but no forkUrl is set! This indicates a bug in the client.',
					)
				}
				const fetcher = createJsonRpcFetcher(client.forkTransport)
				return fetcher.request(/** @type any*/ (request))
			}
			// TODO move this to it's own procedure
			case 'eth_sendTransaction': {
				const sendTransactionRequest = /** @type {import('@tevm/procedures-types').EthSendTransactionJsonRpcRequest}*/ (
					request
				)
				const txHash = await ethSendTransactionHandler(client)({
					from: request.params[0].from,
					...(request.params[0].data ? { data: request.params[0].data } : {}),
					...(request.params[0].to ? { to: request.params[0].to } : {}),
					...(request.params[0].gas ? { gas: hexToBigInt(request.params[0].gas) } : {}),
					...(request.params[0].gasPrice ? { gasPrice: hexToBigInt(request.params[0].gasPrice) } : {}),
					...(request.params[0].value ? { value: hexToBigInt(request.params[0].value) } : {}),
				})
				return {
					method: sendTransactionRequest.method,
					result: txHash,
					jsonrpc: '2.0',
					...(sendTransactionRequest.id ? { id: sendTransactionRequest.id } : {}),
				}
			}
			// TODO move this to it's own procedure
			case 'eth_sendRawTransaction': {
				const sendTransactionRequest =
					/** @type {import('@tevm/procedures-types').EthSendRawTransactionJsonRpcRequest}*/ (request)
				const txHash = await ethSendTransactionHandler(client)({
					data: request.params[0],
				})
				return {
					method: sendTransactionRequest.method,
					result: txHash,
					jsonrpc: '2.0',
					...(sendTransactionRequest.id ? { id: sendTransactionRequest.id } : {}),
				}
			}
			// TODO move this to it's own procedure
			case 'eth_estimateGas': {
				const estimateGasRequest = /** @type {import('@tevm/procedures-types').EthEstimateGasJsonRpcRequest}*/ (request)
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
				const currentBlock = await vm.blockchain.getCanonicalHeadBlock()
				const newHeader = BlockHeader.fromHeaderData(
					{
						...currentBlock.header.raw(),
						coinbase: request.params[0],
					},
					{
						common: vm.common,
						freeze: false,
						setHardfork: false,
					},
				)
				// TODO this as any is not necessary we shouldn't be doing this instead fix types please
				const newBlock = Block.fromBlockData(
					/** @type {any}*/ ({
						...currentBlock,
						withdrawals: currentBlock.withdrawals,
						header: newHeader,
					}),
					{
						common: vm.common,
						freeze: false,
						setHardfork: false,
					},
				)
				vm.blockchain.putBlock(newBlock)
				return {
					method: request.method,
					result: true,
					jsonrpc: '2.0',
					...(request.id ? { id: request.id } : {}),
				}
			}
			case 'anvil_mine':
			case 'tevm_mine': {
				return /** @type any */ (mineProcedure)(client)(request)
			}
			case 'debug_traceCall': {
				const debugTraceCallRequest =
					/** @type {import('@tevm/procedures-types').DebugTraceCallJsonRpcRequest}*/
					(request)
				const { blockTag, tracer, to, gas, data, from, value, timeout, gasPrice, tracerConfig } =
					debugTraceCallRequest.params[0]
				const traceResult = await traceCallHandler(client)({
					tracer,
					...(to !== undefined ? { to } : {}),
					...(from !== undefined ? { from } : {}),
					...(gas !== undefined ? { gas: hexToBigInt(gas) } : {}),
					...(gasPrice !== undefined ? { gasPrice: hexToBigInt(gasPrice) } : {}),
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
			case 'eth_getTransactionReceipt': {
				const getTransactionReceiptRequest =
					/** @type {import('@tevm/procedures-types').EthGetTransactionReceiptJsonRpcRequest}*/
					(request)
				return ethGetTransactionReceiptJsonRpcProcedure(client)(getTransactionReceiptRequest)
			}
			case 'eth_getLogs': {
				const ethGetLogsRequest =
					/** @type {import('@tevm/procedures-types').EthGetLogsJsonRpcRequest}*/
					(request)
				return ethGetLogsProcedure(client)(ethGetLogsRequest)
			}
			case 'eth_getBlockByHash': {
				const getBlockByHashRequest =
					/** @type {import('@tevm/procedures-types').EthGetBlockByHashJsonRpcRequest}*/
					(request)
				const vm = await client.getVm()
				const block = await vm.blockchain.getBlock(hexToBytes(request.params[0]))
				const includeTransactions = getBlockByHashRequest.params[1] ?? false
				const result = blockToJsonRpcBlock(block, includeTransactions)
				return {
					method: getBlockByHashRequest.method,
					result,
					jsonrpc: '2.0',
					...(getBlockByHashRequest.id ? { id: getBlockByHashRequest.id } : {}),
				}
			}
			case 'eth_getBlockByNumber': {
				const getBlockByHashRequest =
					/** @type {import('@tevm/procedures-types').EthGetBlockByNumberJsonRpcRequest}*/
					(request)
				const vm = await client.getVm()
				const blockTagOrNumber = getBlockByHashRequest.params[0]
				const block = await (() => {
					if (blockTagOrNumber.startsWith('0x')) {
						return vm.blockchain.getBlock(hexToBigInt(/** @type {import('@tevm/utils').Hex}*/ (blockTagOrNumber)))
					}
					return vm.blockchain.blocksByTag.get(/** @type {import('@tevm/utils').BlockTag}*/ (blockTagOrNumber))
				})()

				if (!block && client.forkTransport) {
					const fetcher = createJsonRpcFetcher(client.forkTransport)
					return fetcher.request({
						jsonrpc: '2.0',
						id: request.id ?? 1,
						method: 'eth_getBlockByNumber',
						params: [blockTagOrNumber, getBlockByHashRequest.params[1] ?? false],
					})
				}
				if (!block) {
					return {
						...(request.id ? { id: request.id } : {}),
						method: request.method,
						jsonrpc: request.jsonrpc,
						error: {
							code: -32602,
							message: `Invalid block tag ${blockTagOrNumber}`,
						},
					}
				}
				const includeTransactions = getBlockByHashRequest.params[1] ?? false
				const result = blockToJsonRpcBlock(block, includeTransactions)
				return {
					method: getBlockByHashRequest.method,
					result,
					jsonrpc: '2.0',
					...(getBlockByHashRequest.id ? { id: getBlockByHashRequest.id } : {}),
				}
			}
			case 'eth_getBlockTransactionCountByHash': {
				const getBlockByHashRequest =
					/** @type {import('@tevm/procedures-types').EthGetBlockTransactionCountByHashJsonRpcRequest}*/
					(request)
				const vm = await client.getVm()
				const block = await vm.blockchain.getBlock(hexToBytes(request.params[0]))
				const result = block.transactions.length
				return {
					method: getBlockByHashRequest.method,
					result: numberToHex(result),
					jsonrpc: '2.0',
					...(getBlockByHashRequest.id ? { id: getBlockByHashRequest.id } : {}),
				}
			}
			case 'eth_getBlockTransactionCountByNumber': {
				const getBlockByHashRequest =
					/** @type {import('@tevm/procedures-types').EthGetBlockTransactionCountByNumberJsonRpcRequest}*/
					(request)
				const vm = await client.getVm()
				const blockTagOrNumber = getBlockByHashRequest.params[0]
				const block = await (() => {
					if (blockTagOrNumber.startsWith('0x')) {
						return vm.blockchain.getBlock(hexToBigInt(/** @type {import('@tevm/utils').Hex}*/ (blockTagOrNumber)))
					}
					return vm.blockchain.blocksByTag.get(/** @type {import('@tevm/utils').BlockTag}*/ (blockTagOrNumber))
				})()
				if (!block) {
					return {
						...(request.id ? { id: request.id } : {}),
						method: request.method,
						jsonrpc: request.jsonrpc,
						error: {
							code: -32602,
							message: `Invalid block tag ${blockTagOrNumber}`,
						},
					}
				}
				const result = block.transactions.length
				return {
					method: getBlockByHashRequest.method,
					result: numberToHex(result),
					jsonrpc: '2.0',
					...(getBlockByHashRequest.id ? { id: getBlockByHashRequest.id } : {}),
				}
			}
			case 'eth_getTransactionByHash': {
				const getTransactionByHashRequest =
					/** @type {import('@tevm/procedures-types').EthGetTransactionByHashJsonRpcRequest}*/
					(request)
				const vm = await client.getVm()
				const receiptsManager = await client.getReceiptsManager()
				const receipt = await receiptsManager.getReceiptByTxHash(hexToBytes(request.params[0]))
				if (!receipt && client.forkTransport) {
					const fetcher = createJsonRpcFetcher(client.forkTransport)
					return fetcher.request({
						jsonrpc: '2.0',
						id: request.id ?? 1,
						method: 'eth_getTransactionByHash',
						params: [request.params[0]],
					})
				}
				if (!receipt) {
					return {
						...(request.id ? { id: request.id } : {}),
						method: request.method,
						jsonrpc: request.jsonrpc,
						error: {
							code: -32602,
							message: 'Transaction not found',
						},
					}
				}
				const [_receipt, blockHash, txIndex] = receipt
				const block = await vm.blockchain.getBlock(blockHash)
				const tx = block.transactions[txIndex]
				if (!tx) {
					return {
						...(request.id ? { id: request.id } : {}),
						method: request.method,
						jsonrpc: request.jsonrpc,
						error: {
							code: -32602,
							message: 'Transaction not found',
						},
					}
				}
				return {
					method: getTransactionByHashRequest.method,
					result: txToJsonRpcTx(tx, block, txIndex),
					jsonrpc: '2.0',
					...(getTransactionByHashRequest.id ? { id: getTransactionByHashRequest.id } : {}),
				}
			}
			case 'eth_getTransactionByBlockHashAndIndex': {
				const getTransactionByBlockHashAndIndexRequest =
					/** @type {import('@tevm/procedures-types').EthGetTransactionByBlockHashAndIndexJsonRpcRequest}*/
					(request)
				const vm = await client.getVm()
				const block = await vm.blockchain.getBlock(hexToBytes(request.params[0]))
				const txIndex = hexToNumber(request.params[1])
				const tx = block.transactions[txIndex]
				if (!tx) {
					return {
						...(request.id ? { id: request.id } : {}),
						method: request.method,
						jsonrpc: request.jsonrpc,
						error: {
							code: -32602,
							message: 'Transaction not found',
						},
					}
				}
				return {
					method: getTransactionByBlockHashAndIndexRequest.method,
					result: txToJsonRpcTx(tx, block, txIndex),
					jsonrpc: '2.0',
					...(getTransactionByBlockHashAndIndexRequest.id ? { id: getTransactionByBlockHashAndIndexRequest.id } : {}),
				}
			}
			case 'eth_getTransactionByBlockNumberAndIndex': {
				const getTransactionByBlockNumberAndIndexRequest =
					/** @type {import('@tevm/procedures-types').EthGetTransactionByBlockNumberAndIndexJsonRpcRequest}*/
					(request)
				const vm = await client.getVm()
				const blockTagOrNumber = getTransactionByBlockNumberAndIndexRequest.params[0]
				const block = await (() => {
					if (blockTagOrNumber.startsWith('0x')) {
						return vm.blockchain.getBlock(hexToBigInt(/** @type {import('@tevm/utils').Hex}*/ (blockTagOrNumber)))
					}
					return vm.blockchain.blocksByTag.get(/** @type {import('@tevm/utils').BlockTag}*/ (blockTagOrNumber))
				})()
				if (!block) {
					return {
						...(request.id ? { id: request.id } : {}),
						method: request.method,
						jsonrpc: request.jsonrpc,
						error: {
							code: -32602,
							message: `Invalid block tag ${blockTagOrNumber}`,
						},
					}
				}
				const txIndex = hexToNumber(getTransactionByBlockNumberAndIndexRequest.params[1])
				const tx = block.transactions[txIndex]
				if (!tx) {
					return {
						...(request.id ? { id: request.id } : {}),
						method: request.method,
						jsonrpc: request.jsonrpc,
						error: {
							code: -32602,
							message: 'Transaction not found',
						},
					}
				}
				return {
					method: getTransactionByBlockNumberAndIndexRequest.method,
					result: txToJsonRpcTx(tx, block, txIndex),
					jsonrpc: '2.0',
					...(getTransactionByBlockNumberAndIndexRequest.id
						? { id: getTransactionByBlockNumberAndIndexRequest.id }
						: {}),
				}
			}
			// TODO add this to typescript type
			// TODO this doesn't work yet see https://github.com/ethereumjs/ethereumjs-monorepo/pull/3436/files
			// Getting some error with toBigInt internal to the block failing
			case /** @type any*/ ('eth_blobBaseFee'): {
				const vm = await client.getVm()
				const headBlock = await vm.blockchain.getCanonicalHeadBlock()
				return numberToHex(headBlock.header.calcNextBlobGasPrice())
			}
			case 'anvil_reset': {
				const vm = await client.getVm()
				vm.blockchain.blocksByTag.set(
					'latest',
					vm.blockchain.blocksByTag.get('forked') ?? vm.blockchain.blocksByTag.get('latest'),
				)
				Array.from(vm.blockchain.blocks.values()).forEach((block) => {
					if (!block) return
					vm.blockchain.delBlock(block.hash())
				})
				const stateManager = vm.stateManager.shallowCopy()
				vm.stateManager = /** @type any*/ (stateManager)
				vm.evm.stateManager = /** @type any*/ (stateManager)
				return {
					method: request.method,
					jsonrpc: '2.0',
					...(request.id ? { id: request.id } : {}),
				}
			}
			case 'anvil_setStorageAt':
			case /** @type any*/ ('ganache_setStorageAt'):
			case /** @type any*/ ('hardhat_setStorageAt'): {
				const anvilSetStorageAtRequest =
					/** @type {import('@tevm/procedures-types').AnvilSetStorageAtJsonRpcRequest}*/
					(request)
				anvilSetStorageAtRequest.params[0]
				const position = anvilSetStorageAtRequest.params[0].position
				const result = await setAccountProcedure(client)({
					method: 'tevm_setAccount',
					...(anvilSetStorageAtRequest.id ? { id: anvilSetStorageAtRequest.id } : {}),
					jsonrpc: '2.0',
					params: [
						{
							address: anvilSetStorageAtRequest.params[0].address,
							stateDiff: {
								[/** @type {import('@tevm/utils').Hex}*/ (position)]: /** @type {import('@tevm/utils').Hex}*/ (
									anvilSetStorageAtRequest.params[0].value
								),
							},
						},
					],
				})
				return {
					...result,
					method: anvilSetStorageAtRequest.method,
				}
			}
			case 'anvil_dropTransaction': {
				const anvilDropTransactionRequest =
					/** @type {import('@tevm/procedures-types').AnvilDropTransactionJsonRpcRequest}*/
					(request)
				const txHash = anvilDropTransactionRequest.params[0].transactionHash
				const txPool = await client.getTxPool()
				if (txPool.getByHash([hexToBytes(txHash)]).length > 0) {
					txPool.removeByHash(txHash)
				} else {
					throw new Error(
						'Only tx in the txpool are allowed to be dropped. Dropping transactions that have already been mined is not yet supported',
					)
				}
				return {
					method: anvilDropTransactionRequest.method,
					jsonrpc: '2.0',
					...(anvilDropTransactionRequest.id ? { id: anvilDropTransactionRequest.id } : {}),
				}
			}
			case 'anvil_dumpState':
				return {
					...(await dumpStateProcedure(client)({
						...(request.id ? { id: request.id } : {}),
						jsonrpc: '2.0',
						method: 'tevm_dumpState',
					})),
					method: request.method,
				}
			case 'eth_protocolVersion': {
				return {
					result: packageJsonVersion,
					jsonrpc: '2.0',
					method: 'eth_protocolVersion',
					...(request.id ? { id: request.id } : {}),
				}
			}
			case 'anvil_loadState': {
				const loadStateRequest = /** @type {import('@tevm/procedures-types').AnvilLoadStateJsonRpcRequest}*/ (request)

				const vm = await client.getVm()

				return Promise.all(
					Object.entries(loadStateRequest.params[0].state).map(([address, rlpEncodedAccount]) => {
						return vm.stateManager.putAccount(
							EthjsAddress.fromString(address),
							EthjsAccount.fromRlpSerializedAccount(hexToBytes(rlpEncodedAccount)),
						)
					}),
				)
					.then(() => {
						/**
						 * @type {import('@tevm/procedures-types').AnvilLoadStateJsonRpcResponse}
						 */
						return {
							jsonrpc: '2.0',
							method: loadStateRequest.method,
							...(loadStateRequest.id ? { id: loadStateRequest.id } : {}),
						}
					})
					.catch((e) => {
						return {
							jsonrpc: '2.0',
							method: loadStateRequest.method,
							...(loadStateRequest.id ? { id: loadStateRequest.id } : {}),
							error: {
								code: -32602,
								message: e.message,
							},
						}
					})
			}
			case 'debug_traceTransaction': {
				const debugTraceTransactionRequest =
					/** @type {import('@tevm/procedures-types').DebugTraceTransactionJsonRpcRequest}*/
					(request)
				const { tracer, timeout, throwOnFail, tracerConfig, transactionHash } = request.params[0]
				if (timeout !== undefined) {
					client.logger.warn('Warning: timeout is currently respected param of debug_traceTransaction')
				}
				const transactionByHashResponse = await requestProcedure(client)({
					method: 'eth_getTransactionByHash',
					params: [transactionHash],
					jsonrpc: '2.0',
					id: 1,
				})
				if ('error' in transactionByHashResponse) {
					return {
						...transactionByHashResponse,
						method: debugTraceTransactionRequest.method,
					}
				}
				const vm = await client.getVm()
				const block = await vm.blockchain.getBlock(hexToBytes(transactionByHashResponse.result.blockHash))
				const parentBlock = await vm.blockchain.getBlock(block.header.parentHash)
				transactionByHashResponse.result.transactionIndex
				const previousTx = block.transactions.filter(
					(_, i) => i < hexToNumber(transactionByHashResponse.result.transactionIndex),
				)
				const hasStateRoot = vm.stateManager.hasStateRoot(parentBlock.header.stateRoot)
				if (!hasStateRoot && client.forkTransport) {
					await forkAndCacheBlock(client, parentBlock)
				} else {
					return {
						jsonrpc: '2.0',
						method: debugTraceTransactionRequest.method,
						id: debugTraceTransactionRequest.id,
						error: {
							code: -32602,
							message: 'Parent block not found',
						},
					}
				}
				const vmClone = await vm.deepCopy()

				// execute all transactions before the current one committing to the state
				for (const tx of previousTx) {
					runTx(vmClone)({
						block: parentBlock,
						skipNonce: true,
						skipBalance: true,
						skipHardForkValidation: true,
						skipBlockGasLimitValidation: true,
						tx: await TransactionFactory.fromRPC(tx, {
							freeze: false,
							common: vmClone.common.ethjsCommon,
							allowUnlimitedInitCodeSize: true,
						}),
					})
				}

				// now execute an debug_traceCall
				const traceResult = await traceCallHandler(client)({
					tracer,
					...(transactionByHashResponse.result.to !== undefined ? { to: transactionByHashResponse.result.to } : {}),
					...(transactionByHashResponse.result.from !== undefined
						? { from: transactionByHashResponse.result.from }
						: {}),
					...(transactionByHashResponse.result.gas !== undefined
						? { gas: hexToBigInt(transactionByHashResponse.result.gas) }
						: {}),
					...(transactionByHashResponse.result.gasPrice !== undefined
						? { gasPrice: hexToBigInt(transactionByHashResponse.result.gasPrice) }
						: {}),
					...(transactionByHashResponse.result.value !== undefined
						? { value: hexToBigInt(transactionByHashResponse.result.value) }
						: {}),
					...(transactionByHashResponse.result.data !== undefined
						? { data: transactionByHashResponse.result.data }
						: {}),
					...(transactionByHashResponse.result.blockHash !== undefined
						? { blockTag: transactionByHashResponse.result.blockHash }
						: {}),
					...(timeout !== undefined ? { timeout } : {}),
					...(tracerConfig !== undefined ? { tracerConfig } : {}),
				})
				return {
					method: debugTraceTransactionRequest.method,
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
					...(debugTraceTransactionRequest.id ? { id: debugTraceTransactionRequest.id } : {}),
				}
			}
			case 'anvil_impersonateAccount': {
				const impersonateAccountRequest =
					/** @type {import('@tevm/procedures-types').AnvilImpersonateAccountJsonRpcRequest}*/
					(request)
				try {
					client.setImpersonatedAccount(getAddress(impersonateAccountRequest.params[0].address))
					return {
						jsonrpc: '2.0',
						method: impersonateAccountRequest.method,
						id: impersonateAccountRequest.id,
						result: true,
					}
				} catch (e) {
					return {
						jsonrpc: '2.0',
						method: impersonateAccountRequest.method,
						id: impersonateAccountRequest.id,
						error: {
							code: -32602,
							message: /** @type {Error}*/ (e).message,
						},
					}
				}
			}
			case 'anvil_stopImpersonatingAccount': {
				client.setImpersonatedAccount(undefined)
				return {
					jsonrpc: '2.0',
					method: request.method,
					id: request.id,
					result: true,
				}
			}
			case 'eth_getTransactionCount': {
				const getTransactionCountRequest =
					/** @type {import('@tevm/procedures-types').EthGetTransactionCountJsonRpcRequest}*/
					(request)
				const vm = await client.getVm()
				const [address, tag] = request.params
				if (tag === 'pending') {
					const txPool = await client.getTxPool()
					const count = (await txPool.getBySenderAddress(EthjsAddress.fromString(address))).length
					return {
						method: getTransactionCountRequest.method,
						result: numberToHex(count),
						jsonrpc: '2.0',
						...(getTransactionCountRequest.id ? { id: getTransactionCountRequest.id } : {}),
					}
				}
				const block = await (async () => {
					if (tag.startsWith('0x') && tag.length === 66) {
						return vm.blockchain.getBlock(hexToBytes(/** @type {import('@tevm/utils').Hex}*/ (tag)))
					}
					if (tag.startsWith('0x')) {
						return vm.blockchain.getBlock(hexToBigInt(/** @type {import('@tevm/utils').Hex}*/ (tag)))
					}
					if (tag === 'latest' || tag === 'safe' || tag === 'earliest' || tag === 'finalized') {
						return vm.blockchain.blocksByTag.get(tag)
					}
					return undefined
				})()
				if (!block) {
					return {
						...(request.id ? { id: request.id } : {}),
						method: request.method,
						error: {
							code: -32602,
							message: `Invalid block tag ${tag}`,
						},
					}
				}
				const count = block.transactions.filter((tx) =>
					tx.getSenderAddress().equals(EthjsAddress.fromString(address)),
				).length
				return {
					...(request.id ? { id: request.id } : {}),
					method: request.method,
					jsonrpc: request.jsonrpc,
					result: numberToHex(count),
				}
			}
			case 'eth_newFilter': {
				return {
					...(request.id ? { id: request.id } : {}),
					method: request.method,
					jsonrpc: request.jsonrpc,
					error: {
						code: -32601,
						message: 'Method not implemented yet',
					},
				}
			}
			case 'eth_getFilterLogs': {
				return {
					...(request.id ? { id: request.id } : {}),
					method: request.method,
					jsonrpc: request.jsonrpc,
					error: {
						code: -32601,
						message: 'Method not implemented yet',
					},
				}
			}
			case 'eth_newBlockFilter': {
				return {
					...(request.id ? { id: request.id } : {}),
					method: request.method,
					jsonrpc: request.jsonrpc,
					error: {
						code: -32601,
						message: 'Method not implemented yet',
					},
				}
			}
			case 'eth_uninstallFilter': {
				return {
					...(request.id ? { id: request.id } : {}),
					method: request.method,
					jsonrpc: request.jsonrpc,
					error: {
						code: -32601,
						message: 'Method not implemented yet',
					},
				}
			}
			case 'eth_getFilterChanges': {
				return {
					...(request.id ? { id: request.id } : {}),
					method: request.method,
					jsonrpc: request.jsonrpc,
					error: {
						code: -32601,
						message: 'Method not implemented yet',
					},
				}
			}
			case 'eth_newPendingTransactionFilter': {
				return {
					...(request.id ? { id: request.id } : {}),
					method: request.method,
					jsonrpc: request.jsonrpc,
					error: {
						code: -32601,
						message: 'Method not supported',
					},
				}
			}

			default: {
				/**
				 * @type {import('@tevm/errors').UnsupportedMethodError}
				 */
				const err = {
					_tag: 'UnsupportedMethodError',
					name: 'UnsupportedMethodError',
					message: `UnsupportedMethodError: Unknown method ${/**@type any*/ (request).method}`,
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
