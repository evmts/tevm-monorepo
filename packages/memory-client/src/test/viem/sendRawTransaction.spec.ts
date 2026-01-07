import { tevmDefault } from '@tevm/common'
import { generatePrivateKey, hexToBytes, nativePrivateKeyToAccount } from '@tevm/utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { createMemoryClient } from '../../createMemoryClient.js'
import type { MemoryClient } from '../../MemoryClient.js'

const privateKey = generatePrivateKey()
const account = nativePrivateKeyToAccount(privateKey)

let mc: MemoryClient<any, any>

beforeEach(async () => {
	mc = createMemoryClient()
})

describe('sendRawTransaction', () => {
	// weird bug with tevm thinking tx is not signed
	it.todo('should work', async () => {
		const to = `0x${'69'.repeat(20)}` as const
		const request = await mc.prepareTransactionRequest({
			account,
			to,
			value: 420n,
			chain: tevmDefault as any,
		})
		const tx = await mc.signTransaction(request as any)
		const hash = await mc.sendRawTransaction({
			serializedTransaction: tx,
		})
		const txPool = await mc.transport.tevm.getTxPool()
		expect(txPool.getByHash([hexToBytes(hash)])).toMatchSnapshot()
	})
})
