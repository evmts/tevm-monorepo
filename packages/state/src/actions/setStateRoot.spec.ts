import { EthjsAddress, bytesToHex } from '@tevm/utils'
import { hexToBytes } from 'ethereum-cryptography/utils'
import { describe, expect, it } from 'vitest'
import { createBaseState } from '../createBaseState.js'
import { getAccount } from './getAccount.js'
import { NoStateRootExistsError, setStateRoot } from './setStateRoot.js'

describe(setStateRoot.name, () => {
	it('should set state root', async () => {
		const address = `0x${'01'.repeat(20)}` as const
		const baseState = createBaseState({
			loggingLevel: 'warn',
		})
		await baseState.ready()
		const root = hexToBytes(`0x${'11'.repeat(32)}`)
		baseState.stateRoots.set(bytesToHex(root), {
			[address]: {
				balance: 420n,
				nonce: 1n,
				storageRoot: '0x69',
				codeHash: '0x420',
			},
		})
		await setStateRoot(baseState)(root)
		const account = await getAccount(baseState)(EthjsAddress.fromString(address))
		expect(account?.balance).toBe(420n)
	})

	it('should throw if no state root exists', async () => {
		const baseState = createBaseState({
			loggingLevel: 'warn',
		})
		await baseState.ready()
		const root = hexToBytes(`0x${'11'.repeat(32)}`)
		const err = await setStateRoot(baseState)(root).catch((e) => e)
		expect(err).toBeInstanceOf(NoStateRootExistsError)
		expect(err).toMatchSnapshot()
	})
})
