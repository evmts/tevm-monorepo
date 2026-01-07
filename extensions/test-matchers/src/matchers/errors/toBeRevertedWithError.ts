import { type Abi, type AbiError, type Client, type ContractErrorName, type Hex, isHex } from '@tevm/utils'
import { AbiItem } from 'ox'
import type { MatcherResult } from '../../chainable/types.js'
import type { ContainsContractAbi, ContainsTransactionAny } from '../../common/types.js'
import { handleTransaction } from './handleTransaction.js'
import type { ToBeRevertedWithState } from './types.js'

export const toBeRevertedWithError = async <
	TAbi extends Abi | undefined = Abi | undefined,
	TErrorName extends TAbi extends Abi ? ContractErrorName<TAbi> : never = TAbi extends Abi
		? ContractErrorName<TAbi>
		: never,
	TContract extends TAbi extends Abi ? ContainsContractAbi<TAbi> : never = TAbi extends Abi
		? ContainsContractAbi<TAbi>
		: never,
>(
	received: ContainsTransactionAny | Promise<ContainsTransactionAny>,
	client: Client,
	contractOrErrorIdentifier: TContract | Hex | string,
	errorName?: TErrorName,
): Promise<MatcherResult<ToBeRevertedWithState>> => {
	const { error, isRevert, isError, revertReason, decodedRevertData, rawRevertData } = await handleTransaction(
		received,
		{ client },
	)

	if (isError) {
		throw new Error('Expected transaction to be or not be reverted, but a different error was thrown', { cause: error })
	}

	const actualSelector = decodedRevertData
		? AbiItem.getSelector(decodedRevertData.abiItem)
		: rawRevertData?.slice(0, 10)
	if (actualSelector === undefined) throw new Error('Could not get selector from revert data')

	// Handle error signature or selector
	if (typeof contractOrErrorIdentifier === 'string') {
		const errorSelector = isHex(contractOrErrorIdentifier)
			? contractOrErrorIdentifier
			: AbiItem.getSelector(
					contractOrErrorIdentifier.startsWith('error')
						? contractOrErrorIdentifier
						: `error ${contractOrErrorIdentifier}`,
				)

		const pass = isRevert && actualSelector === errorSelector

		return {
			pass,
			actual: actualSelector,
			expected: errorSelector,
			message: () =>
				pass
					? `Expected transaction not to be reverted with ${contractOrErrorIdentifier.startsWith('0x') ? 'selector' : 'signature'} ${contractOrErrorIdentifier}, but it reverted ${revertReason ? `with:\n\n${revertReason}` : 'without reason'}`
					: `Expected transaction to be reverted with ${contractOrErrorIdentifier.startsWith('0x') ? 'selector' : 'signature'} ${contractOrErrorIdentifier}`,
			state: {
				decodedRevertData,
				rawRevertData,
			},
		}
	}

	// Contract + error name case
	if (typeof errorName !== 'string') throw new Error('You need to provide an error name as a second argument')
	const contract = contractOrErrorIdentifier
	const errorAbi = contract.abi.find((item): item is AbiError => item.type === 'error' && item.name === errorName)

	if (!errorAbi)
		throw new Error(
			`Error ${errorName} not found in contract ABI. Please make sure you've compiled the latest version before running the test.`,
		)

	const pass = isRevert && actualSelector === AbiItem.getSelector(errorAbi)

	return {
		pass,
		actual: `error ${decodedRevertData?.errorName ?? rawRevertData?.slice(0, 10)}`,
		expected: `error ${errorName}`,
		message: () =>
			pass
				? `Expected transaction not to be reverted with error ${errorName}, but it reverted ${revertReason ? `with:\n\n${revertReason}` : 'without reason'}`
				: `Expected transaction to be reverted with error ${errorName}`,
		state: {
			decodedRevertData,
			rawRevertData,
			contract,
		},
	}
}
