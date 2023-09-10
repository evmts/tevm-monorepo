import { WagmiMintExample } from '../contracts/WagmiMintExample.sol'
import { getRandomInt } from '../utils/getRandomInt'
import {
	Address,
	useAccount,
	useChainId,
	useContractRead,
	useContractWrite,
	useWaitForTransaction,
} from 'wagmi'

export const WagmiWrites = () => {
	const chainId = useChainId()
	const { address, isConnected } = useAccount()

	const { data, refetch } = useContractRead({
		/**
		 * Spreading in a method will spread abi, address and args
		 * Hover over balanceOf and click go-to-definition should take you to the method definition in solidity if compiling from solidity
		 */
		...WagmiMintExample.read({ chainId }).balanceOf(address as Address),
		enabled: isConnected,
	})

	const { writeAsync: writeMint, data: mintData } = useContractWrite({
		/**
		 * Not calling the function will return abi and address without args
		 * This is useful for when you want to lazily call the function like in case of useContractWrite
		 */
		address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
		...WagmiMintExample.write({ chainId }).mint,
	})

	useWaitForTransaction({
		hash: mintData?.hash,
		onSuccess: (receipt) => {
			console.log('minted', receipt)
			refetch()
		},
	})

	return (
		<div>
			<div>
				<div>balance: {data?.toString()}</div>
			</div>
			<button
				type='button'
				onClick={() =>
					writeMint({
						...WagmiMintExample.write({ chainId }).mint(BigInt(getRandomInt())),
					})
				}
			>
				Mint
			</button>
		</div>
	)
}
