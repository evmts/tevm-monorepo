import { requestEip1193 } from '@tevm/decorators'
import { createTevmNode } from '@tevm/node'
import { EthjsAddress, type Hex, numberToHex } from '@tevm/utils'
import { type Client, bytesToHex, createClient, hexToBytes } from 'viem'
import { beforeEach, describe, expect, it } from 'vitest'
import type { TevmTransport } from './MemoryClient.js'
import { createTevmTransport } from './createTevmTransport.js'
import { tevmGetAccount } from './tevmGetAccount.js'
import { tevmSetAccount } from './tevmSetAccount.js'

let client: Client<TevmTransport>

const address = `0x${'69'.repeat(20)}` as const
const balance = 1000n
const nonce = 1n
const deployedBytecode = '0x6003600501'
const state = {
	[`0x${'0'.repeat(64)}`]: numberToHex(42n),
} as const

beforeEach(async () => {
	const node = createTevmNode().extend(requestEip1193())
	client = createClient({
		transport: createTevmTransport(node),
	})
})

describe('tevmSetAccount', () => {
	it('should set various account fields', async () => {
		// Set the account fields
		await tevmSetAccount(client, {
			address,
			balance,
			nonce,
			deployedBytecode,
			state,
		})

		// Retrieve the account and verify the fields
		const account = await tevmGetAccount(client, { address, returnStorage: true })
		expect(account.address).toBe(address)
		expect(account.balance).toBe(balance)
		expect(account.nonce).toBe(nonce)
		expect(account.deployedBytecode).toBe(deployedBytecode)
		// lots of extra checks from debugging prior issue
		const vm = await client.transport.tevm.getVm()
		expect(
			await vm.stateManager.getContractStorage(
				EthjsAddress.fromString(address),
				hexToBytes(Object.keys(state)[0] as Hex),
			),
		).toEqual(hexToBytes(state[`0x${'0'.repeat(64)}`] as Hex))

		expect(await vm.stateManager.dumpStorage(EthjsAddress.fromString(address))).toEqual({
			'0000000000000000000000000000000000000000000000000000000000000000': bytesToHex(Uint8Array.from([42])),
		})
		expect(account.storage).toEqual(state)
	})
})
