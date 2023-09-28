import { addresses } from '../addresses'
import { WagmiMintExample } from '../contracts/WagmiMintExample.sol'
import { Address, useAccount, useContractRead } from 'wagmi'

export const WagmiReads = () => {
	const { address, isConnected } = useAccount()

	const { data: balance } = useContractRead({
		/**
		 * Spreading in a method will spread abi, address and args
		 * Hover over balanceOf and click go-to-definition should take you to the method definition in solidity if compiling from solidity
		 */
		...WagmiMintExample.read.balanceOf(address as Address),
		address: addresses[420],
		enabled: isConnected,
	})
	const { data: totalSupply } = useContractRead({
		...WagmiMintExample.read.totalSupply(),
		address: addresses[420],
		enabled: isConnected,
	})
	const { data: tokenUri } = useContractRead({
		...WagmiMintExample.read.tokenURI(BigInt(1)),
		address: addresses[420],
		enabled: isConnected,
	})
	const { data: symbol } = useContractRead({
		...WagmiMintExample.read.symbol(),
		address: addresses[420],
		enabled: isConnected,
	})
	const { data: ownerOf } = useContractRead({
		...WagmiMintExample.read.ownerOf(BigInt(1)),
		address: addresses[420],
		enabled: isConnected,
	})
	return (
		<div>
			<div>
				<div>
					balanceOf({address}): {balance?.toString()}
				</div>
				<div>totalSupply(): {totalSupply?.toString()}</div>
				<div>tokenUri(BigInt(1)): {tokenUri?.toString()}</div>
				<div>symbol(): {symbol?.toString()}</div>
				<div>ownerOf(BigInt(1)): {ownerOf?.toString()}</div>
			</div>
		</div>
	)
}
