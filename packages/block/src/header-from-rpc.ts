import type { Hex } from '@tevm/utils'
import { BlockHeader } from './header.js'
import { strNumberToHex } from './strNumberToHex.js'
import type { JsonRpcBlock } from './JsonRpcBlock.js'
import type { BlockOptions } from './BlockOptions.js'

/**
 * Creates a new block header object from Ethereum JSON RPC.
 *
 * @param blockParams - Ethereum JSON RPC of block (eth_getBlockByNumber)
 * @param options - An object describing the blockchain
 */
export function blockHeaderFromRpc(blockParams: JsonRpcBlock, options: BlockOptions) {
	const {
		parentHash,
		sha3Uncles,
		miner,
		stateRoot,
		transactionsRoot,
		receiptsRoot,
		logsBloom,
		difficulty,
		number,
		gasLimit,
		gasUsed,
		timestamp,
		extraData,
		mixHash,
		nonce,
		baseFeePerGas,
		withdrawalsRoot,
		blobGasUsed,
		excessBlobGas,
		parentBeaconBlockRoot,
		requestsRoot,
	} = blockParams

	const blockHeader = BlockHeader.fromHeaderData(
		{
			parentHash,
			uncleHash: sha3Uncles,
			coinbase: miner,
			stateRoot,
			transactionsTrie: transactionsRoot,
			receiptTrie: receiptsRoot,
			logsBloom,
			difficulty: strNumberToHex(difficulty) as Hex,
			number,
			gasLimit,
			gasUsed,
			timestamp,
			extraData,
			mixHash: mixHash as Hex,
			nonce,
			baseFeePerGas: baseFeePerGas as string,
			withdrawalsRoot: withdrawalsRoot as string,
			blobGasUsed: blobGasUsed as string,
			excessBlobGas: excessBlobGas as string,
			parentBeaconBlockRoot: parentBeaconBlockRoot as string,
			requestsRoot: requestsRoot as string,
		},
		options,
	)

	return blockHeader
}
