// This is adapted from ethereumjs and thus carries the same license:
import { TypeOutput, setLengthLeft, toBytes, toType } from '@tevm/utils'

/**
 * @param {import('@tevm/tx').JsonRpcTx} _txParams - The transaction parameters to normalize
 * @returns {import('@tevm/tx').TypedTxData}
 */
export function normalizeTxParams(_txParams) {
	// TODO the types here are in shambles because the return type and param type used to be `any`
	// We didn't want to change this too much since this is from ethereumjs and hardened code

	/**
	 * @type {any}
	 */
	const txParams = /** @type {any} */ (Object.assign({}, _txParams))

	txParams.gasLimit = toType(txParams.gasLimit ?? txParams.gas, TypeOutput.BigInt)
	txParams.data = txParams.data === undefined ? txParams.input : txParams.data

	// check and convert gasPrice and value params
	txParams.gasPrice = txParams.gasPrice !== undefined ? BigInt(txParams.gasPrice) : undefined
	txParams.value = txParams.value !== undefined ? BigInt(txParams.value) : undefined

	// strict byte length checking
	txParams.to = txParams.to !== null && txParams.to !== undefined ? setLengthLeft(toBytes(txParams.to), 20) : null

	txParams.v = toType(txParams.v, TypeOutput.BigInt)

	return txParams
}
