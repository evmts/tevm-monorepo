import type { EvmtsContract } from '@evmts/core'
import type { Abi, Address, FormatAbi } from 'abitype'
// TODO import in more code splittable way once first version of this is done
// doing this just to move faster for now with that sweet sweet intellisense
import { ethers } from 'ethers'

// TODO make chainId typesafe
// TODO make the type take string numbers too
type CreateEthersContractOptions<TChainIds extends number> = {
	chainId: TChainIds
	runner: ethers.ContractRunner
}

// TODO make me typesafe like typechain via Evmts!
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
	{
		chainId,
		runner,
	}: CreateEthersContractOptions<number | (keyof TAddresses & number)>,
) => {
	return new ethers.Contract(
		contract.addresses[chainId],
		new ethers.Interface(contract.abi as any),
		runner,
	)
}
