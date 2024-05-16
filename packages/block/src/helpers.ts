import { BlobEIP4844Transaction } from '@tevm/tx'
import { type Hex, TypeOutput, isHex, toType } from '@tevm/utils'

import type { TypedTransaction } from '@tevm/tx'
import type { BlockHeaderBytes, HeaderData } from './types.js'

/**
 * Returns a 0x-prefixed hex number string from a hex string or string integer.
 * @param {string} input string to check, convert, and return
 */
export const numberToHex = (input?: string): Hex | undefined => {
	if (input === undefined) return undefined
	if (!isHex(input)) {
		const regex = new RegExp(/^\d+$/) // test to make sure input contains only digits
		if (!regex.test(input)) {
			const msg = `Cannot convert string to hex string. numberToHex only supports 0x-prefixed hex or integer strings but the given string was: ${input}`
			throw new Error(msg)
		}
		return `0x${Number.parseInt(input, 10).toString(16)}`
	}
	return input
}

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

export function getDifficulty(headerData: HeaderData): bigint | null {
	const { difficulty } = headerData
	if (difficulty !== undefined) {
		return toType(difficulty, TypeOutput.BigInt)
	}
	return null
}

export const getNumBlobs = (transactions: TypedTransaction[]) => {
	let numBlobs = 0
	for (const tx of transactions) {
		if (tx instanceof BlobEIP4844Transaction) {
			numBlobs += tx.blobVersionedHashes.length
		}
	}
	return numBlobs
}

/**
 * Approximates `factor * e ** (numerator / denominator)` using Taylor expansion
 */
export const fakeExponential = (factor: bigint, numerator: bigint, denominator: bigint) => {
	let i = BigInt(1)
	let output = BigInt(0)
	let numerator_accum = factor * denominator
	while (numerator_accum > BigInt(0)) {
		output += numerator_accum
		numerator_accum = (numerator_accum * numerator) / (denominator * i)
		i++
	}

	return output / denominator
}
