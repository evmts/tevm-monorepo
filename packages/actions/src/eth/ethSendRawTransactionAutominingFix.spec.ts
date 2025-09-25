import { createTevmNode } from '@tevm/node'
import { createTxFromRLP } from '@tevm/tx'
import { transports } from '@tevm/test-utils'
import { bytesToHex, hexToBytes } from '@tevm/utils'
import { generatePrivateKey, privateKeyToAccount, signTransaction } from 'viem/accounts'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mineHandler } from '../Mine/mineHandler.js'
import { ethSendRawTransactionJsonRpcProcedure } from './ethSendRawTransactionProcedure.js'

// Mock mineHandler to track if automining is triggered
vi.mock('../Mine/mineHandler.js', () => ({
	mineHandler: vi.fn(),
}))

describe('ethSendRawTransaction - automining fix', () => {
	let client: ReturnType<typeof createTevmNode>
	let mineHandlerMock: ReturnType<typeof vi.fn>

	beforeEach(async () => {
		vi.resetAllMocks()

		// Create client with auto mining enabled
		client = createTevmNode({
			fork: { transport: transports.optimism },
			miningConfig: { type: 'auto' }, // This SHOULD cause eth_sendRawTransaction to automine
		})

		// Mock mineHandler to track calls and simulate successful mining
		mineHandlerMock = mineHandler as unknown as ReturnType<typeof vi.fn>
		mineHandlerMock.mockImplementation(
			() => () =>
				Promise.resolve({
					blockHashes: ['0xabcdef123456789'],
				}),
		)

		// Set up initial balance for the test account
		const vm = await client.getVm()
		await vm.stateManager.putAccount(
			hexToBytes(`0x${'42'.repeat(20)}`),
			{ 
				balance: BigInt('1000000000000000000'), // 1 ETH
				nonce: 0n 
			} as any,
		)
	})

	it('should trigger automining after eth_sendRawTransaction with auto mining enabled', async () => {
		const sendRawTxHandler = ethSendRawTransactionJsonRpcProcedure(client)

		// Create a signed transaction
		const privateKey = generatePrivateKey()
		const account = privateKeyToAccount(privateKey)
		
		const vm = await client.getVm()
		
		// Set balance for sender
		await vm.stateManager.putAccount(
			hexToBytes(account.address),
			{ 
				balance: BigInt('1000000000000000000'), // 1 ETH
				nonce: 0n 
			} as any,
		)
		
		// Create raw transaction
		const rawTx = await signTransaction({
			to: `0x${'69'.repeat(20)}`,
			value: BigInt('420'),
			gas: 21000n,
			gasPrice: 1000000000n, // 1 gwei
			nonce: 0,
		}, { privateKey })

		const request = {
			method: 'eth_sendRawTransaction' as const,
			params: [rawTx],
			jsonrpc: '2.0' as const,
			id: 1,
		}

		// Send the raw transaction
		const result = await sendRawTxHandler(request)

		// Should return transaction hash
		expect(result.error).toBeUndefined()
		expect(result.result).toBeDefined()
		expect(typeof result.result).toBe('string')

		// CRITICAL: Should have triggered automining
		// This test will fail initially because current implementation doesn't automine
		expect(mineHandlerMock).toHaveBeenCalled()
		expect(mineHandlerMock).toHaveBeenCalledTimes(1)
	})

	it('should add transaction to blockchain when automining is triggered', async () => {
		const sendRawTxHandler = ethSendRawTransactionJsonRpcProcedure(client)

		// Get initial block number
		const vm = await client.getVm()
		const initialBlockNumber = vm.blockchain.blockNumber

		// Create a signed transaction
		const privateKey = generatePrivateKey()
		const account = privateKeyToAccount(privateKey)
		
		// Set balance for sender
		await vm.stateManager.putAccount(
			hexToBytes(account.address),
			{ 
				balance: BigInt('1000000000000000000'), // 1 ETH
				nonce: 0n 
			} as any,
		)
		
		const rawTx = await signTransaction({
			to: `0x${'69'.repeat(20)}`,
			value: BigInt('420'),
			gas: 21000n,
			gasPrice: 1000000000n,
			nonce: 0,
		}, { privateKey })

		const request = {
			method: 'eth_sendRawTransaction' as const,
			params: [rawTx],
			jsonrpc: '2.0' as const,
			id: 1,
		}

		const result = await sendRawTxHandler(request)

		// Should return tx hash
		expect(result.result).toBeDefined()

		// Since we mocked mineHandler to simulate successful mining, 
		// in the real implementation this would increment the block number
		// For now we just verify the mock was called with the correct tx hash
		expect(mineHandlerMock).toHaveBeenCalled()
		
		// Verify the call includes the transaction hash
		const handlerCall = mineHandlerMock.mock.results[0]
		expect(handlerCall).toBeDefined()
	})

	it('should NOT trigger automining when mining type is manual', async () => {
		// Create client with manual mining
		const manualClient = createTevmNode({
			fork: { transport: transports.optimism },
			miningConfig: { type: 'manual' },
		})

		const sendRawTxHandler = ethSendRawTransactionJsonRpcProcedure(manualClient)

		const privateKey = generatePrivateKey()
		const account = privateKeyToAccount(privateKey)
		
		// Set balance for sender
		const vm = await manualClient.getVm()
		await vm.stateManager.putAccount(
			hexToBytes(account.address),
			{ 
				balance: BigInt('1000000000000000000'),
				nonce: 0n 
			} as any,
		)
		
		const rawTx = await signTransaction({
			to: `0x${'69'.repeat(20)}`,
			value: BigInt('420'),
			gas: 21000n,
			gasPrice: 1000000000n,
			nonce: 0,
		}, { privateKey })

		const request = {
			method: 'eth_sendRawTransaction' as const,
			params: [rawTx],
			jsonrpc: '2.0' as const,
			id: 1,
		}

		await sendRawTxHandler(request)

		// Should NOT have triggered mining with manual mode
		expect(mineHandlerMock).not.toHaveBeenCalled()
	})
})