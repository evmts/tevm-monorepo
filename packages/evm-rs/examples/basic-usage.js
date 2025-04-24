/**
 * Example of using @tevm/evm-rs in a real application
 *
 * To run:
 * 1. Build the package with `npm run build`
 * 2. Run with Node.js: `node examples/basic-usage.js`
 */

import { createEvm } from '../dist/index.js'

// This would typically be imported from other tevm packages
const mockCommon = { ethjsCommon: {} }
const mockStateManager = {
	/* mock implementation */
}
const mockBlockchain = {
	/* mock implementation */
}

async function runExample() {
	console.log('Creating EVM instance...')

	try {
		// Create the EVM instance
		const evm = await createEvm({
			common: mockCommon,
			stateManager: mockStateManager,
			blockchain: mockBlockchain,
			allowUnlimitedContractSize: true,
			loggingLevel: 'info',
		})

		console.log('Waiting for EVM to be ready...')
		await evm.ready()
		console.log('EVM ready!')

		// Set up accounts
		console.log('Setting up accounts...')
		await evm.setAccount(
			'0x1000000000000000000000000000000000000000', // Sender address
			'0x1000000000000000000', // 1 ETH
			null, // No code (EOA)
			0, // Nonce
		)

		await evm.setAccount(
			'0x2000000000000000000000000000000000000000', // Recipient address
			'0x0', // 0 ETH
			null, // No code (EOA)
			0, // Nonce
		)

		// Verify accounts were set up correctly
		const senderAccount = await evm.getAccount('0x1000000000000000000000000000000000000000')
		console.log('Sender account:', {
			balance: senderAccount.balance.toString(),
			nonce: senderAccount.nonce,
		})

		// Execute a transaction (send 0.1 ETH)
		console.log('Executing ETH transfer...')
		const result = await evm.runCall({
			caller: '0x1000000000000000000000000000000000000000',
			to: '0x2000000000000000000000000000000000000000',
			value: '0x100000000000000000', // 0.1 ETH
			data: '0x',
			gasLimit: 21000,
		})

		console.log('Transaction result:', {
			gasUsed: result.gasUsed.toString(),
			result: result.result,
		})

		// Check account balances after transfer
		const senderAccountAfter = await evm.getAccount('0x1000000000000000000000000000000000000000')
		const recipientAccountAfter = await evm.getAccount('0x2000000000000000000000000000000000000000')

		console.log('Sender account after transfer:', {
			balance: senderAccountAfter.balance.toString(),
			nonce: senderAccountAfter.nonce,
		})

		console.log('Recipient account after transfer:', {
			balance: recipientAccountAfter.balance.toString(),
			nonce: recipientAccountAfter.nonce,
		})

		console.log('Example completed successfully!')
	} catch (error) {
		console.error('Error running example:', error)
	}
}

runExample()
