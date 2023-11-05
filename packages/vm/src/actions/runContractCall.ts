import {
	encodeFunctionData,
	type EncodeFunctionDataParameters,
	decodeFunctionResult,
	toHex,
	type DecodeFunctionResultParameters,
	type DecodeFunctionResultReturnType,
	type Address,
} from 'viem'
import type { Abi } from 'abitype'
import type { EVMts } from '../evmts.js'
import { putAccount } from './putAccount.js'
import { runCall } from './runCall.js'

const defaultCaller = '0x0000000000000000000000000000000000000000'

export type RunContractCallParameters<
	TAbi extends Abi | readonly unknown[] = Abi,
	TFunctionName extends string = string,
> = EncodeFunctionDataParameters<TAbi, TFunctionName> & {
	contractAddress: Address,
	caller?: Address,
	gasLimit?: bigint,
}

// TODO we want to fill this out with everything that could go wrong via effect
export type RunContractCallError = Error

export type RunContractCallResult<
	TAbi extends Abi | readonly unknown[] = Abi,
	TFunctionName extends string = string,
> = {
	data: DecodeFunctionResultReturnType<TAbi, TFunctionName>,
}

const defaultGasLimit = BigInt(0xfffffffffffff)

export const runContractCall = async <
	TAbi extends Abi | readonly unknown[] = Abi,
	TFunctionName extends string = string,
>(evmts: EVMts, {
	abi,
	args,
	functionName,
	caller = defaultCaller,
	contractAddress,
	gasLimit = defaultGasLimit
}: RunContractCallParameters<TAbi, TFunctionName>): Promise<RunContractCallResult<TAbi, TFunctionName>> => {
	if (caller === defaultCaller) {
		await putAccount(evmts, { account: defaultCaller, balance: BigInt(0x11111111) })
	}

	const result = await runCall(evmts, {
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
		// TODO throw way more granular human readable errors
		throw result.execResult.exceptionError
	}

	return {
		data: decodeFunctionResult({
			abi,
			data: toHex(result.execResult.returnValue),
			functionName,
		} as unknown as DecodeFunctionResultParameters<TAbi>) as unknown as DecodeFunctionResultReturnType<TAbi, TFunctionName>,
	}
}
