import { Account, Address } from '@ethereumjs/util'
import { EVM } from "@ethereumjs/evm"
import {
	type Hex,
	hexToBytes,
	encodeFunctionData,
	type EncodeFunctionDataParameters,
} from 'viem'
import type { Abi } from 'abitype'

const defaultCaller = new Address(hexToBytes('0x0000000000000000000000000000000000000000'))

export type ExecuteParameters<
	TAbi extends Abi | readonly unknown[] = Abi,
	TFunctionName extends string = string,
> = EncodeFunctionDataParameters<TAbi, TFunctionName> & {
	bytecode: Hex,
	rpcUrl: string,
	blockTag?: bigint,
	caller?: Address,
}

export const execute = async <
	TAbi extends Abi | readonly unknown[] = Abi,
	TFunctionName extends string = string,
>(evm: EVM, {
	abi,
	args,
	functionName,
	bytecode,
	caller,
}: ExecuteParameters<TAbi, TFunctionName>) => {
	const encodedData = Buffer.from(encodeFunctionData({
		abi,
		functionName,
		args,
	} as unknown as EncodeFunctionDataParameters<TAbi, TFunctionName>).slice(2), 'hex')
	const contractAddress = new Address(hexToBytes('0x00000000000000000000000000000000000000ff'))
	await evm.stateManager.putContractCode(contractAddress, hexToBytes(bytecode))
	if (!caller) {
		await evm.stateManager.putAccount(defaultCaller, new Account(BigInt(0), BigInt(0x11111111)))
	}
	// hardcoding data atm
	const result = await evm.runCall({
		to: contractAddress,
		caller: caller ?? defaultCaller,
		origin: caller ?? defaultCaller,
		// pass lots of gas
		gasLimit: BigInt(0xfffffffffffff),
		data: encodedData,
	})

	return result
}
