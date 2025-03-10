/**
 * @typedef {string} Address
 */

/**
 * Mock implementation of useAccount
 * @returns {{address: string, isConnected: boolean}}
 */
const useAccount = () => ({ address: '0x123', isConnected: true })

/**
 * Mock implementation of useContractRead
 * @template T
 * @param {{enabled: boolean}} options
 * @returns {{data: T|undefined}}
 */
const useContractRead = (options: { enabled: boolean }) => ({
	data: options.enabled ? /** @type {any} */ (BigInt(100)) : undefined,
})

/**
 * @type {{
 *   read: () => {
 *     balanceOf: (address: string) => {abi: any[], address: string, args: string[]},
 *     totalSupply: () => {abi: any[], address: string, args: any[]},
 *     symbol: () => {abi: any[], address: string, args: any[]}
 *   }
 * }}
 */
const TestContract = {
	read: () => ({
		balanceOf: (address: string) => ({
			abi: [],
			address: '0xTestContract',
			args: [address],
		}),
		totalSupply: () => ({
			abi: [],
			address: '0xTestContract',
			args: [],
		}),
		symbol: () => ({
			abi: [],
			address: '0xTestContract',
			args: [],
		}),
	}),
}

/**
 * Example React component that reads from a contract
 * @returns {{testBalance: bigint|undefined, symbol: bigint|undefined, totalSupply: bigint|undefined}}
 */
export const WagmiReads = () => {
	const { address, isConnected } = useAccount()

	const { data: balance } = useContractRead({
		/**
		 * Spreading in a method will spread abi, address and args
		 * Hover over balanceOf and click go-to-definition should take you to the method definition in solidity if compiling from solidity
		 */
		...TestContract.read().balanceOf(address),
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

	// Use the variables to satisfy TS
	const testBalance = /** @type {bigint|undefined} */ (balance)

	return {
		testBalance,
		symbol,
		totalSupply,
	}
}
