import { SimpleContract } from '@tevm/test-utils'
import { generatePrivateKey, nativePrivateKeyToAccount } from '@tevm/utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { createMemoryClient } from '../../createMemoryClient.js'
import type { MemoryClient } from '../../MemoryClient.js'

const privateKey = generatePrivateKey()
const account = nativePrivateKeyToAccount(privateKey)

let mc: MemoryClient<any, any>

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
	if (!deployResult.txHash) {
		throw new Error('txHash not found')
	}
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
