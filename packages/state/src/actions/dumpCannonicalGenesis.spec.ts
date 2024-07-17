import { describe, expect, it } from 'vitest'
import { dumpCanonicalGenesis } from './dumpCannonicalGenesis.js'
import { createBaseState } from '../createBaseState.js'
import { putAccount } from './putAccount.js'
import { createAddress } from '@tevm/address'
import { putContractCode } from './putContractCode.js'
import { hexToBytes, numberToBytes } from 'viem'
import { SimpleContract } from '@tevm/test-utils'
import { putContractStorage } from './putContractStorage.js'

describe(dumpCanonicalGenesis.name, () => {
	it('dumps state into primitive types', async () => {
		const state = createBaseState({})
		await putAccount(state)(createAddress(`0x${'69'.repeat(20)}`))
		await putContractCode(state)(createAddress(`0x${'4200'.repeat(10)}`), hexToBytes(SimpleContract.deployedBytecode))
		await putContractStorage(state)(
			createAddress(`0x${'4200'.repeat(10)}`),
			numberToBytes(0, { size: 32 }),
			numberToBytes(420),
		)
		expect(await dumpCanonicalGenesis(state)()).toMatchInlineSnapshot()
	})
})
