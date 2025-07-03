import type { TevmNode } from '@tevm/node'
import { AbiFunction, AbiItem } from 'ox'
import type { Abi, Client, ContractFunctionName, Hex } from 'viem'
import { isHex } from 'viem'
import type { MatcherResult } from '../../chainable/types.js'
import type { ContainsContractAbi, ContainsTransactionAny } from '../../common/types.js'
import { getSelectorToCalldataMap } from './getSelectorToCalldataMap.js'
import type { ToCallContractFunctionState } from './types.js'

// TODO: we might want to enforce the function call was made on the provided contract address (if provided)
// for which the 4byte trace won't be enough
export const toCallContractFunction = async <
	TAbi extends Abi | undefined = Abi | undefined,
	TFunctionName extends TAbi extends Abi ? ContractFunctionName<TAbi> : never = TAbi extends Abi
		? ContractFunctionName<TAbi>
		: never,
	TContract extends TAbi extends Abi ? ContainsContractAbi<TAbi> : never = TAbi extends Abi
		? ContainsContractAbi<TAbi>
		: never,
>(
	received: ContainsTransactionAny | Promise<ContainsTransactionAny>,
	client: Client | TevmNode,
	contractOrFunctionIdentifier: TContract | Hex | string,
	functionName?: TFunctionName,
): Promise<MatcherResult<ToCallContractFunctionState>> => {
	const calldataMap = await getSelectorToCalldataMap(client, received)

	if (typeof contractOrFunctionIdentifier === 'string') {
		const functionSelector = isHex(contractOrFunctionIdentifier)
			? contractOrFunctionIdentifier
			: AbiItem.getSelector(contractOrFunctionIdentifier)

		const pass = calldataMap.has(functionSelector)

		return {
			pass,
			actual: Array.from(calldataMap.keys()),
			expected: `transaction calling function with selector ${functionSelector}`,
			message: () =>
				pass
					? `Expected transaction not to call function ${contractOrFunctionIdentifier}`
					: `Expected transaction to call function ${contractOrFunctionIdentifier}`,
		}
	}

	if (typeof functionName !== 'string') throw new Error('You need to provide a function name as a third argument')
	const contract = contractOrFunctionIdentifier
	const abiFunction = AbiFunction.fromAbi(contract.abi, functionName as ContractFunctionName<typeof contract.abi>)
	const selector = AbiFunction.getSelector(abiFunction)

	const pass = calldataMap.has(selector)

	return {
		pass,
		actual: Array.from(calldataMap.keys()),
		expected: `transaction calling function with selector ${selector}`,
		message: () =>
			pass
				? `Expected transaction not to call function ${functionName}`
				: `Expected transaction to call function ${functionName}`,
		state: {
			abiFunction,
			selector,
			calldataMap,
		},
	}
}
