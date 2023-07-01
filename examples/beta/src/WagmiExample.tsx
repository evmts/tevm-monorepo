import { WagmiMintExample } from './contracts/WagmiMintExample.sol'
import { getRandomInt } from './utils/getRandomInt'
import {
	Address,
	useAccount,
	useBlockNumber,
	useContractEvent,
	useContractRead,
	useContractWrite,
	useWaitForTransaction,
} from 'wagmi'

export const WagmiExample = () => {
	const { address, isConnected } = useAccount()

	const { data: blockNumber } = useBlockNumber()

	/**
	 * ABI of events can be found at events.Foo
	 * - Don't call fn and it is an object without args
	 * - Call fn with args and fromBlock etc. and it returns an object with args
	 */
	const transferEvents = WagmiMintExample.events().Transfer({
		fromBlock: blockNumber && blockNumber - BigInt(1_000),
		args: {
			to: address,
		},
	})

	useContractEvent({
		...transferEvents,
		listener: (event) => {
			console.log('new event', event)
		},
	})

	const balanceOfRead = WagmiMintExample.read().balanceOf(address as Address)

	const { data, refetch } = useContractRead({
		/**
		 * Spreading in a method will spread abi, address and args
		 * Hover over balanceOf and click go-to-definition should take you to the method definition in solidity if compiling from solidity
		 */
		...balanceOfRead,
		enabled: isConnected,
	})

	/**
	 * Not calling the function will return abi and address without args
	 * This is useful for when you want to lazily call the function like in case of useContractWrite
	 */
	const mintWrite = WagmiMintExample.write().mint

	const { writeAsync: writeMint, data: mintData } = useContractWrite({
		...mintWrite,
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
			<button onClick={() => writeMint(mintWrite(BigInt(getRandomInt())))}>
				Mint
			</button>
		</div>
	)
}
