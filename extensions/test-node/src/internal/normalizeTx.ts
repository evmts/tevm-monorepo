import { bytesToHex, type ExactPartial, type Hex, type RpcTransactionRequest } from 'viem'
import { normalizeHex } from './normalizeHex.js'

/**
 * Normalizes a transaction request to a consistent array of field labels and
 * lowercase hex strings for cache key generation. Extracts all relevant fields
 * from the transaction and normalizes them to ensure cache hits regardless of
 * case differences without colliding across fields.
 *
 * @param tx - The transaction request to normalize, including optional chainId
 * @returns An array of field labels and normalized hex strings representing the transaction fields
 *
 * @example
 * ```typescript
 * import { normalizeTx } from '@tevm/test-node'
 *
 * const cacheKey = normalizeTx({
 *   from: '0xABC...',
 *   to: '0xDEF...',
 *   value: '0x1234',
 *   chainId: '0x1'
 * })
 * // Returns: ['chainId', '0x1', 'from', '0xabc...', 'to', '0xdef...', 'value', '0x1234']
 * ```
 */
export const normalizeTx = (tx: ExactPartial<RpcTransactionRequest> & { chainId?: Hex | undefined }) => [
	...(tx.accessList?.map(({ address, storageKeys }) => [
		'accessList',
		normalizeHex(address),
		...storageKeys.map(normalizeHex),
	]) ?? []),
	...(tx.authorizationList?.map((list) =>
		Object.entries(list)
			.sort(([a], [b]) => a.localeCompare(b))
			.map(([key, value]) => [key, normalizeHex(value)]),
	) ?? []),
	...(tx.blobVersionedHashes?.map((hash) => ['blobVersionedHash', normalizeHex(hash)]) ?? []),
	...(tx.blobs?.map((blob) => ['blob', normalizeHex(typeof blob === 'string' ? blob : bytesToHex(blob))]) ?? []),
	...(tx.chainId ? ['chainId', normalizeHex(tx.chainId)] : []),
	...(tx.data ? ['data', normalizeHex(tx.data)] : []),
	...(tx.from ? ['from', normalizeHex(tx.from)] : []),
	...(tx.gas ? ['gas', normalizeHex(tx.gas)] : []),
	...(tx.gasPrice ? ['gasPrice', normalizeHex(tx.gasPrice)] : []),
	...(tx.maxFeePerBlobGas ? ['maxFeePerBlobGas', normalizeHex(tx.maxFeePerBlobGas)] : []),
	...(tx.maxFeePerGas ? ['maxFeePerGas', normalizeHex(tx.maxFeePerGas)] : []),
	...(tx.maxPriorityFeePerGas ? ['maxPriorityFeePerGas', normalizeHex(tx.maxPriorityFeePerGas)] : []),
	...(tx.nonce ? ['nonce', normalizeHex(tx.nonce)] : []),
	...(tx.sidecars?.map((sidecar) =>
		Object.entries(sidecar)
			.sort(([a], [b]) => a.localeCompare(b))
			.map(([key, value]) => [key, normalizeHex(value)]),
	) ?? []),
	...(tx.to ? ['to', normalizeHex(tx.to)] : []),
	...(tx.type ? ['type', normalizeHex(tx.type)] : []),
	...(tx.value ? ['value', normalizeHex(tx.value)] : []),
]
