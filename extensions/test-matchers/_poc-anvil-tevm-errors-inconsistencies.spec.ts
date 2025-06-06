import { tevmDefault } from '@tevm/common'
import { createTevmTransport, tevmDeploy } from '@tevm/memory-client'
import { ErrorContract } from '@tevm/test-utils'
import { PREFUNDED_ACCOUNTS } from '@tevm/utils'
import { createClient, encodeFunctionData, http } from 'viem'
import { deployContract, mine, sendTransaction, waitForTransactionReceipt } from 'viem/actions'
import { anvil } from 'viem/chains'
import { assert, describe, expect, it } from 'vitest'

const tevmClient = createClient({ transport: createTevmTransport(), chain: tevmDefault, account: PREFUNDED_ACCOUNTS[0] })
const anvilClient = createClient({ transport: http('http://localhost:8545'), chain: anvil, account: PREFUNDED_ACCOUNTS[0] })

// For `sendTransaction` and `estimateGas`, rpc will not return a more detailed error on anvil and no details on tevm
// by default, on anvil, a revert with string gets decoded, and a custom errors returns the hex data with a descriptive message

describe('errors inconsistencies between tevm and anvil', () => {
	it('tevm', async () => {
		// Deploy
		const { createdAddress: errorContractAddress } = await tevmDeploy(tevmClient, {
			...ErrorContract.deploy(),
			addToBlockchain: true,
		})
		assert(errorContractAddress, 'errorContractAddress is undefined')
		const errorContractTevm = ErrorContract.withAddress(errorContractAddress)

		/* --------------------------- tevm: string revert -------------------------- */
		try {
			await sendTransaction(tevmClient, { to: errorContractTevm.address, data: encodeFunctionData(errorContractTevm.write.revertWithStringError())})
		} catch (error) {
			const errCause = error.cause.walk()
			expect(errCause.code).toBe(3)
			expect(errCause.message).toBe('revert\n' +
    '\n' +
    'Docs: https://tevm.sh/reference/tevm/errors/classes/reverterror/\n' +
    'Details: {"error":"revert","errorType":"EVMError"}\n' +
    'Version: 1.1.0.next-73')
		expect(errCause.data).toMatchObject({
			data: '0x08c379a00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000001e54686973206973206120737472696e67206572726f72206d6573736167650000',
			errors: [
				'revert\n' +
					'\n' +
					'Docs: https://tevm.sh/reference/tevm/errors/classes/reverterror/\n' +
					'Details: {"error":"revert","errorType":"EVMError"}\n' +
					'Version: 1.1.0.next-73'
			]
		})
		}

		/* --------------------------- tevm: custom revert -------------------------- */
		try {
			await sendTransaction(tevmClient, { to: errorContractTevm.address, data: encodeFunctionData(errorContractTevm.write.revertWithSimpleCustomError())})
		} catch (error) {
			const errCause = error.cause.walk()
			expect(errCause.code).toBe(3)
			expect(errCause.message).toBe('revert\n' +
    '\n' +
    'Docs: https://tevm.sh/reference/tevm/errors/classes/reverterror/\n' +
    'Details: {"error":"revert","errorType":"EVMError"}\n' +
    'Version: 1.1.0.next-73')
		expect(errCause.data).toMatchObject({
			data: '0xc2bb947c',
			errors: [
				'revert\n' +
					'\n' +
					'Docs: https://tevm.sh/reference/tevm/errors/classes/reverterror/\n' +
					'Details: {"error":"revert","errorType":"EVMError"}\n' +
					'Version: 1.1.0.next-73'
			]
		})
		}
	})

	it('anvil', async () => {
		// Deploy
		const errorContractTxHash = await deployContract(anvilClient, {
			...ErrorContract.deploy(),
		})
		await mine(anvilClient.extend(() => ({ mode: 'anvil' })), { blocks: 1 })
		const errorContractReceipt = await waitForTransactionReceipt(anvilClient, { hash: errorContractTxHash })
		const errorContractAnvil = ErrorContract.withAddress(errorContractReceipt.contractAddress!)

		/* -------------------------- anvil: string revert -------------------------- */
		try {
			await sendTransaction(anvilClient, { to: errorContractAnvil.address, data: encodeFunctionData(errorContractAnvil.write.revertWithStringError())})
		} catch (error) {
			const errCause = error.cause.walk()
			expect(errCause.code).toBe(3)
			expect(errCause.message).toBe('execution reverted: revert: This is a string error message')
			expect(errCause.data).toBe('0x08c379a00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000001e54686973206973206120737472696e67206572726f72206d6573736167650000')
		}

		/* -------------------------- anvil: custom revert -------------------------- */
		try {
			await sendTransaction(anvilClient, { to: errorContractAnvil.address, data: encodeFunctionData(errorContractAnvil.write.revertWithSimpleCustomError())})
		} catch (error) {
			const errCause = error.cause.walk()
			expect(errCause.code).toBe(3)
			expect(errCause.message).toBe('execution reverted: custom error 0xc2bb947c')
			expect(errCause.data).toBe('0xc2bb947c')
		}
	})
})
