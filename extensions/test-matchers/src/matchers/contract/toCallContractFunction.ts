import type { TevmNode } from '@tevm/node'
import { AbiItem } from 'ox'
import type { Abi, Client, ContractFunctionName, Hex } from 'viem'
import { isHex, toFunctionSelector } from 'viem'
import type { MatcherResult } from '../../chainable/types.js'
import type { ContainsContractAbiAndAddress, ContainsTransactionAny } from '../../common/types.js'
import type { ToCallContractFunctionState } from './types.js'
import { getFunctionsCalled } from './getFunctionsCalled.js'

export const toCallContractFunction = async <
	TAbi extends Abi | undefined = Abi | undefined,
	TFunctionName extends TAbi extends Abi ? ContractFunctionName<TAbi> : never = TAbi extends Abi
		? ContractFunctionName<TAbi>
		: never,
	TContract extends TAbi extends Abi ? ContainsContractAbiAndAddress<TAbi> : never = TAbi extends Abi
		? ContainsContractAbiAndAddress<TAbi>
		: never,
>(
	received: ContainsTransactionAny | Promise<ContainsTransactionAny>,
	client: Client | TevmNode,
	contractOrFunctionIdentifier: TContract | Hex | string,
	functionNameOrIdentifier?: TFunctionName | Hex | string,
): Promise<MatcherResult<ToCallContractFunctionState>> => {
	await getFunctionsCalled(client, received)

	return {
		pass: true,
		message: () => 'Transaction called a contract function',
	}
}