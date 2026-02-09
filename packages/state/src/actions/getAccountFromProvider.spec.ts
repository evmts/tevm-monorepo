import { createAddress } from '@tevm/address'
import { transports } from '@tevm/test-utils'
import { type Hex, hexToBigInt, toBytes } from '@tevm/utils'
import { describe, expect, it } from 'vitest'
import { createBaseState } from '../createBaseState.js'
import { getAccountFromProvider } from './getAccountFromProvider.js'

describe(getAccountFromProvider.name, () => {
	it('should get an account from fork transport', async () => {
		const address = createAddress('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045')
		const latestBlock = (await transports.optimism.request({
			jsonrpc: '2.0',
			id: 1,
			method: 'eth_blockNumber',
		})) as Hex | undefined
		if (!latestBlock) {
			throw new Error('Latest block not found')
		}

		const proof = (await transports.optimism.request({
			jsonrpc: '2.0',
			id: 1,
			method: 'eth_getProof',
			params: [address.toString(), [], latestBlock],
		})) as {
			nonce: Hex
			codeHash: Hex
			storageHash: Hex
		}

		const state = createBaseState({ fork: { transport: transports.optimism, blockTag: hexToBigInt(latestBlock) } })
		const account = await getAccountFromProvider(state)(address)
		expect(account._nonce).toBe(hexToBigInt(proof.nonce))
		expect(account._codeHash).toEqual(toBytes(proof.codeHash))
		expect(account._codeSize).toBeGreaterThanOrEqual(0)
		expect(account._storageRoot).toEqual(toBytes(proof.storageHash))
		expect(account._version).toBe(0)
	})
})
