import type { TevmNode } from '@tevm/node'
import { AbiItem } from 'ox'
import type { Abi, Client, ContractFunctionName, Hex } from 'viem'
import { isHex, toFunctionSelector } from 'viem'
import type { MatcherResult } from '../../chainable/types.js'
import type { ContainsContractAbiAndAddress, ContainsTransactionAny } from '../../common/types.js'
import { handleTransaction } from './handleTransaction.js'
import type { ToCallContractFunctionState } from './types.js'

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
	try {
		// Handle function signature or selector cases (contract not provided)
		if (typeof contractOrFunctionIdentifier === 'string') {
			throw new Error('Contract object with ABI and address is required for function call detection')
		}

		// Contract + function name case
		if (typeof functionNameOrIdentifier !== 'string') {
			throw new Error('You need to provide a function name as a second argument')
		}

		const contract = contractOrFunctionIdentifier
		const functionIdentifier = functionNameOrIdentifier

		// Find function in ABI
		let expectedFunctionAbi: any
		let expectedSelector: Hex

		if (isHex(functionIdentifier)) {
			// Function selector provided
			expectedSelector = functionIdentifier
			expectedFunctionAbi = contract.abi.find(
				(item) => item.type === 'function' && toFunctionSelector(item) === functionIdentifier,
			)
		} else if (functionIdentifier.includes('(')) {
			// Function signature provided
			expectedSelector = AbiItem.getSelector(
				functionIdentifier.startsWith('function') ? functionIdentifier : `function ${functionIdentifier}`,
			)
			expectedFunctionAbi = contract.abi.find(
				(item) => item.type === 'function' && toFunctionSelector(item) === expectedSelector,
			)
		} else {
			// Function name provided
			expectedFunctionAbi = contract.abi.find((item) => item.type === 'function' && item.name === functionIdentifier)
			if (!expectedFunctionAbi) {
				throw new Error(
					`Function ${functionIdentifier} not found in contract ABI. Please make sure you've compiled the latest version before running the test.`,
				)
			}
			expectedSelector = toFunctionSelector(expectedFunctionAbi)
		}

		if (!expectedFunctionAbi) {
			throw new Error(
				`Function ${functionIdentifier} not found in contract ABI. Please make sure you've compiled the latest version before running the test.`,
			)
		}

		// Process the transaction
		const { transactionTo, rawFunctionData, decodedFunctionData } = await handleTransaction(received, {
			client,
			contract,
		})

		// Check if transaction was sent to the expected contract
		const addressMatch = transactionTo?.toLowerCase() === contract.address.toLowerCase()
		if (!addressMatch) {
			return {
				pass: false,
				actual: transactionTo ? `transaction to ${transactionTo}` : 'transaction with no recipient',
				expected: `transaction to ${contract.address}`,
				message: () =>
					`Expected transaction to call function ${expectedFunctionAbi.name} on contract ${contract.address}, but transaction was sent to ${transactionTo || 'unknown address'}`,
				state: {
					decodedFunctionData,
					rawFunctionData,
					contract,
					transactionTo,
				},
			}
		}

		// Check if the function was called
		const actualSelector = rawFunctionData?.slice(0, 10)
		const selectorMatch = actualSelector === expectedSelector

		if (!selectorMatch) {
			return {
				pass: false,
				actual: decodedFunctionData?.functionName
					? `function ${decodedFunctionData.functionName}`
					: actualSelector || 'unknown function',
				expected: `function ${expectedFunctionAbi.name}`,
				message: () =>
					`Expected transaction to call function ${expectedFunctionAbi.name} on contract ${contract.address}, but it called ${decodedFunctionData?.functionName || 'a different function'}`,
				state: {
					decodedFunctionData,
					rawFunctionData,
					contract,
					transactionTo,
				},
			}
		}

		// Success case
		return {
			pass: true,
			actual: `function ${decodedFunctionData?.functionName || expectedFunctionAbi.name}`,
			expected: `function ${expectedFunctionAbi.name}`,
			message: () =>
				`Expected transaction not to call function ${expectedFunctionAbi.name} on contract ${contract.address}, but it did`,
			state: {
				decodedFunctionData,
				rawFunctionData,
				contract,
				transactionTo,
			},
		}
	} catch (error) {
		throw new Error('Expected transaction to call a contract function, but a different error was thrown', {
			cause: error,
		})
	}
}