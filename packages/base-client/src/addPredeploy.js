import { EthjsAccount, EthjsAddress } from '@tevm/utils'
import { hexToBytes, keccak256 } from '@tevm/utils'

/**
 * @internal
 * Sets an account in the vm state manager. Used to set predeploys
 * Has significantly less validation than the setAccountHandler action
 * We don't reuse setAccountAction because of circular dependencies
 * All actions depend on this package.
 * @param {object} params
 * @param {import('@tevm/vm').TevmVm} params.vm
 * @param {bigint} [params.nonce]
 * @param {bigint} [params.balance]
 * @param {import('@tevm/utils').Hex} [params.storageRoot]
 * @param {import('@tevm/utils').Hex} [params.deployedBytecode]
 * @param {import('@tevm/utils').Address} params.address
 * @returns {Promise<void>}
 */
export const addPredeploy = async ({
	vm,
	nonce,
	balance,
	storageRoot,
	deployedBytecode,
	address,
}) => {
	const ethjsAddress = new EthjsAddress(hexToBytes(address))
	await vm.stateManager.putAccount(
		ethjsAddress,
		new EthjsAccount(
			nonce,
			balance,
			storageRoot && hexToBytes(storageRoot),
			deployedBytecode && hexToBytes(keccak256(deployedBytecode)),
		),
	)
	if (deployedBytecode) {
		await vm.stateManager.putContractCode(
			ethjsAddress,
			hexToBytes(deployedBytecode),
		)
	}
	await vm.stateManager.checkpoint()
	await vm.stateManager.commit()
}
