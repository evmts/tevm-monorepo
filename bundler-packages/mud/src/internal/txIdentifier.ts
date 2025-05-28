import type { TxPool } from "@tevm/txpool"
import { bytesToHex, type Hex } from "viem"

export const matchOptimisticTxCounterpart = async (txPool: TxPool, data: Hex) => {
  const identifier = extractTxIdentifier(data)
  if (!identifier) return null

  const poolTxs = txPool.txsByHash.values()
  const matchingTx = Array.from(poolTxs).find(tx => bytesToHex(tx.data).endsWith(identifier))
  return matchingTx ? bytesToHex(matchingTx.hash()) : null
}

// Helper to generate 2-byte random client ID
export const generateTxIdentifier = () => {
  const randomBytes = new Uint8Array(2)
  crypto.getRandomValues(randomBytes)
  return `0x${Array.from(randomBytes).map(b => b.toString(16).padStart(2, '0')).join('')}` as Hex
}

// Helper to extract client ID from transaction data
const extractTxIdentifier = (data: string): string | null => {
  if (data.length < 6) return null // Must have at least 2 bytes for client ID
  const clientIdHex = data.slice(-4) // Last 2 bytes (4 hex chars)
  return `0x${clientIdHex}`
}