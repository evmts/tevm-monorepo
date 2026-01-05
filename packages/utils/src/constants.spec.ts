import { describe, expect, it } from 'vitest'
import {
	GWEI_TO_WEI,
	BIGINT_0,
	BIGINT_1,
	MAX_UINT64,
	SECP256K1_ORDER_DIV_2,
	KECCAK256_RLP,
	KECCAK256_RLP_ARRAY,
} from './constants.js'

describe('Ethereum constants', () => {
	it('GWEI_TO_WEI should equal 10^9', () => {
		expect(GWEI_TO_WEI).toBe(1000000000n)
		expect(GWEI_TO_WEI).toBe(10n ** 9n)
	})

	it('BIGINT_0 should be zero', () => {
		expect(BIGINT_0).toBe(0n)
	})

	it('BIGINT_1 should be one', () => {
		expect(BIGINT_1).toBe(1n)
	})

	it('MAX_UINT64 should equal 2^64 - 1', () => {
		expect(MAX_UINT64).toBe(18446744073709551615n)
		expect(MAX_UINT64).toBe(2n ** 64n - 1n)
	})

	it('SECP256K1_ORDER_DIV_2 should be half the secp256k1 curve order', () => {
		expect(SECP256K1_ORDER_DIV_2).toBe(57896044618658097711785492504343953926418782139537452191302581570759080747168n)
		// Verify it's half of the curve order n
		const curveOrder = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141n
		expect(SECP256K1_ORDER_DIV_2).toBe(curveOrder / 2n)
	})

	it('KECCAK256_RLP should be the keccak256 hash of RLP encoded empty string', () => {
		// KECCAK256_RLP = keccak256(RLP(Uint8Array(0))) = keccak256([0x80])
		expect(KECCAK256_RLP).toBe('0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421')
	})

	it('KECCAK256_RLP should be a valid hex string', () => {
		expect(KECCAK256_RLP).toMatch(/^0x[0-9a-f]{64}$/)
	})

	it('KECCAK256_RLP_ARRAY should be the keccak256 hash of RLP encoded empty array', () => {
		// KECCAK256_RLP_ARRAY = keccak256(RLP([])) = keccak256([0xc0])
		expect(KECCAK256_RLP_ARRAY).toBe('0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347')
	})

	it('KECCAK256_RLP_ARRAY should be a valid hex string', () => {
		expect(KECCAK256_RLP_ARRAY).toMatch(/^0x[0-9a-f]{64}$/)
	})

	it('KECCAK256_RLP and KECCAK256_RLP_ARRAY should be different', () => {
		expect(KECCAK256_RLP).not.toBe(KECCAK256_RLP_ARRAY)
	})
})
