/**
 * Returns the hardfork excluding the merge hf which has
 * no effect on the vm execution capabilities.
 *
 * This is particularly useful in executing/evaluating the transaction
 * when chain td is not available at many places to correctly set the
 * hardfork in for e.g. vm or txs or when the chain is not fully synced yet.
 *
 * @param {import('@tevm/common').Hardfork | string} hardfork
 * @param {import('@tevm/common').Hardfork | string} preMergeHf
 * @returns {string | import('@tevm/common').Hardfork}
 * @throws {never}
 */
export const execHardfork = (hardfork, preMergeHf) => {
	return hardfork !== 'paris' ? hardfork : preMergeHf
}
