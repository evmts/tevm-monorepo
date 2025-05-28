import { Block } from '@tevm/block'
import { BlockGasLimitExceededError, EipNotEnabledError, MisconfiguredClientError } from '@tevm/errors'
import { Capability } from '@tevm/tx'
import { errorMsg } from './errorMessage.js'
import { execHardfork } from './execHardfork.js'

/**
 * @param {import("../BaseVm.js").BaseVm} vm
 */
export const validateRunTx = (vm) => {
	/**
	 * @param {import("../utils/RunTxOpts.js").RunTxOpts} opts
	 */
	const validateOpts = async (opts) => {
		const _opts =
			/**
			 * @type {import("../utils/RunTxOpts.js").RunTxOpts & Required<Pick<import("../utils/RunTxOpts.js").RunTxOpts, "block" | "preserveJournal">>}
			 */
			{
				...opts,
				block: opts.block !== undefined ? opts.block : Block.fromBlockData({ header: {} }, { common: vm.common }),
				preserveJournal: opts.preserveJournal ?? false,
			}

		if (_opts.skipHardForkValidation !== true) {
			// Find and set preMerge hf for easy access later
			const hfs = /** @type {any} */ (vm.common).ethjsCommon.hardforks()
			const preMergeIndex = hfs.findIndex((/** @type {any} */ hf) => hf.ttd !== null && hf.ttd !== undefined) - 1
			// If no pre merge hf found, set it to first hf even if its merge
			const preMergeHf = preMergeIndex >= 0 ? hfs[preMergeIndex]?.name : hfs[0]?.name

			if (!preMergeHf) {
				const msg = errorMsg('no preMerge hardfork found', _opts.block, _opts.tx)
				throw new MisconfiguredClientError(msg)
			}

			// If block and tx don't have a same hardfork, set tx hardfork to block
			if (
				execHardfork(_opts.tx.common.hardfork(), preMergeHf) !==
				execHardfork(_opts.block.common.ethjsCommon.hardfork(), preMergeHf)
			) {
				_opts.tx.common.setHardfork(_opts.block.common.ethjsCommon.hardfork())
			}
			if (
				execHardfork(_opts.block.common.ethjsCommon.hardfork(), preMergeHf) !==
				execHardfork(vm.common.ethjsCommon.hardfork(), preMergeHf)
			) {
				// Block and VM's hardfork should match as well
				const msg = errorMsg('block has a different hardfork than the vm', _opts.block, _opts.tx)
				throw new MisconfiguredClientError(msg)
			}
		}

		if (_opts.skipBlockGasLimitValidation !== true && _opts.block.header.gasLimit < _opts.tx.gasLimit) {
			const msg = errorMsg('tx has a higher gas limit than the block', _opts.block, _opts.tx)
			throw new BlockGasLimitExceededError(msg)
		}
		// Typed transaction specific setup tasks
		if (_opts.tx.supports(Capability.EIP2718TypedTransaction) && vm.common.ethjsCommon.isActivatedEIP(2718)) {
			// Is it an Access List transaction?
			if (!vm.common.ethjsCommon.isActivatedEIP(2930)) {
				await vm.evm.journal.revert()
				const msg = errorMsg('Cannot run transaction: EIP 2930 is not activated.', _opts.block, _opts.tx)
				throw new EipNotEnabledError(msg)
			}
			if (_opts.tx.supports(Capability.EIP1559FeeMarket) && !vm.common.ethjsCommon.isActivatedEIP(1559)) {
				await vm.evm.journal.revert()
				const msg = errorMsg('Cannot run transaction: EIP 1559 is not activated.', _opts.block, _opts.tx)
				throw new EipNotEnabledError(msg)
			}
		}

		return _opts
	}
	return validateOpts
}
