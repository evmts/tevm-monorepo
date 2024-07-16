import { createAddress } from '@tevm/address'
import { transports } from '@tevm/test-utils'
import { EthjsAccount, EthjsAddress, hexToBytes, toBytes } from '@tevm/utils'
import { beforeEach, describe, expect, it } from 'vitest'
import type { BaseState } from '../BaseState.js'
import { createBaseState } from '../createBaseState.js'
import { getContractStorage } from './getContractStorage.js'
import { putAccount } from './putAccount.js'
import { putContractStorage } from './putContractStorage.js'

describe('getContractStorage', () => {
	let baseState: BaseState
	let address: EthjsAddress
	let key: Uint8Array
	let value: Uint8Array
	let account: EthjsAccount

	beforeEach(async () => {
		baseState = createBaseState({
			loggingLevel: 'warn',
		})

		address = createAddress('01'.repeat(20))
		key = hexToBytes(`0x${'02'.repeat(32)}`)
		value = hexToBytes('0x1234')
		account = EthjsAccount.fromAccountData({
			balance: 420n,
			nonce: 2n,
		})

		await putAccount(baseState)(address, account)
		await putContractStorage(baseState)(address, key, value)
	})

	it('should get the storage value associated with the provided address and key', async () => {
		expect(await getContractStorage(baseState)(address, key)).toEqual(value)
	})

	it('should return empty Uint8Array if the storage does not exist', async () => {
		const newKey = hexToBytes(`0x${'03'.repeat(32)}`)
		expect(await getContractStorage(baseState)(address, newKey)).toEqual(Uint8Array.from([0]))
	})

	it('should throw an error if the key is not 32 bytes long', async () => {
		const invalidKey = hexToBytes('0x1234')
		const err = await getContractStorage(baseState)(address, invalidKey).catch((e) => e)
		expect(err).toBeInstanceOf(Error)
		expect(err.message).toMatchSnapshot()
	})

	it('should return empty Uint8Array if the account is not a contract', async () => {
		const newAddress = EthjsAddress.fromString(`0x${'02'.repeat(20)}`)
		await putAccount(baseState)(newAddress, EthjsAccount.fromAccountData({ balance: 100n, nonce: 1n }))
		expect(await getContractStorage(baseState)(newAddress, key)).toEqual(Uint8Array.from([0]))
	})
})

describe('getContractStorage forking', () => {
	let baseState: BaseState
	let knownContractAddress: EthjsAddress
	let knownStorageKey: Uint8Array

	beforeEach(() => {
		baseState = createBaseState({
			loggingLevel: 'warn',
			fork: {
				transport: transports.optimism,
				blockTag: 122488188n,
			},
		})

		knownContractAddress = EthjsAddress.fromString('0x4200000000000000000000000000000000000042')
		knownStorageKey = toBytes(1, { size: 32 })
	})

	it('should fetch storage from remote provider if not in cache and fork transport is provided', async () => {
		const result = await getContractStorage(baseState)(knownContractAddress, knownStorageKey)
		expect(result).toBeDefined()
		expect(result.length).toBeGreaterThan(0)
		expect(result).toMatchSnapshot()
		const cachedResult = await getContractStorage(baseState)(knownContractAddress, knownStorageKey)
		expect(cachedResult).toEqual(result)
	})

	it('should return empty Uint8Array if the account does not exist and no fork transport', async () => {
		const noForkBaseState = createBaseState({
			loggingLevel: 'warn',
		})
		expect(await getContractStorage(noForkBaseState)(knownContractAddress, knownStorageKey)).toEqual(
			Uint8Array.from([0]),
		)
	})
})
