/**
 * Internal helper function to create an annotated error message
 * @param {string} msg Base error message
 * @param {import('@tevm/block').Block} block
 * @param {import('@tevm/tx').TypedTransaction | import('@tevm/tx').ImpersonatedTx} tx
 * @returns {string} Formatted error message
 */
export const errorMsg = (msg, block, tx) => {
	const blockErrorStr = 'errorStr' in block ? block.errorStr() : 'block'
	const txErrorStr = 'errorStr' in tx ? tx.errorStr() : 'tx'
	const errorMsg = `${msg} -> ${blockErrorStr} -> ${txErrorStr})`
	return errorMsg
}
