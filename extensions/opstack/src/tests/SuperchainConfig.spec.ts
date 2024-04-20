import { beforeEach, describe, expect, it } from 'bun:test'
import { type L1Client, createL1Client } from '../index.js'

describe('SuperchainConfig', () => {
	let client: L1Client
	let SuperchainConfig: L1Client['op']['SuperchainConfig']

	beforeEach(() => {
		client = createL1Client()
		SuperchainConfig = client.op.SuperchainConfig
	})

	it('should initialize contract as unpaused', async () => {
		expect(await client.contract(SuperchainConfig.read.paused())).toMatchObject({ data: false })
	})

	it('should initialize the guardian', async () => {
		// should have intialized contract with guardian
		expect(await client.contract(SuperchainConfig.read.guardian())).toMatchObject({ data: client.op.GUARDIAN })
	})

	it('should be able to pause and unpause as the guardian', async () => {
		// won't work if we aren't guardian
		const notGuardian = `0x${'ff'.repeat(20)}` as const
		expect(
			await client.contract({
				from: notGuardian,
				createTransaction: true,
				throwOnFail: false,
				...SuperchainConfig.write.pause('pausing'),
			}),
		).toHaveProperty('errors', [
			{
				_tag: 'revert',
				message:
					'Revert: Error {"abiItem":{"inputs":[{"name":"message","type":"string"}],"name":"Error","type":"error"},"args":["SuperchainConfig: only guardian can pause"],"errorName":"Error"}',
				name: 'revert',
			},
		])
		// assert it's not paused
		expect(await client.contract(SuperchainConfig.read.paused())).toMatchObject({ data: false })
		// pause it
		expect(
			await client.contract({
				from: client.op.GUARDIAN,
				createTransaction: true,
				...SuperchainConfig.write.pause('pausing'),
			}),
		).toEqual({
			createdAddresses: new Set(),
			txHash: '0x7fa270b31cbaec530b5943753bae8003344d80057140dde7bdea0505c8e60c07',
			data: undefined,
			executionGasUsed: 24893n,
			gas: 16752322n,
			logs: [
				{
					address: '0x6902690269026902690269026902690269026902',
					data: '0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000770617573696e6700000000000000000000000000000000000000000000000000',
					topics: ['0xc32e6d5d6d1de257f64eac19ddb1f700ba13527983849c9486b1ab007ea28381'],
				},
			],
			rawData: '0x',
			selfdestruct: new Set(),
		})
		// assert it's paused
		expect(await client.contract(SuperchainConfig.read.paused())).toMatchObject({ data: true })
		// unpause it
		expect(
			await client.contract({
				from: client.op.GUARDIAN,
				createTransaction: true,
				...SuperchainConfig.write.unpause(),
			}),
		).toEqual({
			txHash: '0x5395668bd4fe43e49f0a7ad7297f90e92fb6340da58b469f252f777000c81eee',
			createdAddresses: new Set(),
			data: undefined,
			executionGasUsed: 4146n,
			gas: 16773069n,
			gasRefund: 4800n,
			logs: [
				{
					address: '0x6902690269026902690269026902690269026902',
					data: '0x',
					topics: ['0xa45f47fdea8a1efdd9029a5691c7f759c32b7c698632b563573e155625d16933'],
				},
			],
			rawData: '0x',
			selfdestruct: new Set(),
		})
		// assert it's unpaused
		expect(await client.contract(SuperchainConfig.read.paused())).toMatchObject({ data: false })
	})
})
