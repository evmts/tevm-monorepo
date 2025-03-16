import { ERC20 } from 'tevm/contract'
import { http } from 'tevm/jsonrpc'
import { createMemoryClient } from 'tevm/memory-client'

// Default values that can be overridden
const defaultAddress = '0x0000000000000000000000000000000000000000'
const defaultAccount = '0x0000000000000000000000000000000000000000'
const defaultRpcUrl = 'http://localhost:8545'

// Create a TEVM client with fork from specified RPC
export const client = createMemoryClient({
	fork: {
		transport: http(process.env.RPC_URL || defaultRpcUrl),
	},
})

/**
 * Read contract data using TEVM
 * @param address - Contract address (defaults to zero address)
 * @param account - Account to check balance for (defaults to zero address)
 * @param abi - Contract ABI (defaults to ERC20 ABI)
 * @param functionName - Function to call (defaults to 'balanceOf')
 * @returns Promise with the contract call result
 */
export const readContract = async ({
	address = defaultAddress,
	account = defaultAccount,
	abi = ERC20.abi,
	functionName = 'balanceOf',
} = {}) => {
	return client.readContract({
		address,
		abi,
		functionName,
		args: [account],
	})
}

// Execute if run directly
if (import.meta.main) {
	readContract()
		.then((result) => console.log(JSON.stringify(result, null, 2)))
		.catch((error) => console.error('Error:', error))
}
