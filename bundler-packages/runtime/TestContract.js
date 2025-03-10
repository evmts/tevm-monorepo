/**
 * This is a mock TestContract file for testing purposes
 */
export const TestContract = {
	read: () => ({
		/**
		 * @param {import("abitype").Address} address
		 */
		balanceOf: (address) => ({
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
