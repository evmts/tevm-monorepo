import { bytesToHex, numberToHex, toBytes } from '@tevm/utils'
import { txToJSONRPCTx } from './txToJSONRPCTx.js'

/**
 * @param {import('@tevm/block').Block} block
 * @param {boolean} includeTransactions
 * @returns {Promise<Required<import('../eth/EthJsonRpcResponse.js').EthGetBlockByHashJsonRpcResponse>['result']>}
 */
export const blockToJsonRpcBlock = async (block, includeTransactions) => {
	const json = block.toJSON()
	const header = /** @type {import('@tevm/block').JsonHeader}*/ (json.header)
	const transactions = block.transactions.map((tx, txIndex) =>
		includeTransactions ? txToJSONRPCTx(tx, block, txIndex) : bytesToHex(tx.hash()),
	)

	/**
	 * @type {import('../eth/EthJsonRpcResponse.js').EthGetBlockByHashJsonRpcResponse['result']}
	 */
	const out = {
		number: /** @type {import('@tevm/utils').Hex}*/ (header.number),
		hash: bytesToHex(block.hash()),
		parentHash: /** @type {import('@tevm/utils').Hex}*/ (header.parentHash),
		// TODO add this to the type
		...{ mixHash: header.mixHash },
		nonce: /** @type {import('@tevm/utils').Hex}*/ (header.nonce),
		sha3Uncles: /** @type {import('@tevm/utils').Hex}*/ (header.uncleHash),
		logsBloom: /** @type {import('@tevm/utils').Hex}*/ (header.logsBloom),
		transactionsRoot: /** @type {import('@tevm/utils').Hex}*/ (header.transactionsTrie),
		stateRoot: /** @type {import('@tevm/utils').Hex}*/ (header.stateRoot),
		miner: /** @type {import('@tevm/utils').Address}*/ (header.coinbase),
		difficulty: /** @type {import('@tevm/utils').Hex}*/ (header.difficulty),
		// TODO we need to actually add this
		totalDifficulty: /** @type {import('@tevm/utils').Hex}*/ ('0x0'),
		extraData: /** @type {import('@tevm/utils').Hex}*/ (header.extraData),
		size: numberToHex(toBytes(JSON.stringify(json)).byteLength),
		gasLimit: /** @type {import('@tevm/utils').Hex}*/ (header.gasLimit),
		gasUsed: /** @type {import('@tevm/utils').Hex}*/ (header.gasUsed),
		timestamp: /** @type {import('@tevm/utils').Hex}*/ (header.timestamp),
		uncles: block.uncleHeaders.map((uh) => bytesToHex(uh.hash())),
		// TODO fix this type
		transactions: /** @type any*/ (transactions),
		// TODO add this to the type
		...{ baseFeePerGas: header.baseFeePerGas },
		...{ receiptsRoot: header.receiptTrie },
		...(header.withdrawalsRoot !== undefined
			? {
					withdrawalsRoot: header.withdrawalsRoot,
					withdrawals: json.withdrawals,
				}
			: {}),
		...(header.blobGasUsed !== undefined ? { blobGasUsed: header.blobGasUsed } : {}),
		// TODO add this to the type
		...{ requestsRoot: header.requestsRoot },
		// TODO add this to the type
		...{ requests: block.requests?.map((req) => bytesToHex(req.serialize())) },
		// TODO add this to the type
		...{ excessBlobGas: header.excessBlobGas },
		// TODO add this to the type
		...{ parentBeaconBlockRoot: header.parentBeaconBlockRoot },
	}

	return out
}
