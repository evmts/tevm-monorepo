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
	// TODO implement chainid
	const chainId = 900
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
				return /** @type any */ (chainIdProcedure(chainId)(request))
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
			case 'eth_sign':
				return ethSignProcedure(testAccounts)(request)
			case 'eth_signTransaction':
				return ethSignTransactionProcedure({
					accounts: testAccounts,
					chainId: BigInt(chainId),
				})(request)
			case 'eth_accounts':
				return ethAccountsProcedure(testAccounts)(request)
			case 'eth_mining':
			case 'eth_getLogs':
			case 'eth_syncing':
			case 'eth_coinbase':
			case 'eth_hashrate':
			case 'eth_newFilter':
			case 'eth_estimateGas':
			case 'eth_getFilterLogs':
			case 'eth_getBlockByHash':
			case 'eth_newBlockFilter':
			case 'eth_protocolVersion':
			case 'eth_sendTransaction':
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
			case 'anvil_setCode':
			case 'anvil_setNonce':
			case 'anvil_dumpState':
			case 'anvil_loadState':
			case 'anvil_setBalance':
			case 'anvil_setChainId':
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
