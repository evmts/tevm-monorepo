import { TransactionFactory } from '@tevm/tx'
import { type Hex, hexToBytes } from '@tevm/utils'

import { blockHeaderFromRpc } from './blockHeaderFromRpc.js'

import { Block } from './index.js'

import { InternalError, MisconfiguredClientError } from '@tevm/errors'
import type { TypedTransaction } from '@tevm/tx'
import { createClRequest } from './createClRequest.js'
import type { JsonRpcBlock } from './JsonRpcBlock.js'
import type { BlockOptions } from './BlockOptions.js'
import type { BlockData } from './BlockData.js'
import { normalizeTxParams } from './normalizeTxParams.js'

/**
 * Creates a new block object from Ethereum JSON RPC.
 *
 * @param blockParams - Ethereum JSON RPC of block (eth_getBlockByNumber)
 * @param uncles - Optional list of Ethereum JSON RPC of uncles (eth_getUncleByBlockHashAndIndex)
 * @param options - An object describing the blockchain
 * @deprecated
 */
export function blockFromRpc(blockParams: JsonRpcBlock, options: BlockOptions, uncles: any[] = []) {
	const header = blockHeaderFromRpc(blockParams, options)

	const transactions: TypedTransaction[] = []
	const opts = { common: header.common.ethjsCommon }
	for (const _txParams of blockParams.transactions ?? []) {
		if (typeof _txParams === 'string') {
			continue
		}
		const txParams = normalizeTxParams(_txParams)
		try {
			const tx = TransactionFactory.fromTxData(txParams, opts)
			transactions.push(tx)
		} catch (e) {
			if (e instanceof Error && e.message.includes('The chain ID does not match the chain ID of Common.')) {
				throw new MisconfiguredClientError(
					'Detected that forked blocks do not have same chain id as the tevm client. To fix this explicitly pass in a `common` property with correct chain id',
				)
			}
			if (e instanceof Error) {
				throw new InternalError(e.message, { cause: e })
			}
			throw new InternalError('Unexpected error', { cause: e })
		}
	}

	const uncleHeaders = uncles.map((uh) => blockHeaderFromRpc(uh, options))

	const requests = blockParams.requests?.map((req) => {
		const bytes = hexToBytes(req as Hex)
		return createClRequest(bytes[0] as number, bytes.slice(1))
	})
	return Block.fromBlockData(
		{
			header,
			transactions,
			uncleHeaders,
			withdrawals: blockParams.withdrawals,
			requests,
		} as BlockData,
		options,
	)
}
