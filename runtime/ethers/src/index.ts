import type { EvmtsContract } from '@evmts/core'
import type { Abi, AbiParametersToPrimitiveTypes, Address, ExtractAbiFunction, ExtractAbiFunctionNames, FormatAbi } from 'abitype'
// TODO import in more code splittable way once first version of this is done
// doing this just to move faster for now with that sweet sweet intellisense
import { BaseContract, ContractTransactionResponse, ethers, FunctionFragment, type ContractTransaction, Result, Typed, type Overrides } from 'ethers'

export type ContractMethodArgs<A extends ReadonlyArray<any>> = [...A, Overrides] | A

// TODO make chainId typesafe
// TODO make the type take string numbers too
type CreateEthersContractOptions<TChainIds extends number> = {
	chainId: TChainIds
	runner: ethers.ContractRunner
} | {
	address: Address
	runner: ethers.ContractRunner
}
export type BaseContractMethod<
	TArguments extends ReadonlyArray<any> = ReadonlyArray<any>,
	TReturnType = any,
	TExtendedReturnType extends TReturnType | ContractTransactionResponse = ContractTransactionResponse,
> = {

	// The main function
	(...args: ContractMethodArgs<TArguments>): Promise<TReturnType | TExtendedReturnType>;

	// Function name
	name: string;

	// Reference to the contract
	_contract: BaseContract;

	// The key it was created with
	_key: string;

	// Additional methods and properties
	getFragment: (...args: ContractMethodArgs<TArguments>) => FunctionFragment;
	estimateGas: (...args: ContractMethodArgs<TArguments>) => Promise<bigint>;
	populateTransaction: (...args: ContractMethodArgs<TArguments>) => Promise<ContractTransaction>;
	send: (...args: ContractMethodArgs<TArguments>) => Promise<ContractTransactionResponse>;
	staticCall: (...args: ContractMethodArgs<TArguments>) => Promise<TReturnType>;
	staticCallResult: (...args: ContractMethodArgs<TArguments>) => Promise<Result>;

	// The function fragment property
	readonly fragment: FunctionFragment;
} & ((...args: ContractMethodArgs<TArguments>) => Promise<TReturnType | TExtendedReturnType>);

type TypesafeEthersContract<TAbi extends Abi> = BaseContract & {
	[TFunctionName in ExtractAbiFunctionNames<TAbi, 'pure' | 'view' | 'nonpayable' | 'payable'>]: BaseContractMethod<
		AbiParametersToPrimitiveTypes<ExtractAbiFunction<TAbi, TFunctionName>['inputs']> & any[],
		// this is not a super robust way of doing this but should work for an initial release
		// this likely will have rough edges in non happy cases like the abi not being readable as const
		AbiParametersToPrimitiveTypes<ExtractAbiFunction<TAbi, TFunctionName>['outputs']>[0]
	>
}

/**
 * Create an ethers contract from an evmts contract
 * @example
 * import {MyContract} from './MyContract'
 * import {providers} from 'ethers'
 * const provider = new providers.JsonRpcProvider('http://localhost:8545')
 * const contract = createEthersContract(myContract, {chainId: 1, runner: provider})
 */
export const createEthersContract = <
	TName extends string,
	TAddresses extends Record<number, Address>,
	TAbi extends Abi,
	THumanReadableAbi = FormatAbi<TAbi>,
>(
	contract: EvmtsContract<TName, TAddresses, TAbi, THumanReadableAbi>,
	options: CreateEthersContractOptions<number | (keyof TAddresses & number)>,
): TypesafeEthersContract<TAbi> => {
	if ('address' in options) {
		return new ethers.Contract(
			options.address,
			new ethers.Interface(contract.abi as any),
			options.runner,
		) as TypesafeEthersContract<TAbi>
	}
	return new ethers.Contract(
		contract.addresses[options.chainId],
		new ethers.Interface(contract.abi as any),
		options.runner,
	) as TypesafeEthersContract<TAbi>
}
