import { EthjsAccount, EthjsAddress, numberToHex, setLengthLeft, toBytes } from '@tevm/utils'

import { EipNotEnabledError } from '@tevm/errors'
import type { BaseVm } from '../BaseVm.js'

/**
 * This method runs the logic of EIP 2935 (save blockhashes to state)
 * It will put the `parentHash` of the block to the storage slot of `block.number - 1` of the history storage contract.
 * This contract is used to retrieve BLOCKHASHes in EVM if EIP 2935 is activated.
 * In case that the previous block of `block` is pre-EIP-2935 (so we are on the EIP 2935 fork block), additionally
 * also add the currently available past blockhashes which are available by BLOCKHASH (so, the past 256 block hashes)
 * @param this The VM to run on
 * @param block The current block to save the parent block hash of
 */
export const accumulateParentBlockHash = (vm: BaseVm) => async (currentBlockNumber: bigint, parentHash: Uint8Array) => {
	if (!vm.common.ethjsCommon.isActivatedEIP(2935)) {
		throw new EipNotEnabledError('Cannot call `accumulateParentBlockHash`: EIP 2935 is not active')
	}
	const historyAddress = EthjsAddress.fromString(
		numberToHex(vm.common.ethjsCommon.param('vm', 'historyStorageAddress')),
	)
	const historyServeWindow = vm.common.ethjsCommon.param('vm', 'historyServeWindow')

	// Is this the fork block?
	const forkTime = vm.common.ethjsCommon.eipTimestamp(2935)
	if (forkTime === null) {
		throw new EipNotEnabledError('EIP 2935 should be activated by timestamp')
	}

	if ((await vm.stateManager.getAccount(historyAddress)) === undefined) {
		await vm.evm.journal.putAccount(historyAddress, new EthjsAccount())
	}

	async function putBlockHash(vm: BaseVm, hash: Uint8Array, number: bigint) {
		// ringKey is the key the hash is actually put in (it is a ring buffer)
		const ringKey = number % historyServeWindow
		const key = setLengthLeft(toBytes(ringKey), 32)
		await vm.stateManager.putContractStorage(historyAddress, key, hash)
	}
	await putBlockHash(vm, parentHash, currentBlockNumber - 1n)

	const parentBlock = await vm.blockchain.getBlock(parentHash)

	// If on the fork block, store the old block hashes as well
	if (parentBlock.header.timestamp < forkTime) {
		let ancestor = parentBlock
		for (let i = 0; i < Number(historyServeWindow) - 1; i++) {
			if (ancestor.header.number === 0n) {
				break
			}

			ancestor = await vm.blockchain.getBlock(ancestor.header.parentHash)
			await putBlockHash(vm, ancestor.hash(), ancestor.header.number)
		}
	}
}
