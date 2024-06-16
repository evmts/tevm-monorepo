import { beforeEach, describe, expect, it } from 'bun:test'
import { tevmDefault } from '@tevm/common'
import { hexToBytes } from 'viem'
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'
import { prepareTransactionRequest, signTransaction } from 'viem/actions'
import type { MemoryClient } from '../../MemoryClient.js'
import { createMemoryClient } from '../../createMemoryClient.js'

const privateKey = generatePrivateKey()
const account = privateKeyToAccount(privateKey)

let mc: MemoryClient

beforeEach(async () => {
	mc = createMemoryClient()
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
		const tx = await signTransaction(mc, request)
		const hash = await mc.sendRawTransaction({
			serializedTransaction: tx,
		})
		const txPool = await mc._tevm.getTxPool()
		expect(txPool.getByHash([hexToBytes(hash)])).toMatchSnapshot()
	})
})
