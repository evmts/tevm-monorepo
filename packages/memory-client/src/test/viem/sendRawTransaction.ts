import { SimpleContract } from '@tevm/test-utils'
import { beforeEach, describe, expect, it } from 'bun:test'
import type { MemoryClient } from '../../MemoryClient.js'
import { hexToBytes, type Hex } from 'viem'
import { createMemoryClient } from '../../createMemoryClient.js'
import { prepareTransactionRequest, signTransaction } from 'viem/actions'
import { tevmDefault } from '@tevm/common'
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

describe('sendRawTransaction', () => {
	// weird bug with tevm thinking tx is not signed
	it.todo('should work', async () => {
		const to = `0x${'69'.repeat(20)}` as const
		const request = await prepareTransactionRequest(mc, {
			account,
			to,
			value: 420n,
			chain: tevmDefault,
		})
		console.log('sending raw')
		const tx = await signTransaction(mc, request)
		const hash = await mc.sendRawTransaction({
			serializedTransaction: tx,
		})
		const txPool = await mc._tevm.getTxPool()
		expect(txPool.getByHash([hexToBytes(hash)])).toMatchSnapshot()
	})
})
