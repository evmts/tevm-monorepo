import { tevmDefault } from '@tevm/common'
import { SimpleContract } from '@tevm/contract'
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'
import { createSiweMessage } from 'viem/siwe'
import { beforeEach, describe, expect, it } from 'vitest'
import type { MemoryClient } from '../../MemoryClient.js'
import { createMemoryClient } from '../../createMemoryClient.js'

const privateKey = generatePrivateKey()
const account = privateKeyToAccount(privateKey)

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

describe('verifySiweMessage', () => {
	it('should work', async () => {
		const message = createSiweMessage({
			address: account.address,
			chainId: tevmDefault.id,
			domain: 'tevm.sh',
			nonce: 'foobarbaz',
			uri: 'https://tevm.sh',
			version: '1',
		})

		const signature = await account.signMessage({ message })

		expect(await mc.verifySiweMessage({ message, signature })).toBe(true)
	})
})
