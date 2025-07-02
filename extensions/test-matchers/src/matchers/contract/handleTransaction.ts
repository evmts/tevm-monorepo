import { getTransactionJsonRpcProcedure } from '@tevm/actions'
import { type TevmNode } from '@tevm/node'
import { type Client, type Hex, decodeFunctionData } from 'viem'
import { handleTransaction as commonHandleTransaction } from '../../common/handleTransaction.js'
import type { ContainsContractAbiAndAddress, ContainsTransactionAny } from '../../common/types.js'
import type { ToCallContractFunctionState } from './types.js'

/**
 * Contract-specific result from handling a transaction
 */
export interface ContractHandleTransactionResult {
	node: TevmNode
	txHash: Hex
	transactionTo?: Hex
	rawFunctionData?: Hex
	decodedFunctionData?: ReturnType<typeof decodeFunctionData>
}

/**
 * Handles a transaction to extract contract function call information
 * @param tx - The transaction to handle
 * @param opts - Options including the client and optional contract for decoding
 * @returns Promise with transaction and function call data
 */
export const handleTransaction = async (
	tx: ContainsTransactionAny | Promise<ContainsTransactionAny>,
	opts: { client: Client | TevmNode; contract?: ContainsContractAbiAndAddress },
): Promise<ContractHandleTransactionResult> => {
	const { client, contract } = opts
	const { node, txHash } = await commonHandleTransaction(tx, opts)

	// Get the full transaction details
	const transactionRes = await getTransactionJsonRpcProcedure(node)({
		jsonrpc: '2.0',
		method: 'eth_getTransactionByHash',
		params: [txHash],
		id: 1,
	})

	const transaction = transactionRes.result
	if (!transaction) {
		throw new Error(`Transaction ${txHash} not found`)
	}

	const transactionTo = transaction.to
	const rawFunctionData = transaction.input

	// Try to decode function data if we have a contract ABI
	let decodedFunctionData: ReturnType<typeof decodeFunctionData> | undefined
	if (contract && rawFunctionData && rawFunctionData !== '0x') {
		try {
			decodedFunctionData = decodeFunctionData({
				abi: contract.abi,
				data: rawFunctionData,
			})
		} catch (error) {
			// Failed to decode - maybe the function isn't in this ABI or it's not a function call
			// We'll handle this in the matcher logic
		}
	}

	return {
		node,
		txHash,
		transactionTo,
		rawFunctionData,
		decodedFunctionData,
	}
}