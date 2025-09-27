import { createAddress } from '@tevm/address'
import { InvalidBlockError, InvalidParamsError } from '@tevm/errors'
import { createTevmNode, type TevmNode } from '@tevm/node'
import { bytesToHex, hexToBytes } from '@tevm/utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { mineHandler } from '../Mine/mineHandler.js'
import { callHandlerOpts } from './callHandlerOpts.js'

describe('callHandlerOpts', () => {
	let client: TevmNode

	beforeEach(() => {
		client = createTevmNode()
	})

	it('should handle empty params', async () => {
		const result = await callHandlerOpts(client, {})
		expect(result.data).toMatchSnapshot()
	})

	it('should parse caller address correctly', async () => {
		const params = { caller: `0x${'4'.repeat(40)}` } as const
		const result = await callHandlerOpts(client, params)
		expect(result.data?.caller).toEqual(createAddress(params.caller))
	})

	it('should set both origin and caller to from address if provided', async () => {
		const params = { from: `0x${'4'.repeat(40)}` } as const
		const result = await callHandlerOpts(client, params)
		expect(result.data?.caller).toEqual(createAddress(params.from))
		expect(result.data?.origin).toEqual(createAddress(params.from))
	})

	it('origin and caller take presidence over from', async () => {
		const params = {
			from: `0x${'4'.repeat(40)}`,
			origin: `0x${'5'.repeat(40)}`,
			caller: `0x${'6'.repeat(40)}`,
		} as const
		const result = await callHandlerOpts(client, params)
		expect(result.data?.caller).toEqual(createAddress(params.caller))
		expect(result.data?.origin).toEqual(createAddress(params.origin))
	})

	it('origin and caller take presidence over from', async () => {
		const params = {
			from: `0x${'4'.repeat(40)}`,
			origin: `0x${'5'.repeat(40)}`,
			caller: `0x${'6'.repeat(40)}`,
		} as const
		const result = await callHandlerOpts(client, params)
		expect(result.data?.caller).toEqual(createAddress(params.caller))
		expect(result.data?.origin).toEqual(createAddress(params.origin))
	})

	it('origin and caller take presidence over from', async () => {
		const params = {
			from: `0x${'4'.repeat(40)}`,
			origin: `0x${'5'.repeat(40)}`,
			caller: `0x${'6'.repeat(40)}`,
		} as const
		const result = await callHandlerOpts(client, params)
		expect(result.data?.caller).toEqual(createAddress(params.caller))
		expect(result.data?.origin).toEqual(createAddress(params.origin))
	})

	it('should parse transaction to address', async () => {
		const to = `0x${'3'.repeat(40)}` as const
		const result = await callHandlerOpts(client, {
			to,
		})
		expect(result.data?.to).toEqual(createAddress(to))
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
		expect(result.data?.blobVersionedHashes?.[0]).toEqual(versionedHash)
	})

	it('should handle selfdestruct', async () => {
		const selfdestruct = new Set([createAddress(0).toString() as `0x${string}`])
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
		const origin = createAddress(0).toString() as `0x${string}`
		const result = await callHandlerOpts(client, {
			origin,
		})
		expect(result.data?.origin).toEqual(createAddress(0))
	})

	it('should handle gasLimit', async () => {
		const gas = 100n
		const result = await callHandlerOpts(client, {
			gas,
		})
		expect(result.data).toMatchObject({ gasLimit: gas })
	})

	it('should handle named tags', async () => {
		const block = await client.getVm().then((/** @type {any} */ vm) => vm.blockchain.getCanonicalHeadBlock())
		const result = await callHandlerOpts(client, { blockTag: 'latest' })
		expect(result.data?.block?.header.number).toEqual(block.header.number)
		expect(result.data?.block?.header).toEqual(block.header)
	})

	it('should handle hash block tags', async () => {
		const block = await client.getVm().then((/** @type {any} */ vm) => vm.blockchain.getCanonicalHeadBlock())
		const result = await callHandlerOpts(client, { blockTag: bytesToHex(block.hash()) })
		expect(result.data?.block?.header.number).toEqual(block.header.number)
		expect(result.data?.block?.header).toEqual(block.header)
		// cliqueSigner is no longer part of the header interface
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
		expect(result.data?.block?.header.coinbase).toEqual(createAddress(blockOverrideSet.coinbase))
		expect(result.data?.block?.header.number).toEqual(blockOverrideSet.number)
		expect(result.data?.block?.header.gasLimit).toEqual(blockOverrideSet.gasLimit)
		expect(result.data?.block?.header.timestamp).toEqual(blockOverrideSet.time)
		expect(result.data?.block?.header.baseFeePerGas).toEqual(blockOverrideSet.baseFee)
		expect(result.data?.block?.header.getBlobGasPrice()).toEqual(blockOverrideSet.blobBaseFee)
		// cliqueSigner is no longer part of the header interface
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
		expect(result.data?.block?.header.coinbase).toEqual(createAddress(blockOverrideSet.coinbase))
		expect(result.data?.block?.header.number).toEqual(blockOverrideSet.number)
		expect(result.data?.block?.header.gasLimit).toEqual(blockOverrideSet.gasLimit)
		expect(result.data?.block?.header.timestamp).toEqual(blockOverrideSet.time)
		expect(result.data?.block?.header.baseFeePerGas).toEqual(blockOverrideSet.baseFee)
		expect(result.data?.block?.header.getBlobGasPrice()).toBe(1n)
		// cliqueSigner is no longer part of the header interface
	})

	it('should throw error for transaction creation on past blocks', async () => {
		const client = createTevmNode()

		// First, mine a few blocks to ensure we have a past block to reference
		await mineHandler(client)({ blockCount: 5 })

		// Now, try to create a transaction on a past block
		const pastBlockNumber = 2n
		const params = {
			blockTag: pastBlockNumber,
			createTransaction: true,
			to: '0x1234567890123456789012345678901234567890',
			value: 1n,
		} as const

		const result = await callHandlerOpts(client, params)

		expect(result.errors).toBeDefined()
		expect(result.errors?.length).toBe(1)
		expect(result.errors?.[0]).toBeInstanceOf(InvalidParamsError)
	})

	it('should handle invalid block tags', async () => {
		const client = createTevmNode()
		const result = await callHandlerOpts(client, { blockTag: 'invalid' as any })
		expect(result.errors).toBeDefined()
		expect(result.errors?.[0]).toBeInstanceOf(InvalidBlockError)
	})
})
