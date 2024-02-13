import { blockNumberHandler } from '@tevm/actions'
import { numberToHex } from 'viem'

/**
 * @param {import('@tevm/vm').TevmVm} vm
 * @returns {import('@tevm/procedures-types').EthBlockNumberJsonRpcProcedure}
 */
export const blockNumberProcedure = (vm) => async (req) => ({
	...(req.id ? { id: req.id } : {}),
	jsonrpc: '2.0',
	method: req.method,
	result: await blockNumberHandler(vm)({}).then(numberToHex),
})
