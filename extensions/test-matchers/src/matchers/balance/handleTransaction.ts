import { ethGetTransactionReceiptHandler, getBalanceHandler } from '@tevm/actions'
import { type TevmNode, createTevmNode } from '@tevm/node'
import { type Address, type BlockTag, type Client, type Hex, isHex } from 'viem'
import { waitForTransactionReceipt } from 'viem/actions'
import type { ContainsTransactionAny } from '../../common/types.js'
import type { BalanceChange, HandleTransactionResult } from './types.js'

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

	// If it's already a transaction receipt
	if (typeof res === 'object' && 'status' in res) {
		return {
			getBalanceChange: (address: Address) => getBalanceChange(node)(address, res.blockNumber - 1n, res.blockNumber),
		}
	}

	let txHash: Hex | undefined

	// If it's a call result, grab the tx hash
	if (typeof res === 'object' && 'txHash' in res) {
		if (res.txHash === undefined)
			throw new Error(
				'Transaction hash is undefined, you need to pass `addToBlockchain: true` or `addToMempool: true` to include the transaction in a block',
			)
		txHash = res.txHash
	}

	// If it's a transaction hash just assign it
	if (typeof res === 'string' && isHex(res)) {
		txHash = res
	}

	// At this point if we don't have a tx hash, we don't know what was passed
	if (!txHash)
		throw new Error(
			'Transaction hash is undefined, you need to pass a transaction hash, receipt or call result, or a promise that resolves to one of those',
		)

	if ('request' in client) {
		// If a client was passed, we assume the tx will get mined consumer side, so we just want to wait it and grab the receipt
		const txReceipt = await waitForTransactionReceipt(client, { hash: txHash })
		return {
			getBalanceChange: (address: Address) =>
				getBalanceChange(node)(address, txReceipt.blockNumber - 1n, txReceipt.blockNumber),
		}
	}

	// Otherwise we'll find out from the node directly
	const txReceipt = await ethGetTransactionReceiptHandler(node)({ hash: txHash })
	if (!txReceipt) throw new Error('Transaction receipt not found')
	return {
		getBalanceChange: (address: Address) =>
			getBalanceChange(node)(address, txReceipt.blockNumber - 1n, txReceipt.blockNumber),
	}
}

// Create balance change getter function
const getBalanceChange =
	(node: TevmNode) =>
	async (
		address: Address,
		beforeBlockTag: bigint | BlockTag,
		afterBlockTag: bigint | BlockTag,
	): Promise<BalanceChange> => {
		const getBalance = getBalanceHandler(node)
		const balanceBefore = await getBalance({ address, blockTag: beforeBlockTag })
		const balanceAfter = await getBalance({ address, blockTag: afterBlockTag })

		return {
			address,
			balanceBefore,
			balanceAfter,
			balanceChange: balanceAfter - balanceBefore,
		}
	}
