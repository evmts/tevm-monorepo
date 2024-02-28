import { type L1Client, createL1Client } from '../index.js'
import { beforeEach, describe, expect, it } from 'bun:test'

describe('OptimismPortal2', () => {
	let client: L1Client

	beforeEach(() => {
		client = createL1Client()
	})

	it('should initialize contract correctly', async () => {
		expect(
			await client.contract(
				client.op.OptimismPortal2.read.disputeGameFactory(),
			),
		).toMatchObject({
			data: client.op.DisputeGameFactory.address,
		})
		expect(
			await client.contract(client.op.OptimismPortal2.read.systemConfig()),
		).toMatchObject({
			data: client.op.SystemConfig.address,
		})
		expect(
			await client.contract(client.op.OptimismPortal2.read.superchainConfig()),
		).toMatchObject({
			data: client.op.SuperchainConfig.address,
		})
	})

	it('can light eth on fire', async () => {
		expect(
			await client.contract({
				createTransaction: true,
				skipBalance: true, // skipBalance automatically mints the value eth
				value: 420n,
				...client.op.OptimismPortal2.write.donateETH(),
			}),
		).toEqual({
			createdAddresses: new Set(),
			data: undefined,
			executionGasUsed: 164n,
			gas: 16777051n,
			logs: [],
			rawData: '0x',
			selfdestruct: new Set(),
		})
	})

	it('can do a deposit transaction', async () => {
		const to = `0x${'01'.repeat(20)}` as const
		const value = 420n
		const gasLimit = 50_000n // TODO when we add l2 client estimate this
		const isCreation = false
		const data = '0x0'

		expect(
			await client.contract({
				createTransaction: true,
				skipBalance: true, // skipBalance automatically mints the value eth
				value,
				...client.op.OptimismPortal2.write.depositTransaction(
					to,
					value,
					gasLimit,
					isCreation,
					data,
				),
			}),
		).toEqual({
			createdAddresses: new Set(),
			data: undefined,
			executionGasUsed: 51280n,
			gas: 16725935n,
			logs: [
				{
					address: '0xbEb5Fc579115071764c7423A4f12eDde41f106Ed',
					data: '0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000004a00000000000000000000000000000000000000000000000000000000000001a400000000000000000000000000000000000000000000000000000000000001a4000000000000c350000000000000000000000000000000000000000000000000',
					topics: [
						'0xb3813568d9991fc951961fcb4c784893574240a28925604d09fc577c55bb7c32',
						'0x0000000000000000000000000000000000000000000000000000000000000000',
						'0x0000000000000000000000000101010101010101010101010101010101010101',
						'0x0000000000000000000000000000000000000000000000000000000000000000',
					],
				},
			],
			rawData: '0x',
			selfdestruct: new Set(),
		})
	})
})
