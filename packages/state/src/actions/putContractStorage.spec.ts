import { InternalError } from '@tevm/errors'
import { EthjsAccount, EthjsAddress, createAccount, createAddressFromString, hexToBytes } from '@tevm/utils'
import { beforeEach, describe, expect, it } from 'vitest'
import type { BaseState } from '../BaseState.js'
import { createBaseState } from '../createBaseState.js'
import { getContractStorage } from './getContractStorage.js'
import { putAccount } from './putAccount.js'
import { putContractStorage } from './putContractStorage.js'

describe('putContractStorage', () => {
	let baseState: BaseState
	let address: EthjsAddress
	let key: Uint8Array
	let value: Uint8Array
	let account: EthjsAccount

	beforeEach(async () => {
		baseState = createBaseState({
			loggingLevel: 'warn',
		})

		address = createAddressFromString(`0x${'01'.repeat(20)}`)
		key = hexToBytes(`0x${'02'.repeat(32)}`)
		value = hexToBytes('0x1234')
		account = createAccount({
			balance: 420n,
			nonce: 2n,
		})

		await putAccount(baseState)(address, account)
	})

	it('should add value to the cache for the account at the provided key', async () => {
		await putContractStorage(baseState)(address, key, value)
		expect(await getContractStorage(baseState)(address, key)).toEqual(value)
	})

	it('should strip leading zeros from the value', async () => {
		const valueWithLeadingZeros = hexToBytes('0x00001234')
		const strippedValue = hexToBytes('0x1234')
		await putContractStorage(baseState)(address, key, valueWithLeadingZeros)
		expect(await getContractStorage(baseState)(address, key)).toEqual(strippedValue)
	})

	it('should throw an error if the key is not 32 bytes long', async () => {
		const invalidKey = hexToBytes('0x1234')
		const err = await putContractStorage(baseState)(address, invalidKey, value).catch((e) => e)
		expect(err).toBeInstanceOf(InternalError)
		expect(err).toMatchSnapshot()
	})

	it('should throw an error if the account does not exist', async () => {
		const newAddress = createAddressFromString(`0x${'02'.repeat(20)}`)
		const err = await putContractStorage(baseState)(newAddress, key, value).catch((e) => e)
		expect(err).toBeInstanceOf(InternalError)
		expect(err).toMatchSnapshot()
	})

	it('should delete the value if it is empty or filled with zeros', async () => {
		const emptyValue = hexToBytes('0x')
		await putContractStorage(baseState)(address, key, emptyValue)
		expect(await getContractStorage(baseState)(address, key)).toEqual(new Uint8Array())
	})

	it('should delete the value if it is filled with zeros', async () => {
		const zeroValue = hexToBytes(`0x${'00'.repeat(32)}`)
		await putContractStorage(baseState)(address, key, zeroValue)
		expect(await getContractStorage(baseState)(address, key)).toEqual(Uint8Array.from([0]))
	})
})
