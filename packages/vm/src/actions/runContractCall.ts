import type { EVMts } from '../evmts.js'
import { putAccountHandler } from './putAccount.js'
import { runCallHandler } from './runCall.js'
import type { Log } from '@ethereumjs/evm'
import type { Abi } from 'abitype'
import {
	type Address,
	type DecodeFunctionResultParameters,
	type DecodeFunctionResultReturnType,
	type EncodeFunctionDataParameters,
	decodeFunctionResult,
	encodeFunctionData,
	toHex,
} from 'viem'

const defaultCaller = '0x0000000000000000000000000000000000000000'

/**
 * EVMts action to execute a call on a contract
 */
export type RunContractCallAction<
	TAbi extends Abi | readonly unknown[] = Abi,
	TFunctionName extends string = string,
> = EncodeFunctionDataParameters<TAbi, TFunctionName> & {
	contractAddress: Address
	caller?: Address
	gasLimit?: bigint
}

// TODO we want to fill this out with everything that could go wrong via effect
export type RunContractCallError = Error

export type RunContractCallResult<
	TAbi extends Abi | readonly unknown[] = Abi,
	TFunctionName extends string = string,
> = {
	data: DecodeFunctionResultReturnType<TAbi, TFunctionName>
	gasUsed: BigInt
	logs: Log[]
}

const defaultGasLimit = BigInt(0xfffffffffffff)

export const runContractCallHandler = async <
	TAbi extends Abi | readonly unknown[] = Abi,
	TFunctionName extends string = string,
>(
	evmts: EVMts,
	{
		abi,
		args,
		functionName,
		caller = defaultCaller,
		contractAddress,
		gasLimit = defaultGasLimit,
	}: RunContractCallAction<TAbi, TFunctionName>,
): Promise<RunContractCallResult<TAbi, TFunctionName>> => {
	if (caller === defaultCaller) {
		await putAccountHandler(evmts, {
			account: defaultCaller,
			balance: BigInt(0x11111111),
		})
	}

	const result = await runCallHandler(evmts, {
		to: contractAddress,
		caller: caller,
		origin: caller,
		// pass lots of gas
		gasLimit,
		data: encodeFunctionData({
			abi,
			functionName,
			args,
		} as unknown as EncodeFunctionDataParameters<TAbi, TFunctionName>),
	})

	if (result.execResult.exceptionError) {
		// TODO Return the error instead of throwing
		throw result.execResult.exceptionError
	}

	return {
		gasUsed: result.execResult.executionGasUsed,
		logs: result.execResult.logs ?? [],
		data: decodeFunctionResult({
			abi,
			data: toHex(result.execResult.returnValue),
			functionName,
		} as unknown as DecodeFunctionResultParameters<TAbi>) as unknown as DecodeFunctionResultReturnType<
			TAbi,
			TFunctionName
		>,
	}
}
