import { DAI } from '../contracts/external/DAI.sol'
import { Address, useAccount, useContractRead } from 'wagmi'

export const ExternalExample = () => {
	const { address, isConnected } = useAccount()

	const { data: balance } = useContractRead({
		/**
		 * Spreading in a method will spread abi, address and args
		 * Hover over balanceOf and click go-to-definition should take you to the method definition in solidity if compiling from solidity
		 */
		...DAI.read().balanceOf(address as Address),
		enabled: isConnected,
	})
	return (
		<div>
			balanceOf({address}): {balance?.toString()}
		</div>
	)
}
