import { type Client } from '@tevm/utils'
import type { ContainsTransactionAny } from '../../common/types.js'
import { handleTransaction } from './handleTransaction.js'

// Vitest-style matcher function
// TODO: when we do With... we want to be able to say for instance "Expected tx to revert with error ... but instead it reverted with error ..."
export const toBeReverted = async (
	received: ContainsTransactionAny | Promise<ContainsTransactionAny>,
	client?: Client,
) => {
	const { error, isRevert, isError, revertReason } = await handleTransaction(received, { client })

	if (isError) {
		throw new Error('Expected transaction to be or not be reverted, but a different error was thrown', { cause: error })
	}

	return {
		pass: isRevert,
		message: () =>
			isRevert
				? `Expected transaction not to be reverted, but it reverted${revertReason ? ` with:\n\n${revertReason}` : ' without reason'}`
				: `Expected transaction to be reverted, but it didn't`,
	}
}
