import type { TevmNode } from '@tevm/node'
import { AbiFunction, AbiItem } from 'ox'
import type { Abi, Client, ContractFunctionName, Hex } from 'viem'
import { isHex } from 'viem'
import type { MatcherResult } from '../../chainable/types.js'
import type { ContainsContractAddressAndOptionalAbi, ContainsTransactionAny } from '../../common/types.js'
import { getSelectorToCalldataMap } from './getSelectorToCalldataMap.js'
import type { ToCallContractFunctionState } from './types.js'

export const toCallContractFunction = async <
	TAbi extends Abi | undefined = Abi | undefined,
	TFunctionName extends TAbi extends Abi ? ContractFunctionName<TAbi> : never = TAbi extends Abi
		? ContractFunctionName<TAbi>
		: never,
	TContract extends TAbi extends Abi ? ContainsContractAddressAndOptionalAbi<TAbi> : never = TAbi extends Abi
		? ContainsContractAddressAndOptionalAbi<TAbi>
		: never,
>(
	received: ContainsTransactionAny | Promise<ContainsTransactionAny>,
	client: Client | TevmNode,
	contract: TContract,
	functionIdentifier: TFunctionName | Hex | string,
): Promise<MatcherResult<ToCallContractFunctionState>> => {
	if (!contract.address) throw new Error('You need to provide a contract address')
	const calldataMap = await getSelectorToCalldataMap(client, contract.address, received)

	// If it's a selector or signature
	if (isHex(functionIdentifier) || functionIdentifier.includes('function') || functionIdentifier.includes('(')) {
		const functionSelector = isHex(functionIdentifier) ? functionIdentifier : AbiItem.getSelector(functionIdentifier)

		const pass = calldataMap.has(functionSelector)

		return {
			pass,
			actual: Array.from(calldataMap.keys()),
			expected: `transaction calling function with selector ${functionSelector}`,
			message: () =>
				pass
					? `Expected transaction not to call function ${functionIdentifier}`
					: `Expected transaction to call function ${functionIdentifier}`,
		}
	}

	if (!contract.abi) throw new Error('You need to provide a contract ABI if you want to match a function name')
	const abiFunction = AbiFunction.fromAbi(contract.abi, functionIdentifier)
	const selector = AbiFunction.getSelector(abiFunction)

	const pass = calldataMap.has(selector)

	return {
		pass,
		actual: Array.from(calldataMap.keys()),
		expected: `transaction calling function with selector ${selector}`,
		message: () =>
			pass
				? `Expected transaction not to call function ${functionIdentifier}`
				: `Expected transaction to call function ${functionIdentifier}`,
		state: {
			abiFunction,
			selector,
			calldataMap,
		},
	}
}
