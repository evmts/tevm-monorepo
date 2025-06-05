import { tevmDefault } from '@tevm/common'
import { type Contract } from '@tevm/contract'
import { requestEip1193 } from '@tevm/decorators'
import { createMemoryClient, createTevmTransport } from '@tevm/memory-client'
import { createTevmNode } from '@tevm/node'
import { ErrorContract, SimpleContract } from '@tevm/test-utils'
import { PREFUNDED_ACCOUNTS } from '@tevm/utils'
import type { Address, Chain, Hex, Transport, TransportConfig } from 'viem'
import { http, createClient, custom, testActions, createTransport } from 'viem'
import { deployContract, mine, waitForTransactionReceipt, writeContract } from 'viem/actions'
import { anvil } from 'viem/chains'
import { assert, beforeEach, describe, expect, it } from 'vitest'

const client = createMemoryClient()
const viemClientAnvil = createClient({
	transport: http('http://localhost:8545'),
	chain: anvil,
	account: PREFUNDED_ACCOUNTS[0],
})
const viemClientTevmNode = createClient({
	transport: custom(createTevmNode({ common: tevmDefault }).extend(requestEip1193())),
	chain: client.chain,
	account: PREFUNDED_ACCOUNTS[0],
}).extend(testActions({ mode: 'anvil' }))

const anvilRequest = viemClientAnvil.request
viemClientAnvil.request = async (request) => {
	console.log('request', request)
	const res = await anvilRequest(request)
	console.log('res', res)
	return res
}

const tevmNodeRequest = viemClientTevmNode.request
viemClientTevmNode.request = async (request) => {
	console.log('request', request)
	const res = await tevmNodeRequest(request)
	console.log('res', res)
	return res
}


// viem stops as estimateGas (right before sendRawTransaction) and throws
describe('toBeReverted', () => {
	describe('with Anvil node', () => {
		it('should detect revert with a function that reverts', async () => {
			// Deploy the error contract using Anvil client
			const hash = await deployContract(viemClientAnvil, ErrorContract.deploy())
			const receipt = await waitForTransactionReceipt(viemClientAnvil, { hash })
			assert(receipt.contractAddress, 'errorContractAddress is undefined')
			const errorContract = ErrorContract.withAddress(receipt.contractAddress)

			// Test that the revert is detected
			await expect(writeContract(viemClientAnvil, errorContract.write.revertWithRequireAndMessage())).toBeReverted()
		})
	})

	describe('with Tevm node', () => {
		it('should detect revert with a function that reverts', async () => {
			// Deploy the error contract using Tevm client
			const hash = await deployContract(viemClientTevmNode, ErrorContract.deploy())
			await viemClientTevmNode.mine({ blocks: 1 })
			const receipt = await waitForTransactionReceipt(viemClientTevmNode, { hash })
			assert(receipt.contractAddress, 'errorContractAddress is undefined')
			const errorContract = ErrorContract.withAddress(receipt.contractAddress)

			// Test that the revert is detected
			await expect(writeContract(viemClientTevmNode, errorContract.write.revertWithRequireAndMessage())).toBeReverted()


			// const hash = await deployContract(viemClientTevmNode, SimpleContract.deploy(1n))
			// await viemClientTevmNode.mine({ blocks: 1 })
			// const receipt = await waitForTransactionReceipt(viemClientTevmNode, { hash })
			// assert(receipt.contractAddress, 'errorContractAddress is undefined')
			// const simpleContract = SimpleContract.withAddress(receipt.contractAddress)

			// // Test that the revert is detected
			// await expect(writeContract(viemClientTevmNode, simpleContract.write.set(2n))).toBeReverted()
		})
	})

	// TODO: toBeReverted with revert contract
	// TODO: toBeReverted fails with simple contract
	// TODO: not.toBeReverted with simple contract
	// TODO: not.toBeReverted fails with revert contract
	// TODO: helpful error messages
})
