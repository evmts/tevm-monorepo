import { z } from 'zod'
import type { EVMts } from '../evmts.js'
import { putContractCodeHandler } from './putContractCode.js'
import {
	type RunContractCallAction,
	type RunContractCallResult,
	runContractCallHandler,
} from './runContractCall.js'
import type { Abi } from 'abitype'
import { Abi as ZAbi, Address as ZAddress } from 'abitype/zod'
import { type Address, type EncodeFunctionDataParameters, type Hex } from 'viem'
import { ZHex } from '../utils/zod.js'

export const RunScriptActionValidator = z.object({
	deployedBytecode: ZHex.describe('The deployed bytecode of the contract'),
	caller: ZAddress.optional().describe('The address of the caller'),
	args: z.array(z.any()).optional().describe('The arguments to pass to the function'),
	abi: ZAbi.describe('The abi of the contract'),
	functionName: z.string().describe('The name of the function to call'),
}).describe('Action to run a script or contract')

/**
 * EVMts action to deploy and execute a script or contract
 */
export type RunScriptAction<
	TAbi extends Abi | readonly unknown[] = Abi,
	TFunctionName extends string = string,
> = EncodeFunctionDataParameters<TAbi, TFunctionName> & {
	deployedBytecode: Hex
	caller?: Address
}

// TODO we want to fill this out with everything that could go wrong via effect
export type RunScriptError = Error

export type RunScriptResult<
	TAbi extends Abi | readonly unknown[] = Abi,
	TFunctionName extends string = string,
> = RunContractCallResult<TAbi, TFunctionName>

export const runScriptHandler = async <
	TAbi extends Abi | readonly unknown[] = Abi,
	TFunctionName extends string = string,
>(
	evmts: EVMts,
	{
		deployedBytecode,
		args,
		abi,
		caller,
		functionName,
	}: RunScriptAction<TAbi, TFunctionName>,
): Promise<RunScriptResult<TAbi, TFunctionName>> => {
	const contractAddress = '0x00000000000000000000000000000000000000ff' as const
	await putContractCodeHandler(evmts, {
		contractAddress: '0x00000000000000000000000000000000000000ff',
		deployedBytecode,
	})
	return runContractCallHandler(evmts, {
		functionName,
		caller,
		args,
		contractAddress,
		abi,
	} as unknown as RunContractCallAction<TAbi, TFunctionName>)
}
