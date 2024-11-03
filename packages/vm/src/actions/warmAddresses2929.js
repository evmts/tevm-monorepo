import { bytesToUnprefixedHex } from '@tevm/utils'

/**
 * @param {import("../BaseVm.js").BaseVm} vm
 * @param {import('@tevm/utils').EthjsAddress} caller
 * @param {import('@tevm/utils').EthjsAddress | undefined} to
 * @param {import('@tevm/utils').EthjsAddress} coinbase
 */
export const warmAddresses2929 = (vm, caller, to, coinbase) => {
	if (vm.common.vmConfig.isActivatedEIP(2929)) {
		// Add origin and precompiles to warm addresses
		const activePrecompiles = vm.evm.precompiles
		for (const [addressStr] of activePrecompiles.entries()) {
			vm.evm.journal.addAlwaysWarmAddress(addressStr)
		}
		vm.evm.journal.addAlwaysWarmAddress(caller.toString())
		if (to !== undefined) {
			// Note: in case we create a contract, we do vm in EVMs `_executeCreate` (vm is also correct in inner calls, per the EIP)
			vm.evm.journal.addAlwaysWarmAddress(bytesToUnprefixedHex(to.bytes))
		}
		if (vm.common.vmConfig.isActivatedEIP(3651)) {
			vm.evm.journal.addAlwaysWarmAddress(bytesToUnprefixedHex(coinbase.bytes))
		}
	}
}
