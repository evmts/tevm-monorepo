import { EipNotEnabledError } from '@tevm/errors'
import { createAccount, createAddressFromString, setLengthLeft, toBytes } from '@tevm/utils'
import type { BaseVm } from '../BaseVm.js'

/**
 * This method runs the logic of EIP 2935 (save blockhashes to state)
 * It will put the `parentHash` of the block to the storage slot of `block.number - 1` of the history storage contract.
 * This contract is used to retrieve BLOCKHASHes in EVM if EIP 2935 is activated.
 * @param vm The VM to run on
 * @returns Function that accumulates parent block hash
 */
export const accumulateParentBlockHash = (vm: BaseVm) => async (currentBlockNumber: bigint, parentHash: Uint8Array) => {
	if (!(vm.common as any).ethjsCommon.isActivatedEIP(2935)) {
		throw new EipNotEnabledError('Cannot call `accumulateParentBlockHash`: EIP 2935 is not active')
	}
	const historyAddress = createAddressFromString(getHistoryStorageAddress(vm))
	const historyServeWindow = getHistoryServeWindow(vm)

	if ((await vm.stateManager.getAccount(historyAddress)) === undefined) {
		await vm.evm.journal.putAccount(historyAddress, createAccount({}) as any)
	}

	async function putBlockHash(vm: BaseVm, hash: Uint8Array, number: bigint) {
		// ringKey is the key the hash is actually put in (it is a ring buffer)
		const ringKey = number % historyServeWindow
		const key = setLengthLeft(toBytes(Number(ringKey)), 32)
		await vm.stateManager.putStorage(historyAddress, key, hash)
	}
	await putBlockHash(vm, parentHash, currentBlockNumber - 1n)
}

const defaultHistoryStorageAddress = '0x0000F90827F1C53a10cb7A02335B175320002935'
const defaultHistoryServeWindow = 8191n

const getHistoryStorageAddress = (vm: BaseVm) => {
	try {
		const address = (vm.common as any).ethjsCommon.param('historyStorageAddress')
		return typeof address === 'string' ? address : defaultHistoryStorageAddress
	} catch {
		return defaultHistoryStorageAddress
	}
}

const getHistoryServeWindow = (vm: BaseVm) => {
	try {
		const window = (vm.common as any).ethjsCommon.param('historyServeWindow')
		return typeof window === 'bigint' || typeof window === 'number' ? BigInt(window) : defaultHistoryServeWindow
	} catch {
		return defaultHistoryServeWindow
	}
}
