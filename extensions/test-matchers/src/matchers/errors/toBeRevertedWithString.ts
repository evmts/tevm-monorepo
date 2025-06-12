import type { Client } from 'viem'
import type { ContainsTransactionAny } from '../../common/types.js'
import { handleTransaction } from './handleTransaction.js'

export const toBeRevertedWithString = async (
	received: ContainsTransactionAny | Promise<ContainsTransactionAny>,
	client: Client,
	expectedRevertString: string,
) => {
	const { error, isRevert, isError, revertString, revertReason } = await handleTransaction(received, { client })

	if (isError) {
		throw new Error('Expected transaction to be or not be reverted, but a different error was thrown', { cause: error })
	}

	const pass = isRevert && revertString !== undefined && revertString === expectedRevertString

	return {
		pass,
		actual: revertString,
		expected: expectedRevertString,
		message: () =>
			pass
				? `Expected transaction not to be reverted with revert string, but it reverted ${revertReason ? `with:\n\n${revertReason}` : 'without reason'}`
				: `Expected transaction to be reverted with revert string ${expectedRevertString}`,
	}
}
