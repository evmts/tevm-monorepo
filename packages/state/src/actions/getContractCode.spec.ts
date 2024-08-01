import { createAddress } from '@tevm/address'
import { SimpleContract, transports } from '@tevm/test-utils'
import { hexToBytes } from '@tevm/utils'
import { describe, expect, it } from 'vitest'
import { createBaseState } from '../createBaseState.js'
import { getContractCode } from './getContractCode.js'
import { putContractCode } from './putContractCode.js'

const contract = SimpleContract.withAddress(`0x${'69'.repeat(20)}`)

describe(getContractCode.name, () => {
	it('should return contract code from state', async () => {
		const state = createBaseState({})
		await putContractCode(state)(createAddress(contract.address), hexToBytes(contract.deployedBytecode))
		expect(await getContractCode(state)(createAddress(contract.address))).toEqual(hexToBytes(contract.deployedBytecode))
	})

	it('should return Empty bytes if no contract exists', async () => {
		const state = createBaseState({})
		expect(await getContractCode(state)(createAddress(contract.address))).toEqual(new Uint8Array())
	})

	it('should fetch and cache from live chain if in forked mode', async () => {
		const state = createBaseState({
			fork: {
				transport: transports.optimism,
			},
		})
		const tokenAddress = createAddress(`0x42${'0'.repeat(36)}42`)
		const code = await getContractCode(state)(tokenAddress)
		expect(code).toMatchSnapshot()
		expect(state.caches.contracts.get(tokenAddress)).toBe(code)
	})

	it('should return empty bytes of the contract doesn not exist on forked chain. It should still cache the result', async () => {
		const state = createBaseState({
			fork: {
				transport: transports.optimism,
			},
		})
		const emptyAddress = createAddress(`0x${'7654'.repeat(10)}`)
		const code = await getContractCode(state)(emptyAddress)
		expect(code).toEqual(new Uint8Array())
		expect(state.caches.contracts.has(emptyAddress)).toBe(true)
		expect(await getContractCode(state)(emptyAddress)).toEqual(new Uint8Array())
	})

	it('supports skipping fetching from fork', async () => {
		const state = createBaseState({
			fork: {
				transport: transports.optimism,
			},
		})
		const tokenAddress = createAddress(`0x42${'0'.repeat(36)}42`)
		const skipFetching = true
		const code = await getContractCode(state, skipFetching)(tokenAddress)
		expect(code).toEqual(new Uint8Array())
		// shouldn't cache it if we skipped
		expect(state.caches.contracts.has(tokenAddress)).toBe(false)
	})
})
