import { createAddress } from '@tevm/address'
import { transports } from '@tevm/test-utils'
import { EthjsAccount, EthjsAddress } from '@tevm/utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createBaseState } from '../createBaseState.js'
import { getAccount } from './getAccount.js'
import { putAccount } from './putAccount.js'

afterEach(() => {
	vi.restoreAllMocks()
})

describe(getAccount.name, () => {
	it('Should get an account', async () => {
		const baseState = createBaseState({
			loggingLevel: 'warn',
		})

		const address = EthjsAddress.fromString(`0x${'01'.repeat(20)}`)
		const balance = 420n
		const nonce = 2n
		const account = EthjsAccount.fromAccountData({
			balance,
			nonce,
		})

		await putAccount(baseState)(address, account)

		expect(await getAccount(baseState)(address)).toEqual(account)
	})
})

describe(`${getAccount.name} forking`, () => {
	let baseState: ReturnType<typeof createBaseState>
	let address: EthjsAddress
	let account: EthjsAccount

	const knownAccount = createAddress('0x9430801EBAf509Ad49202aaBC5F5Bc6fd8A3dAf8')

	beforeEach(() => {
		baseState = createBaseState({
			loggingLevel: 'warn',
			fork: {
				transport: transports.optimism,
				blockTag: 122486679n,
			},
		})

		address = createAddress(`0x${'01'.repeat(20)}`)
		account = EthjsAccount.fromAccountData({
			balance: 420n,
			nonce: 2n,
		})
	})

	it('Should get an account', async () => {
		await putAccount(baseState)(address, account)
		expect(await getAccount(baseState)(address)).toEqual(account)
	})

	it('Should return undefined if account is not in cache and no fork transport', async () => {
		expect(await getAccount(createBaseState({}))(address)).toBeUndefined()
	})

	it('Should return undefined if skipFetchingFromFork is true and account is not in cache', async () => {
		expect(await getAccount(baseState, true)(knownAccount)).toBeUndefined()
	})

	it('Should fetch account from remote provider if not in cache and fork transport is provided', async () => {
		const result = await getAccount(baseState)(knownAccount)
		expect(result).toBeDefined()
		expect(result).toMatchSnapshot()
		const cachedResult = await getAccount(baseState)(knownAccount)
		expect(cachedResult).toEqual(result as any)
		// test that it indead is cached and we didn't fetch twice
		expect(await getAccount(baseState)(knownAccount)).toMatchSnapshot()
	})
})
