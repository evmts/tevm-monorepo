import type { TxPool } from '@tevm/txpool'
import { type Hex, bytesToHex } from 'viem'

export const matchOptimisticTxCounterpart = async (txPool: TxPool, data: Hex) => {
	const matchingTx = [...txPool.txsByHash.values()].find((tx) => {
		const identifier = extractTxIdentifier(bytesToHex(tx.data))
		if (!identifier) return false
		return data.includes(identifier.slice(2))
	})

	return matchingTx ? bytesToHex(matchingTx.hash()) : null
}

// Helper to generate 8-byte random identifier
export const generateTxIdentifier = () => {
	const randomBytes = new Uint8Array(8)
	crypto.getRandomValues(randomBytes)
	return `0x${Array.from(randomBytes)
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('')}` as Hex
}

// Helper to extract appended identifier from transaction data
const extractTxIdentifier = (data: Hex): Hex | null => {
	if (data.length < 18) return null // Must have at least 8 bytes for identifier
	const identifierHex = data.slice(-16) // Last 8 bytes (16 hex chars)
	return `0x${identifierHex}`
}
