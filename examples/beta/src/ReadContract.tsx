import { WagmiMintExample } from './contracts/WagmiMintExample.sol'
import { Address, useAccount, useContractRead, useContractWrite } from 'wagmi'

const { balanceOf } = WagmiMintExample.read()
const { mint } = WagmiMintExample.write()

export const ReadContract = () => {
	const { address, isConnected } = useAccount()

	const { data } = useContractRead({
		/**
		 * Spreading in a method will spread abi, address and args
		 * Hover over balanceOf and click go-to-definition should take you to the method definition in solidity if compiling from solidity
		 */
		...balanceOf(address as Address),
		enabled: isConnected,
	})
	const { writeAsync: writeMint } = useContractWrite({
		/**
		 * Spreadiing the method without calling the function will return abi and address without args
		 * This is useful for when you want to lazily call the function like in case of useContractWrite
		 */
		...mint,
	})
	return (
		<div>
			<div>
				<div>balance: {data?.toString()}</div>
			</div>
			<button type='button' onClick={() => writeMint(mint(BigInt(1)))}>
				Mint
			</button>
		</div>
	)
}
