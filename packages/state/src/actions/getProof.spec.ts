import { createAddress } from '@tevm/address'
import { describe, expect, it, vi } from 'vitest'
import { createBaseState } from '../createBaseState.js'
import { getProof } from './getProof.js'

const mockBlock = {
	hash: `0x${'11'.repeat(32)}`,
	parentHash: `0x${'00'.repeat(32)}`,
	sha3Uncles: `0x${'00'.repeat(32)}`,
	miner: `0x${'00'.repeat(20)}`,
	stateRoot: `0x${'00'.repeat(32)}`,
	transactionsRoot: `0x${'00'.repeat(32)}`,
	receiptsRoot: `0x${'00'.repeat(32)}`,
	logsBloom: `0x${'00'.repeat(256)}`,
	difficulty: '0x0',
	number: '0x1',
	gasLimit: '0x1',
	gasUsed: '0x0',
	timestamp: '0x1',
	extraData: '0x',
	mixHash: `0x${'00'.repeat(32)}`,
	nonce: '0x0000000000000000',
	transactions: [],
	uncles: [],
}
const createMockForkTransport = () => ({
	request: vi.fn(async ({ method }: { method: string }) => {
		if (method === 'eth_getBlockByNumber') {
			return mockBlock
		}
		if (method === 'eth_getProof') {
			return {
				address: '0x0000000000000000000000000000000000000000',
				accountProof: ['0x01'],
				balance: '0x1',
				codeHash: `0x${'22'.repeat(32)}`,
				nonce: '0x2',
				storageHash: `0x${'33'.repeat(32)}`,
				storageProof: [
					{
						key: `0x${'01'.repeat(32)}`,
						value: '0x3',
						proof: ['0x04'],
					},
				],
			}
		}
		throw new Error(`Unexpected RPC method: ${method}`)
	}),
})

describe(getProof.name, () => {
	it('getProof from fork url with storage slots', async () => {
		const state = createBaseState({
			fork: {
				transport: createMockForkTransport(),
				blockTag: 1n,
			},
		})
		await state.ready()

		// Create a storage slot to pass in
		const storageSlot = new Uint8Array(32).fill(1)

		// Call getProof with a storage slot to cover the transformation in line 32-36
		const result = await getProof(state)(createAddress(0), [storageSlot])

		// Check the basic structure
		expect(result).toHaveProperty('address')
		expect(result).toHaveProperty('accountProof')
		expect(result).toHaveProperty('balance')
		expect(result).toHaveProperty('codeHash')
		expect(result).toHaveProperty('nonce')
		expect(result).toHaveProperty('storageHash')
		expect(result).toHaveProperty('storageProof')

		// Verify we got a storageProof array with the expected structure
		expect(Array.isArray(result.storageProof)).toBe(true)
		if (result.storageProof.length > 0) {
			const proofEntry = result.storageProof[0]
			expect(proofEntry).toHaveProperty('key')
			expect(proofEntry).toHaveProperty('value')
			expect(proofEntry).toHaveProperty('proof')
		}
	})

	it('throws error if attempting to getProof with no fork uri', async () => {
		const state = createBaseState({})
		await expect(getProof(state)(createAddress(0))).rejects.toThrowErrorMatchingInlineSnapshot(
			'[Error: getProof only implemented in fork mode atm because tevm at this moment does not merkilize the state]',
		)
	})
})
