import { TestContract } from './TestContract.js'
import { Address, useAccount, useContractRead } from 'wagmi'

export const WagmiReads = () => {
	const { address, isConnected } = useAccount()

	const { data: balance } = useContractRead({
		/**
		 * Spreading in a method will spread abi, address and args
		 * Hover over balanceOf and click go-to-definition should take you to the method definition in solidity if compiling from solidity
		 */
		...TestContract.read().balanceOf(address as Address),
		enabled: isConnected,
	})
	const { data: totalSupply } = useContractRead({
		...TestContract.read().totalSupply(),
		enabled: isConnected,
	})
	const { data: symbol } = useContractRead({
		...TestContract.read().symbol(),
		enabled: isConnected,
	})
	const testBalance: bigint | undefined = balance
	const testSymbol: string | undefined = symbol
	const testTotalSupply: bigint | undefined = totalSupply
	return {
		testBalance,
		symbol,
		totalSupply,
	}
}
