import { ContractDoesNotExistError } from './errors/index.js'
import { putAccountHandler } from './putAccountHandler.js'
import { runCallHandler } from './runCallHandler.js'
import { Address } from '@ethereumjs/util'
import { DEFAULT_CALLER, DEFAULT_GAS_LIMIT } from '@tevm/actions'
import { decodeFunctionResult, encodeFunctionData, toHex } from 'viem'

/**
 * @type {import("./RunContractCallHandlerGeneric.js").RunContractCallHandlerGeneric}
 */
export const runContractCallHandler = async (
	evm,
	{
		abi,
		args,
		functionName,
		caller = DEFAULT_CALLER,
		contractAddress,
		gasLimit = DEFAULT_GAS_LIMIT,
	},
) => {
	if (caller === DEFAULT_CALLER) {
		await putAccountHandler(evm, {
			account: DEFAULT_CALLER,
			balance: BigInt(0x11111111),
		})
	}

	// check early if contract exists
	const contract = await evm.stateManager.getContractCode(
		Address.fromString(contractAddress),
	)
	if (contract.length === 0) {
		throw new ContractDoesNotExistError(contractAddress)
	}

	const result = await runCallHandler(evm, {
		to: contractAddress,
		caller: caller,
		origin: caller,
		// pass lots of gas
		gasLimit,
		data: encodeFunctionData(
			/** @type {any} */ ({
				abi,
				functionName,
				args,
			}),
		),
	})

	if (result.execResult.exceptionError) {
		// TODO Return the error instead of throwing
		throw result.execResult.exceptionError
	}

	return {
		gasUsed: result.execResult.executionGasUsed,
		logs: result.execResult.logs ?? [],
		data: decodeFunctionResult(
			/** @type any */ ({
				abi,
				data: toHex(result.execResult.returnValue),
				functionName,
			}),
		),
	}
}
