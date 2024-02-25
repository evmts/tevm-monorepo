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
import { testAccounts } from '@tevm/actions'
import { createJsonRpcFetcher } from '@tevm/jsonrpc'

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
						result: `0x${'69'.repeat(20)}`,
					}
				}
				if (!client.forkUrl) {
					throw new Error(
						'Fatal error! Client is in mode fork or proxy but no forkUrl is set! This indicates a bug in the client.',
					)
				}
				const fetcher = createJsonRpcFetcher(client.forkUrl)
				return fetcher.request(/** @type any*/ (request))
			}
			case 'eth_sendTransaction': {
				const sendTransactionRequest =
					/** @type {import('@tevm/procedures-types').EthSendTransactionJsonRpcRequest}*/ (
						request
					)
				const sendTransactionResult = await callProcedure(client)({
					jsonrpc: sendTransactionRequest.jsonrpc,
					method: 'tevm_call',
					...(sendTransactionRequest.id
						? { id: sendTransactionRequest.id }
						: {}),
					params: [
						{
							createTransaction: true,
							skipBalance: false,
							...(sendTransactionRequest.params[0].from
								? { from: sendTransactionRequest.params[0].from }
								: {}),
							...(sendTransactionRequest.params[0].to
								? { to: sendTransactionRequest.params[0].to }
								: {}),
							...(sendTransactionRequest.params[0].gas
								? { gas: sendTransactionRequest.params[0].gas }
								: {}),
							...(sendTransactionRequest.params[0].gasPrice
								? { gasPrice: sendTransactionRequest.params[0].gasPrice }
								: {}),
							...(sendTransactionRequest.params[0].value
								? { value: sendTransactionRequest.params[0].value }
								: {}),
							...(sendTransactionRequest.params[0].data
								? { data: sendTransactionRequest.params[0].data }
								: {}),
						},
					],
				})
				return {
					...sendTransactionResult,
					method: sendTransactionRequest.method,
					// make a random tx hash
					//TODO: make this deterministic
					result: `0x${Math.random().toString(16).slice(2)}`,
					warning:
						'this is a mock randomly generated tx hash, eth_sendTransaction should work as expected but it will not actually be producing a block until later version of tevm',
				}
			}
			case 'eth_estimateGas':
			case 'eth_getLogs':
			case 'eth_hashrate':
			case 'eth_newFilter':
			case 'eth_getFilterLogs':
			case 'eth_getBlockByHash':
			case 'eth_newBlockFilter':
			case 'eth_protocolVersion':
			case 'eth_uninstallFilter':
			case 'eth_getBlockByNumber':
			case 'eth_getFilterChanges':
			case 'eth_sendRawTransaction':
			case 'eth_getTransactionCount':
			case 'eth_getTransactionByHash':
			case 'eth_getTransactionReceipt':
			case 'eth_getUncleCountByBlockHash':
			case 'eth_getUncleCountByBlockNumber':
			case 'eth_getUncleByBlockHashAndIndex':
			case 'eth_newPendingTransactionFilter':
			case 'eth_getUncleByBlockNumberAndIndex':
			case 'eth_getBlockTransactionCountByHash':
			case 'eth_getBlockTransactionCountByNumber':
			case 'eth_getTransactionByBlockHashAndIndex':
			case 'eth_getTransactionByBlockNumberAndIndex':
			case 'debug_traceCall':
			case 'debug_traceTransaction':
			case 'anvil_mine':
			case 'anvil_reset':
			case 'anvil_dumpState':
			case 'anvil_loadState':
			case 'anvil_getAutomine':
			case 'anvil_setStorageAt':
			case 'anvil_dropTransaction':
			case 'anvil_impersonateAccount':
			case 'anvil_stopImpersonatingAccount':
				throw new Error(`Method ${request.method} is not implemented yet`)
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
						code: err._tag,
						message: err.message,
					},
				})
			}
		}
	}
}
