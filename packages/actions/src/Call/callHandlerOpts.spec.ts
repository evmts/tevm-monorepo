import { beforeEach, describe, expect, it } from 'bun:test'
import { type BaseClient, createBaseClient } from '@tevm/base-client'
import { EthjsAddress, bytesToHex, numberToHex } from '@tevm/utils'
import { hexToBytes } from '@tevm/utils'
import { getAccountHandler } from '../GetAccount/getAccountHandler.js'
import { callHandlerOpts } from './callHandlerOpts.js'

describe('callHandlerOpts', () => {
	let client: BaseClient

	beforeEach(() => {
		client = createBaseClient()
	})

	it('should handle empty params', async () => {
		const result = await callHandlerOpts(client, {})
		expect(result.data).toMatchSnapshot()
	})

	it('should parse caller address correctly', async () => {
		const params = { caller: `0x${'4'.repeat(40)}` } as const
		const result = await callHandlerOpts(client, params)
		expect(result.data?.caller).toEqual(EthjsAddress.fromString(params.caller))
	})

	it('should set both origin and caller to from address if provided', async () => {
		const params = { from: `0x${'4'.repeat(40)}` } as const
		const result = await callHandlerOpts(client, params)
		expect(result.data?.caller).toEqual(EthjsAddress.fromString(params.from))
		expect(result.data?.origin).toEqual(EthjsAddress.fromString(params.from))
	})

	it('origin and caller take presidence over from', async () => {
		const params = {
			from: `0x${'4'.repeat(40)}`,
			origin: `0x${'5'.repeat(40)}`,
			caller: `0x${'6'.repeat(40)}`,
		} as const
		const result = await callHandlerOpts(client, params)
		expect(result.data?.caller).toEqual(EthjsAddress.fromString(params.caller))
		expect(result.data?.origin).toEqual(EthjsAddress.fromString(params.origin))
	})

	it('origin and caller take presidence over from', async () => {
		const params = {
			from: `0x${'4'.repeat(40)}`,
			origin: `0x${'5'.repeat(40)}`,
			caller: `0x${'6'.repeat(40)}`,
		} as const
		const result = await callHandlerOpts(client, params)
		expect(result.data?.caller).toEqual(EthjsAddress.fromString(params.caller))
		expect(result.data?.origin).toEqual(EthjsAddress.fromString(params.origin))
	})

	it('origin and caller take presidence over from', async () => {
		const params = {
			from: `0x${'4'.repeat(40)}`,
			origin: `0x${'5'.repeat(40)}`,
			caller: `0x${'6'.repeat(40)}`,
		} as const
		const result = await callHandlerOpts(client, params)
		expect(result.data?.caller).toEqual(EthjsAddress.fromString(params.caller))
		expect(result.data?.origin).toEqual(EthjsAddress.fromString(params.origin))
	})

	it('should parse transaction to address', async () => {
		const to = `0x${'3'.repeat(40)}` as const
		const result = await callHandlerOpts(client, {
			to,
		})
		expect(result.data?.to).toEqual(EthjsAddress.fromString(to))
	})

	it('should parse data to bytes', async () => {
		const data = `0x${'3'.repeat(40)}` as const
		const result = await callHandlerOpts(client, {
			data,
		})
		expect(result.data?.data).toEqual(hexToBytes(data))
	})

	it('should parse salt to bytes', async () => {
		const salt = `0x${'3'.repeat(40)}` as const
		const result = await callHandlerOpts(client, {
			salt,
		})
		expect(result.data?.salt).toEqual(hexToBytes(salt))
	})

	it('should handle depth', async () => {
		const depth = 5
		const result = await callHandlerOpts(client, {
			depth,
		})
		expect(result.data?.depth).toEqual(depth)
	})

	it('should parse blob versioned hashes to buffers', async () => {
		const versionedHash = `0x${'3'.repeat(40)}` as const
		const result = await callHandlerOpts(client, {
			blobVersionedHashes: [versionedHash],
		})
		expect(result.data?.blobVersionedHashes?.[0]).toEqual(hexToBytes(versionedHash))
	})

	it('should handle selfdestruct', async () => {
		const selfdestruct = new Set([EthjsAddress.zero().toString() as `0x${string}`])
		const result = await callHandlerOpts(client, {
			selfdestruct,
		})
		expect(result.data?.selfdestruct).toEqual(selfdestruct)
	})

	it('should handle skipBalance', async () => {
		const skipBalance = true
		const result = await callHandlerOpts(client, {
			skipBalance,
		})
		expect(result.data?.skipBalance).toEqual(skipBalance)
	})

	it('should handle gasRefund', async () => {
		const gasRefund = 100n
		const result = await callHandlerOpts(client, {
			gasRefund,
		})
		expect(result.data?.gasRefund).toEqual(gasRefund)
	})

	it('should handle gasPrice', async () => {
		const gasPrice = 100n
		const result = await callHandlerOpts(client, {
			gasPrice,
		})
		expect(result.data).toMatchObject({ gasPrice })
	})

	it('should handle value', async () => {
		const value = 100n
		const result = await callHandlerOpts(client, {
			value,
		})
		expect(result.data?.value).toEqual(value)
	})

	it('should handle origin', async () => {
		const origin = EthjsAddress.zero().toString() as `0x${string}`
		const result = await callHandlerOpts(client, {
			origin,
		})
		expect(result.data?.origin).toEqual(EthjsAddress.zero())
	})

	it('should handle gasLimit', async () => {
		const gas = 100n
		const result = await callHandlerOpts(client, {
			gas,
		})
		expect(result.data).toMatchObject({ gasLimit: gas })
	})

	it('should handle named tags', async () => {
		const block = await client.getVm().then((vm) => vm.blockchain.getCanonicalHeadBlock())
		const result = await callHandlerOpts(client, { blockTag: 'latest' })
		expect(result.data?.block?.header.number).toEqual(block.header.number)
		expect(result.data?.block?.header).toEqual(block.header)
	})

	it('should handle hash block tags', async () => {
		const block = await client.getVm().then((vm) => vm.blockchain.getCanonicalHeadBlock())
		const result = await callHandlerOpts(client, { blockTag: bytesToHex(block.hash()) })
		expect(result.data?.block?.header.number).toEqual(block.header.number)
		expect(result.data?.block?.header).toEqual(block.header)
		expect(() => result.data?.block?.header.cliqueSigner()).toThrowError()
	})

	it('should return an error for unknown block tag', async () => {
		const result = await callHandlerOpts(client, { blockTag: 'unknown' as any })
		expect(result.errors?.[0]?.message).toContain('Unknown blocktag unknown')
		expect(result.errors).toMatchSnapshot()
		expect(result.data?.block?.header.getBlobGasPrice()).toBeUndefined()
	})

	it('should return an error if no block is found', async () => {
		const result = await callHandlerOpts(client, { blockTag: 100n })
		expect(result.errors).toMatchSnapshot()
	})

	it('should handle block overrides correctly', async () => {
		const blockOverrideSet = {
			coinbase: `0x${'1'.repeat(40)}` as const,
			number: 42n,
			gasLimit: 8000000n,
			time: 1618925403n,
			baseFee: 1000000000n,
			blobBaseFee: 2000000000n,
		}
		const result = await callHandlerOpts(client, { blockOverrideSet })
		expect(result.data?.block?.header.coinbase).toEqual(EthjsAddress.fromString(blockOverrideSet.coinbase))
		expect(result.data?.block?.header.number).toEqual(blockOverrideSet.number)
		expect(result.data?.block?.header.gasLimit).toEqual(blockOverrideSet.gasLimit)
		expect(result.data?.block?.header.timestamp).toEqual(blockOverrideSet.time)
		expect(result.data?.block?.header.baseFeePerGas).toEqual(blockOverrideSet.baseFee)
		expect(result.data?.block?.header.getBlobGasPrice()).toEqual(blockOverrideSet.blobBaseFee)
		expect(() => result.data?.block?.header.cliqueSigner()).toThrowError()
	})

	it('should handle block overrides correctly with no blobBaseFee', async () => {
		const blockOverrideSet = {
			coinbase: `0x${'1'.repeat(40)}` as const,
			number: 42n,
			gasLimit: 8000000n,
			time: 1618925403n,
			baseFee: 1000000000n,
		}
		const result = await callHandlerOpts(client, { blockOverrideSet })
		expect(result.data?.block?.header.coinbase).toEqual(EthjsAddress.fromString(blockOverrideSet.coinbase))
		expect(result.data?.block?.header.number).toEqual(blockOverrideSet.number)
		expect(result.data?.block?.header.gasLimit).toEqual(blockOverrideSet.gasLimit)
		expect(result.data?.block?.header.timestamp).toEqual(blockOverrideSet.time)
		expect(result.data?.block?.header.baseFeePerGas).toEqual(blockOverrideSet.baseFee)
		expect(result.data?.block?.header.getBlobGasPrice()).toBe(1n)
		expect(() => result.data?.block?.header.cliqueSigner()).toThrowError()
	})

	it('should handle state overrides correctly', async () => {
		const address = `0x${'1'.repeat(40)}` as const
		const overridedAccount = {
			nonce: 1n,
			balance: 1000000000n,
			code: '0x60' as const,
			state: {
				[numberToHex(0, { size: 32 })]: numberToHex(420, { size: 2 }),
				[numberToHex(1, { size: 32 })]: numberToHex(69, { size: 1 }),
			},
		}
		const stateOverrideSet = {
			[address]: overridedAccount,
		}
		const result = await callHandlerOpts(client, { stateOverrideSet })
		expect(result.errors).toBeUndefined()
		expect(await getAccountHandler(client)({ address, returnStorage: true })).toEqual({
			address,
			nonce: overridedAccount.nonce,
			balance: overridedAccount.balance,
			deployedBytecode: overridedAccount.code,
			storage: overridedAccount.state,
			isContract: true,
			isEmpty: false,
			storageRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
			codeHash: '0x15a5de5d00dfc39d199ee772e89858c204d1d545de092db54a345c7303942607',
		})
	})

	it('should handle invalid state overrides', async () => {
		const stateOverrideSet = {
			[`0x${'1'.repeat(40)}` as const]: {
				nonce: 1n,
				balance: 1000000000n,
				code: 'invalid_code' as const as any,
			},
		}
		const result = await callHandlerOpts(client, { stateOverrideSet })
		expect(result.errors).toBeDefined()
		expect(result.errors).toHaveLength(1)
		expect(result.errors).toMatchSnapshot()
	})

	it('should throw error for transaction creation on past blocks', async () => {
		const blockTag = 42n
		const params = { blockTag, createTransaction: true } as const
		const result = await callHandlerOpts(client, params)
		expect(result.errors?.[0]).toBeDefined()
		expect(result.errors).toMatchSnapshot()
	})
})
