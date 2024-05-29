import { EthjsAddress, bytesToHex, getAddress, toHex } from '@tevm/utils'
import { dumpStorage } from './dumpStorage.js'
import { getAccount } from './getAccount.js'
import { getContractCode } from './getContractCode.js'

// might be good to cache this to optimize perf and memory

/**
 * Dumps the state of the state manager as a {@link TevmState}
 * @type {import("../state-types/index.js").StateAction<'dumpCanonicalGenesis'>}
 */
export const dumpCanonicalGenesis = (baseState) => async () => {
	const {
		caches: { accounts },
	} = baseState

	/**
	 * @type {string[]}
	 */
	const accountAddresses = []
	accounts._orderedMapCache?.forEach((e) => {
		accountAddresses.push(e[0])
	})

	/**
	 * @type {import('../state-types/TevmState.js').TevmState}
	 */
	const state = {}

	for (const address of accountAddresses) {
		const hexAddress = getAddress(`0x${address}`)
		const ethAddress = EthjsAddress.fromString(hexAddress)
		const account = await getAccount(baseState, true)(ethAddress)

		if (account === undefined) {
			baseState.logger.debug({ address: hexAddress }, 'Warning: Account in accountAddresses not found')
		}
		if (account !== undefined) {
			const storage = await dumpStorage(baseState, true)(ethAddress)

			const deployedBytecode = await getContractCode(baseState, true)(ethAddress)

			const dump = {
				nonce: account.nonce,
				balance: account.balance,
				storageRoot: bytesToHex(account.storageRoot),
				codeHash: bytesToHex(account.codeHash),
				storage,
				...(baseState.caches.contracts.has(ethAddress) ? { deployedBytecode: toHex(deployedBytecode) } : {}),
			}

			baseState.logger.debug({ address: hexAddress, ...dump }, 'dumping address')

			state[hexAddress] = dump
		}
	}

	return state
}
