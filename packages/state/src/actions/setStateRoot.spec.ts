import { EthjsAddress, bytesToHex } from '@tevm/utils'
import { hexToBytes } from 'ethereum-cryptography/utils'
import { describe, expect, it, vi } from 'vitest'
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

	it('should log debug information about state root', async () => {
		const baseState = createBaseState({
			loggingLevel: 'debug',
		})
		await baseState.ready()
		const root = hexToBytes(`0x${'11'.repeat(32)}`)
		const rootHex = bytesToHex(root)

		// Setup a state root
		const stateValue = {
			[`0x${'01'.repeat(20)}`]: {
				balance: 42n,
				nonce: 1n,
				storageRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421' as const,
				codeHash: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470' as const,
			},
		}
		baseState.stateRoots.set(rootHex, stateValue)

		// Set the state root
		await setStateRoot(baseState)(root)
	})
})
