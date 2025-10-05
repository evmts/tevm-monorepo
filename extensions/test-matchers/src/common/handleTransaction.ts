import { createTevmNode, type TevmNode } from '@tevm/node'
import { type Client, type Hex, isHex } from 'viem'
import { waitForTransactionReceipt } from 'viem/actions'
import type { ContainsTransactionAny } from './types.js'

/**
 * Common result from handling a transaction
 */
export interface HandleTransactionResult {
	node: TevmNode
	txHash: Hex
}

/**
 * Handles a transaction to extract the node and transaction hash
 * @param client - The client or node to use for handling the transaction
 * @param tx - The transaction to handle
 * @returns Promise with node and transaction hash
 */
export const handleTransaction = async (
	client: Client | TevmNode,
	tx: ContainsTransactionAny | Promise<ContainsTransactionAny>,
): Promise<HandleTransactionResult> => {
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

	return { node, txHash }
}
