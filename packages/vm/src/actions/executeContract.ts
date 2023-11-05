import {
	type Hex,
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
import { putContractCode } from './putContractCode.js'
import { putAccount } from './putAccount.js'
import { runCall } from './runCall.js'

const defaultCaller = '0x0000000000000000000000000000000000000000'

export type ExecuteScriptParameters<
	TAbi extends Abi | readonly unknown[] = Abi,
	TFunctionName extends string = string,
> = EncodeFunctionDataParameters<TAbi, TFunctionName> & {
	bytecode: Hex,
	caller?: Address,
}

// TODO we want to fill this out with everything that could go wrong via effect
export type ExecuteScriptError = Error

export type ExecuteScriptResult<
	TAbi extends Abi | readonly unknown[] = Abi,
	TFunctionName extends string = string,
> = {
	data: DecodeFunctionResultReturnType<TAbi, TFunctionName>,
}

export const executeScript = async <
	TAbi extends Abi | readonly unknown[] = Abi,
	TFunctionName extends string = string,
>(evmts: EVMts, {
	abi,
	args,
	functionName,
	bytecode,
	caller,
}: ExecuteScriptParameters<TAbi, TFunctionName>): Promise<ExecuteScriptResult<TAbi, TFunctionName>> => {
	const encodedData = encodeFunctionData({
		abi,
		functionName,
		args,
	} as unknown as EncodeFunctionDataParameters<TAbi, TFunctionName>)
	const contractAddress = '0x00000000000000000000000000000000000000ff' as const
	await putContractCode(evmts, { contractAddress: '0x00000000000000000000000000000000000000ff', bytecode })
	if (!caller) {
		await putAccount(evmts, { account: defaultCaller, balance: BigInt(0x11111111) })
	}
	// hardcoding data atm
	const result = await runCall(evmts, {
		to: contractAddress,
		caller: caller ?? defaultCaller,
		origin: caller ?? defaultCaller,
		// pass lots of gas
		gasLimit: BigInt(0xfffffffffffff),
		data: encodedData,
	})

	if (result.execResult.exceptionError) {
		// TODO this is not good
		throw result.execResult.exceptionError

	}
	const data: DecodeFunctionResultReturnType<TAbi, TFunctionName> = decodeFunctionResult({
		abi,
		data: toHex(result.execResult.returnValue),
		functionName,
	} as unknown as DecodeFunctionResultParameters<TAbi>) as any

	return { data }
}
