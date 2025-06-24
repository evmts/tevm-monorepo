import type { JsonRpcTransaction } from '@tevm/actions'
import type { Hex } from 'viem'
import { normalizeHex } from './normalizeHex.js'

export const normalizeTx = (tx: JsonRpcTransaction) => [
	normalizeHex(tx.from),
	normalizeHex(tx.to),
	normalizeHex(tx.gas),
	normalizeHex(tx.gasPrice),
	normalizeHex(tx.value),
	normalizeHex(tx.data),
	normalizeHex('nonce' in tx ? (tx.nonce as Hex | undefined) : undefined),
	normalizeHex('chainId' in tx ? (tx.chainId as Hex | undefined) : undefined),
	normalizeHex('maxFeePerGas' in tx ? (tx.maxFeePerGas as Hex | undefined) : undefined),
	normalizeHex('maxPriorityFeePerGas' in tx ? (tx.maxPriorityFeePerGas as Hex | undefined) : undefined),
]
