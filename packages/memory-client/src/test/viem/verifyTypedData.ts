import { SimpleContract } from '@tevm/test-utils'
import { beforeEach, describe, expect, it } from 'bun:test'
import type { MemoryClient } from '../../MemoryClient.js'
import type { Hex } from 'viem'
import { createMemoryClient } from '../../createMemoryClient.js'
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'

const privateKey = generatePrivateKey()
const account = privateKeyToAccount(privateKey)

let mc: MemoryClient
let deployTxHash: Hex
let c = {
	simpleContract: SimpleContract.withAddress(`0x${'00'.repeat(20)}`),
}

beforeEach(async () => {
	mc = createMemoryClient()
	const deployResult = await mc.tevmDeploy({
		bytecode: SimpleContract.bytecode,
		abi: SimpleContract.abi,
		args: [420n],
	})
	if (!deployResult.createdAddress) {
		throw new Error('contract never deployed')
	}
	c = {
		simpleContract: SimpleContract.withAddress(deployResult.createdAddress),
	}
	if (!deployResult.txHash) {
		throw new Error('txHash not found')
	}
	deployTxHash = deployResult.txHash
	await mc.tevmMine()
})

describe('verifyTypedData', async () => {
	it('verifyTypedData should work', async () => {
		const message = {
			from: {
				name: 'Cow',
				wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
			},
			to: {
				name: 'Bob',
				wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
			},
			contents: 'Hello, Bob!',
		} as const

		const signature = await account.signTypedData({
			types: {
				Person: [
					{ name: 'name', type: 'string' },
					{ name: 'wallet', type: 'address' },
				],
				Mail: [
					{ name: 'from', type: 'Person' },
					{ name: 'to', type: 'Person' },
					{ name: 'contents', type: 'string' },
				],
			},
			primaryType: 'Mail',
			message,
		})
		expect(
			await mc.verifyTypedData({
				address: account.address,
				types: {
					Person: [
						{ name: 'name', type: 'string' },
						{ name: 'wallet', type: 'address' },
					],
					Mail: [
						{ name: 'from', type: 'Person' },
						{ name: 'to', type: 'Person' },
						{ name: 'contents', type: 'string' },
					],
				},
				primaryType: 'Mail',
				message,
				signature,
			}),
		).toBe(true)
	})
})
