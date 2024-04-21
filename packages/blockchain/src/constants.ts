import { concatBytes, toBytes } from '@tevm/utils'

// Geth compatible DB keys

const HEADS_KEY = 'heads'

/**
 * Current canonical head for light sync
 */
const HEAD_HEADER_KEY = 'LastHeader'

/**
 * Current canonical head for full sync
 */
const HEAD_BLOCK_KEY = 'LastBlock'

/**
 * headerPrefix + number + hash -> header
 */
const HEADER_PREFIX = toBytes('h')

/**
 * headerPrefix + number + hash + tdSuffix -> td
 */
const TD_SUFFIX = toBytes('t')

/**
 * headerPrefix + number + numSuffix -> hash
 */
const NUM_SUFFIX = toBytes('n')

/**
 * blockHashPrefix + hash -> number
 */
const BLOCK_HASH_PEFIX = toBytes('H')

/**
 * bodyPrefix + number + hash -> block body
 */
const BODY_PREFIX = toBytes('b')

// Utility functions

/**
 * Convert bigint to big endian Uint8Array
 */
const bytesBE8 = (n: bigint) => toBytes(BigInt.asUintN(64, n))

const tdKey = (n: bigint, hash: Uint8Array) => concatBytes(HEADER_PREFIX, bytesBE8(n), hash, TD_SUFFIX)

const headerKey = (n: bigint, hash: Uint8Array) => concatBytes(HEADER_PREFIX, bytesBE8(n), hash)

const bodyKey = (n: bigint, hash: Uint8Array) => concatBytes(BODY_PREFIX, bytesBE8(n), hash)

const numberToHashKey = (n: bigint) => concatBytes(HEADER_PREFIX, bytesBE8(n), NUM_SUFFIX)

const hashToNumberKey = (hash: Uint8Array) => concatBytes(BLOCK_HASH_PEFIX, hash)

/**
 * @hidden
 */
export {
	bodyKey,
	bytesBE8,
	hashToNumberKey,
	HEAD_BLOCK_KEY,
	HEAD_HEADER_KEY,
	headerKey,
	HEADS_KEY,
	numberToHashKey,
	tdKey,
}
