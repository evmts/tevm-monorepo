import { tevmDefault } from '@tevm/common'
import { beforeEach, describe, expect, it } from 'bun:test'
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'
import { createSiweMessage } from 'viem/siwe'
import type { MemoryClient } from '../../MemoryClient.js'
import { SimpleContract } from '@tevm/contract'
import { createMemoryClient } from '../../createMemoryClient.js'
import type { Hex } from 'viem'

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
