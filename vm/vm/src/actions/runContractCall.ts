import type { Tevm } from '../tevm.js'
import { putAccountHandler } from './putAccount.js'
import { runCallHandler } from './runCall.js'
import type { Log } from '@ethereumjs/evm'
import type { Abi } from 'abitype'
import { Abi as ZAbi, Address as ZAddress } from 'abitype/zod'
import {
	type Address,
	type DecodeFunctionResultParameters,
	type DecodeFunctionResultReturnType,
	type EncodeFunctionDataParameters,
	decodeFunctionResult,
	encodeFunctionData,
	toHex,
} from 'viem'
import { z } from 'zod'

const defaultCaller = '0x0000000000000000000000000000000000000000'

export const RunContractCallActionValidator = z.object({
	abi: ZAbi.describe('The abi of the contract'),
	args: z
		.array(z.any())
		.optional()
		.describe('The arguments to pass to the function'),
	functionName: z
		.string()
		.optional()
		.describe('The name of the function to call'),
	caller: ZAddress.optional().describe('The address of the caller'),
	contractAddress: ZAddress.describe('The address of the contract'),
	gasLimit: z.bigint().optional().describe('The gas limit'),
})

/**
 * Tevm action to execute a call on a contract
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
	tevm: Tevm,
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
		await putAccountHandler(tevm, {
			account: defaultCaller,
			balance: BigInt(0x11111111),
		})
	}

	const result = await runCallHandler(tevm, {
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
