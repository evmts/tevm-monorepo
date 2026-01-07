import { SimpleContract } from '@tevm/contract'
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
describe('verifyMessage', () => {
	it('verifyMessage should work', async () => {
		const message = 'hello'
		const signature = await account.signMessage({ message })
		expect(await mc.verifyMessage({ message, signature, address: account.address })).toBe(true)
	})
})
