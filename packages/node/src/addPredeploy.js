import { createAddress } from '@tevm/address'
import { createAccount, hexToBytes, keccak256 } from '@tevm/utils'

/**
 * @internal
 * Sets an account in the vm state manager. Used to set predeploys
 * Has significantly less validation than the setAccountHandler action
 * We don't reuse setAccountAction because of circular dependencies
 * All actions depend on this package.
 * @param {object} params
 * @param {import('@tevm/vm').Vm} params.vm
 * @param {bigint} [params.nonce]
 * @param {bigint} [params.balance]
 * @param {import('@tevm/utils').Hex} [params.storageRoot]
 * @param {import('@tevm/utils').Hex} [params.deployedBytecode]
 * @param {import('@tevm/utils').Address} params.address
 * @returns {Promise<void>}
 */
export const addPredeploy = async ({ vm, nonce, balance, storageRoot, deployedBytecode, address }) => {
	const ethjsAddress = createAddress(address)
	await vm.stateManager.putAccount(
		ethjsAddress,
		createAccount({
			...(nonce !== undefined ? { nonce } : {}),
			...(balance !== undefined ? { balance } : {}),
			...(storageRoot !== undefined ? { storageRoot } : {}),
			...(deployedBytecode !== undefined ? { codeHash: keccak256(deployedBytecode, 'bytes') } : {}),
		}),
	)
	if (deployedBytecode) {
		await vm.stateManager.putCode(ethjsAddress, hexToBytes(deployedBytecode))
	}
}
