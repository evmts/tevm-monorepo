import { debugTraceTransactionJsonRpcProcedure, type PrestateTraceResult } from '@tevm/actions'
import { createTevmNode, type TevmNode } from '@tevm/node'
import { type Address, type Client, type Hex, isHex } from 'viem'
import { waitForTransactionReceipt } from 'viem/actions'
import type { ContainsTransactionAny } from '../../common/types.js'
import { getBalanceChange } from './getBalanceChange.js'
import { getTokenBalanceChange } from './getTokenBalanceChange.js'
import type { HandleTransactionResult } from './types.js'

/**
 * Handles a transaction to extract balance changes
 * @param tx - The transaction to handle
 * @param opts - Options including the client
 * @returns Promise with transaction and balance change getter
 */
export const handleTransaction = async (
	tx: ContainsTransactionAny | Promise<ContainsTransactionAny>,
	opts: { client: Client | TevmNode },
): Promise<HandleTransactionResult> => {
	const { client } = opts
	const res = tx instanceof Promise ? await tx : tx

	const node = 'request' in client ? createTevmNode({ fork: { transport: client } }) : client

	const txHash =
		// If it's a transaction receipt
		typeof res === 'object' && 'transactionHash' in res
			? res.transactionHash
			: // If it's a call result
				typeof res === 'object' && 'txHash' in res
				? res.txHash
				: // If it's already a transaction hash
					typeof res === 'string' && isHex(res)
					? res
					: undefined

	if (txHash === undefined) {
		throw new Error(
			'Transaction hash is undefined, you need to pass a transaction hash, receipt or call result, or a promise that resolves to one of those',
		)
	}

	// If a client was passed, we assume the tx will get mined consumer side, so we just need to wait for it
	if ('request' in client) {
		await waitForTransactionReceipt(client, { hash: txHash })
	}

	// Now we can replay the transaction with a prestate tracer to figure out the balance changes
	return await getDiffMethodsFromPrestateTrace(node, txHash)
}

const getDiffMethodsFromPrestateTrace = async (node: TevmNode, txHash: Hex) => {
	const res = await debugTraceTransactionJsonRpcProcedure(node)({
		jsonrpc: '2.0',
		method: 'debug_traceTransaction',
		params: [{ transactionHash: txHash, tracer: 'prestateTracer', tracerConfig: { diffMode: true } }],
		id: 1,
	})

	const prestateTrace = res.result as PrestateTraceResult<true>

	return {
		getBalanceChange: (address: Address) => getBalanceChange(prestateTrace, address.toLowerCase() as Address),
		getTokenBalanceChange: (tokenAddress: Address, address: Address) =>
			getTokenBalanceChange(
				node,
				tokenAddress.toLowerCase() as Address,
				address.toLowerCase() as Address,
				prestateTrace,
			),
	}
}
