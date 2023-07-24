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
	if (!`TODO trying to get this hello world to work
This abi and address are copy pasted directly from https://github.com/ethers-io/ethers.js/blob/bcc4d8c8701cfe980742b7d33dc7b0ee4fc48fec/src.ts/_tests/test-contract.ts#L14
Why is this not working?

no matching function (argument="key", value="$$typeof", code=INVALID_ARGUMENT, version=6.6.5)
 ❯ makeError ../../node_modules/.pnpm/ethers@6.6.5/node_modules/ethers/src.ts/utils/errors.ts:670:21
 ❯ assert ../../node_modules/.pnpm/ethers@6.6.5/node_modules/ethers/src.ts/utils/errors.ts:694:25
 ❯ assertArgument ../../node_modules/.pnpm/ethers@6.6.5/node_modules/ethers/src.ts/utils/errors.ts:706:5
 ❯ Interface.getFunctionName ../../node_modules/.pnpm/ethers@6.6.5/node_modules/ethers/src.ts/abi/interface.ts:542:9
 ❯ buildWrappedMethod ../../node_modules/.pnpm/ethers@6.6.5/node_modules/ethers/src.ts/contract/contract.ts:338:34
 ❯ Contract.getFunction ../../node_modules/.pnpm/ethers@6.6.5/node_modules/ethers/src.ts/contract/contract.ts:866:22
 ❯ Object.get ../../node_modules/.pnpm/ethers@6.6.5/node_modules/ethers/src.ts/contract/contract.ts:764:39
 ❯ Object.test ../../node_modules/.pnpm/pretty-format@29.6.1/node_modules/pretty-format/build/plugins/ReactTestComponent.js:59:32
 ❯ findPlugin ../../node_modules/.pnpm/pretty-format@29.6.1/node_modules/pretty-format/build/index.js:302:22
 ❯ format ../../node_modules/.pnpm/pretty-format@29.6.1/node_modules/pretty-format/build/index.js:451:22
`) {
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
	const provider = new ethers.JsonRpcProvider('https://ethereum-goerli.publicnode.com', 5)
	return new ethers.Contract(address, abi, provider)
}
