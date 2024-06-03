import type { HeaderData } from './HeaderData.js'
import type { BlockHeaderBytes } from './BlockHeaderBytes.js'

export function valuesArrayToHeaderData(values: BlockHeaderBytes): HeaderData {
	const [
		parentHash,
		uncleHash,
		coinbase,
		stateRoot,
		transactionsTrie,
		receiptTrie,
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
	] = values

	if (values.length > 21) {
		throw new Error(`invalid header. More values than expected were received. Max: 20, got: ${values.length}`)
	}
	if (values.length < 15) {
		throw new Error(`invalid header. Less values than expected were received. Min: 15, got: ${values.length}`)
	}

	return {
		...(parentHash !== undefined ? { parentHash } : {}),
		...(uncleHash !== undefined ? { uncleHash } : {}),
		...(coinbase !== undefined ? { coinbase } : {}),
		...(stateRoot !== undefined ? { stateRoot } : {}),
		...(transactionsTrie !== undefined ? { transactionsTrie } : {}),
		...(receiptTrie !== undefined ? { receiptTrie } : {}),
		...(logsBloom !== undefined ? { logsBloom } : {}),
		...(difficulty !== undefined ? { difficulty } : {}),
		...(number !== undefined ? { number } : {}),
		...(gasLimit !== undefined ? { gasLimit } : {}),
		...(gasUsed !== undefined ? { gasUsed } : {}),
		...(timestamp !== undefined ? { timestamp } : {}),
		...(extraData !== undefined ? { extraData } : {}),
		...(mixHash !== undefined ? { mixHash } : {}),
		...(nonce !== undefined ? { nonce } : {}),
		...(baseFeePerGas !== undefined ? { baseFeePerGas } : {}),
		...(withdrawalsRoot !== undefined ? { withdrawalsRoot } : {}),
		...(blobGasUsed !== undefined ? { blobGasUsed } : {}),
		...(excessBlobGas !== undefined ? { excessBlobGas } : {}),
		...(parentBeaconBlockRoot !== undefined ? { parentBeaconBlockRoot } : {}),
		...(requestsRoot !== undefined ? { requestsRoot } : {}),
	}
}
