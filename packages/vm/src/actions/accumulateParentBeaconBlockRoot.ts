import { EipNotEnabledError } from '@tevm/errors'
import { EthjsAccount, setLengthLeft, toBytes } from '@tevm/utils'
import type { BaseVm } from '../BaseVm.js'
import { parentBeaconBlockRootAddress } from './parentBeaconBlockRootAddress.js'

export const accumulateParentBeaconBlockRoot = (vm: BaseVm) => async (root: Uint8Array, timestamp: bigint) => {
	if (!vm.common.ethjsCommon.isActivatedEIP(4788)) {
		throw new EipNotEnabledError('Cannot call `accumulateParentBeaconBlockRoot`: EIP 4788 is not active')
	}
	// Save the parentBeaconBlockRoot to the beaconroot stateful precompile ring buffers
	// Remove debug logs and use hardcoded value for now
	// TODO: Fix param loading from common
	const historicalRootsLength = 8191n // BigInt(vm.common.ethjsCommon.param('vm', 'historicalRootsLength'))
	const timestampIndex = timestamp % historicalRootsLength
	const timestampExtended = timestampIndex + historicalRootsLength

	/**
	 * Note: (by Jochem)
	 * If we don't do this (put account if undefined / non-existant), block runner crashes because the beacon root address does not exist
	 * This is hence (for me) again a reason why it should /not/ throw if the address does not exist
	 * All ethereum accounts have empty storage by default
	 */

	if ((await vm.stateManager.getAccount(parentBeaconBlockRootAddress)) === undefined) {
		await vm.evm.journal.putAccount(parentBeaconBlockRootAddress, new EthjsAccount())
	}

	await vm.stateManager.putStorage(
		parentBeaconBlockRootAddress,
		setLengthLeft(toBytes(timestampIndex), 32),
		toBytes(timestamp),
	)
	await vm.stateManager.putStorage(parentBeaconBlockRootAddress, setLengthLeft(toBytes(timestampExtended), 32), root)
}
