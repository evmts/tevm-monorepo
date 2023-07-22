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
	// TODO make me typesafe like typechain via Evmts!
	if (!'TODO') {
		return new ethers.Contract(
			contract.addresses[chainId],
			new ethers.Interface(contract.abi as any),
			runner,
		)
	}
	const address = '0x99417252Aad7B065940eBdF50d665Fb8879c5958'
	const abi = [
		'error CustomError1(uint256 code, string message)',

		'event EventUint256(uint256 indexed value)',
		'event EventAddress(address indexed value)',
		'event EventString(string value)',
		'event EventBytes(bytes value)',

		'function testCustomError1(bool pass, uint code, string calldata message) pure returns (uint256)',
		'function testErrorString(bool pass, string calldata message) pure returns (uint256)',
		'function testPanic(uint256 code) returns (uint256)',
		'function testEvent(uint256 valueUint256, address valueAddress, string valueString, bytes valueBytes) public',
		'function testCallAdd(uint256 a, uint256 b) pure returns (uint256 result)',
	]
	const provider = new ethers.JsonRpcProvider('https://goerli.optimism.io', 5)
	return new ethers.Contract(address, abi, provider)
}
