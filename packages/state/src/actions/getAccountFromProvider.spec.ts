import { createAddress } from '@tevm/address'
import { describe, expect, it, vi } from 'vitest'
import { createBaseState } from '../createBaseState.js'
import { getAccountFromProvider } from './getAccountFromProvider.js'

const createMockForkTransport = () => ({
	request: vi.fn(async ({ method }: { method: string }) => {
		if (method === 'eth_getProof') {
			return {
				address: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
				accountProof: [],
				balance: '0x1a4',
				codeHash: `0x${'00'.repeat(32)}`,
				nonce: '0x2',
				storageHash: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
				storageProof: [],
			}
		}
		throw new Error(`Unexpected RPC method: ${method}`)
	}),
})

describe(getAccountFromProvider.name, () => {
	it('should get an account from fork transport', async () => {
		const address = createAddress('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045')
		const state = createBaseState({ fork: { transport: createMockForkTransport(), blockTag: 1n } })
		const account = await getAccountFromProvider(state)(address)
		expect(account).toMatchObject({
			_codeSize: expect.any(Number),
			_version: 0,
		})
		expect(typeof account?._nonce).toBe('bigint')
		expect(account?._codeHash).toHaveLength(32)
		expect(account?._storageRoot).toHaveLength(32)
	})
})
