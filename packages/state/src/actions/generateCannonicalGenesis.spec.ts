import { beforeEach, describe, expect, it } from 'bun:test'
import { createAddress } from '@tevm/address'
import { InternalError } from '@tevm/errors'
import { EthjsAccount } from '@tevm/utils'
import { createBaseState } from '../createBaseState.js'
import type { TevmState } from '../state-types/TevmState.js'
import { dumpCanonicalGenesis } from './dumpCannonicalGenesis.js'
import { generateCanonicalGenesis } from './generateCannonicalGenesis.js'
import { putAccount } from './putAccount.js'

describe(generateCanonicalGenesis.name, () => {
	let baseState: ReturnType<typeof createBaseState>
	let state: TevmState

	beforeEach(async () => {
		baseState = createBaseState({})

		state = await (async () => {
			const state = createBaseState({})
			await putAccount(state)(createAddress(69), EthjsAccount.fromAccountData({ balance: 20n, nonce: 2n }))
			return dumpCanonicalGenesis(baseState)()
		})()
	})

	it('should successfully generate canonical genesis', async () => {
		await generateCanonicalGenesis(baseState)(state)
		expect(await dumpCanonicalGenesis(baseState)()).toMatchSnapshot()
	})

	it('should throw if there are uncommitted checkpoints', async () => {
		baseState.caches.accounts._checkpoints = 1

		const error = await generateCanonicalGenesis(baseState)(state).catch((e) => e)

		expect(error).toBeInstanceOf(InternalError)
		expect(error).toMatchSnapshot()
	})
})
