import type { EVMts } from '../evmts.js'
import { putContractCode } from './putContractCode.js'
import {
	type RunContractCallParameters,
	type RunContractCallResult,
	runContractCall,
} from './runContractCall.js'
import type { Abi } from 'abitype'
import { type Address, type EncodeFunctionDataParameters, type Hex } from 'viem'

export type RunScriptParameters<
	TAbi extends Abi | readonly unknown[] = Abi,
	TFunctionName extends string = string,
> = EncodeFunctionDataParameters<TAbi, TFunctionName> & {
	bytecode: Hex
	caller?: Address
}

// TODO we want to fill this out with everything that could go wrong via effect
export type RunScriptError = Error

export type RunScriptResult<
	TAbi extends Abi | readonly unknown[] = Abi,
	TFunctionName extends string = string,
> = RunContractCallResult<TAbi, TFunctionName>

export const runScript = async <
	TAbi extends Abi | readonly unknown[] = Abi,
	TFunctionName extends string = string,
>(
	evmts: EVMts,
	{
		bytecode,
		args,
		abi,
		caller,
		functionName,
	}: RunScriptParameters<TAbi, TFunctionName>,
): Promise<RunScriptResult<TAbi, TFunctionName>> => {
	const contractAddress = '0x00000000000000000000000000000000000000ff' as const
	await putContractCode(evmts, {
		contractAddress: '0x00000000000000000000000000000000000000ff',
		bytecode,
	})
	return runContractCall(evmts, {
		functionName,
		caller,
		args,
		contractAddress,
		abi,
	} as unknown as RunContractCallParameters<TAbi, TFunctionName>)
}
