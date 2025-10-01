import { type Address, useAccount, useContractRead } from 'wagmi'
import { TestContract } from './TestContract.js'

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
	const _testSymbol: string | undefined = symbol
	const _testTotalSupply: bigint | undefined = totalSupply
	return {
		testBalance,
		symbol,
		totalSupply,
	}
}
