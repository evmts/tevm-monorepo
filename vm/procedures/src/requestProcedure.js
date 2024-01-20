import { UnknownMethodError } from './errors/UnknownMethodError.js'
import {
	accountProcedure,
	blockNumberProcedure,
	callProcedure,
	chainIdProcedure,
	dumpStateProcedure,
	gasPriceProcedure,
	getBalanceProcedure,
	getCodeProcedure,
	getStorageAtProcedure,
	loadStateProcedure,
	scriptProcedure,
} from './index.js'

/**
 * Handles a single tevm json rpc request
 * Infers return type from request
 * @param {import('@ethereumjs/vm').VM} vm
 * @returns {import('@tevm/api').TevmJsonRpcRequestHandler}
 * @example
 * ```typescript
 * const res = await requestProcedure(evm)({
 *  jsonrpc: '2.0',
 *  id: '1',
 *  method: 'tevm_call',
 *  params: {
 *    to: '0x000000000'
 *  }
 * })
 * ```
 */
export const requestProcedure = (vm) => {
	// TODO implement chainid
	const chainId = 10n
	/**
	 * @type {import('@tevm/api').Tevm['request']}
	 */
	return async (request) => {
		switch (request.method) {
			case 'tevm_call':
				return /**@type any*/ (callProcedure)(vm.evm)(request)
			case /** @type {any} */ ('tevm_contract'):
				return /**@type any*/ ({
					id: /** @type any*/ (request).id,
					jsonrpc: '2.0',
					error: {
						code: 'UnknownMethodError',
						message:
							'UnknownMethodError: tevm_contract is not supported. Encode the contract arguments and use tevm_call instead.',
					},
				})
			case 'tevm_account':
				return /**@type any*/ (accountProcedure)(vm.evm)(request)
			case 'tevm_script':
				return /**@type any*/ (scriptProcedure)(vm.evm)(request)
			case 'eth_blockNumber':
				return /** @type any */ (blockNumberProcedure(vm.blockchain)(request))
			case 'tevm_dumpState':
				return /** @type any */ (dumpStateProcedure)(vm.stateManager)(request)
			case 'tevm_loadState': {
				const stateManager = vm.stateManager
				return /** @type any */ (loadStateProcedure)(stateManager)(request)
			}
			case 'eth_chainId':
				return /** @type any */ (chainIdProcedure(chainId)(request))
			case 'eth_call':
				return /** @type any */ (callProcedure)(vm)(request.params[0])
			case 'eth_getCode':
				return /** @type any */ (
					getCodeProcedure({ stateManager: vm.evm.stateManager })(request)
				)
			case 'eth_getStorageAt':
				return /** @type any */ (
					getStorageAtProcedure({ stateManager: vm.evm.stateManager })(request)
				)
			case 'eth_gasPrice':
				// TODO this vm.blockchain should not be type any
				return /** @type any */ (
					gasPriceProcedure({ blockchain: /** @type any*/ (vm.blockchain) })(
						request,
					)
				)
			case 'eth_getBalance':
				return /** @type any */ (
					getBalanceProcedure({ stateManager: vm.evm.stateManager })(request)
				)
			case 'eth_sign':
			case 'eth_mining':
			case 'eth_getLogs':
			case 'eth_syncing':
			case 'eth_accounts':
			case 'eth_coinbase':
			case 'eth_hashrate':
			case 'eth_newFilter':
			case 'eth_estimateGas':
			case 'eth_getFilterLogs':
			case 'eth_getBlockByHash':
			case 'eth_newBlockFilter':
			case 'eth_protocolVersion':
			case 'eth_sendTransaction':
			case 'eth_signTransaction':
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
				const err = new UnknownMethodError(request)
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
