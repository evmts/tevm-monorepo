import { bytesToHex, type ExactPartial, type Hex, type RpcTransactionRequest } from 'viem'
import { normalizeHex } from './normalizeHex.js'

export const normalizeTx = (tx: ExactPartial<RpcTransactionRequest> & { chainId?: Hex | undefined }) => [
	...(tx.accessList?.map(({ address, storageKeys }) => [normalizeHex(address), ...storageKeys.map(normalizeHex)]) ??
		[]),
	...(tx.authorizationList?.map((list) => Object.values(list).map(normalizeHex)) ?? []),
	...(tx.blobVersionedHashes?.map(normalizeHex) ?? []),
	...(tx.blobs?.map((blob) => normalizeHex(typeof blob === 'string' ? blob : bytesToHex(blob))) ?? []),
	...(tx.chainId ? [normalizeHex(tx.chainId)] : []),
	...(tx.data ? [normalizeHex(tx.data)] : []),
	...(tx.from ? [normalizeHex(tx.from)] : []),
	...(tx.gas ? [normalizeHex(tx.gas)] : []),
	...(tx.gasPrice ? [normalizeHex(tx.gasPrice)] : []),
	...(tx.maxFeePerBlobGas ? [normalizeHex(tx.maxFeePerBlobGas)] : []),
	...(tx.maxFeePerGas ? [normalizeHex(tx.maxFeePerGas)] : []),
	...(tx.maxPriorityFeePerGas ? [normalizeHex(tx.maxPriorityFeePerGas)] : []),
	...(tx.nonce ? [normalizeHex(tx.nonce)] : []),
	...(tx.sidecars?.map((sidecar) => Object.values(sidecar).map(normalizeHex)) ?? []),
	...(tx.to ? [normalizeHex(tx.to)] : []),
	...(tx.type ? [normalizeHex(tx.type)] : []),
	...(tx.value ? [normalizeHex(tx.value)] : []),
]
