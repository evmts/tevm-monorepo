import { beforeEach, describe, expect, it } from 'bun:test'
import { mainnet } from '@tevm/common'
import { SimpleContract } from '@tevm/contract'
import { transports } from '@tevm/test-utils'
import { type Hex, encodeFunctionData, pad, parseEther, parseGwei, testActions, toHex } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { call } from 'viem/actions'
import type { MemoryClient } from '../../MemoryClient.js'
import { createMemoryClient } from '../../createMemoryClient.js'

let mc: MemoryClient
let c = {
	simpleContract: SimpleContract.withAddress(`0x${'00'.repeat(20)}`),
}

const forkBlock = 20055380n

beforeEach(async () => {
	mc = createMemoryClient({
		common: mainnet,
		fork: {
			transport: transports.mainnet,
			blockTag: forkBlock,
		},
	})
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
	await mc.extend(testActions({ mode: 'anvil' })).mine({ blocks: 1 })
	expect(await mc.getBlockNumber()).toBe(forkBlock + 1n)
})

// anvil account 0
const account = privateKeyToAccount('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80')

describe('call', () => {
	it(
		'should work',
		async () => {
			expect(
				await mc.call({
					to: c.simpleContract.address,
					data: encodeFunctionData(c.simpleContract.read.get()),
				}),
			).toEqual({
				data: '0x00000000000000000000000000000000000000000000000000000000000001a4',
			})
		},
		{ timeout: 60_000 },
	)

	// Below tests are copied from viem
	// https://github.com/wevm/viem/blob/main/src/actions/public/call.test.ts
	const wagmiContractAddress = '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2'
	const name4bytes = '0x06fdde03'
	const mint4bytes = '0x1249c58b'
	const mintWithParams4bytes = '0xa0712d68'
	const fourTwenty = '00000000000000000000000000000000000000000000000000000000000001a4'
	// const sixHundred = '0000000000000000000000000000000000000000000000000000000000aaaaaa'

	it(
		'zero data',
		async () => {
			const { data } = await call(mc, {
				data: mint4bytes,
				account,
				to: wagmiContractAddress,
			})
			expect(data).toBeUndefined()
		},
		{ timeout: 60_000 },
	)

	it(
		'args: blockNumber',
		async () => {
			const { data } = await call(mc, {
				blockNumber: 15564164n,
				data: `${mintWithParams4bytes}${fourTwenty}`,
				account,
				to: wagmiContractAddress,
			})
			expect(data).toBeUndefined()
		},
		{ timeout: 60_000 },
	)

	it(
		'args: override',
		async () => {
			const fakeName = 'NotWagmi'

			// layout of strings in storage
			const nameSlot = toHex(0, { size: 32 })
			const fakeNameHex = toHex(fakeName)
			// we don't divide by 2 because length must be length * 2 if word is strictly less than 32 bytes
			const bytesLen = fakeNameHex.length - 2

			expect(bytesLen).toBeLessThanOrEqual(62)

			const slotValue = `${pad(fakeNameHex, { dir: 'right', size: 31 })}${toHex(bytesLen, { size: 1 }).slice(2)}` as Hex

			const { data } = await call(mc, {
				data: name4bytes,
				to: wagmiContractAddress,
				stateOverride: [
					{
						address: wagmiContractAddress,
						stateDiff: [
							{
								slot: nameSlot,
								value: slotValue,
							},
						],
					},
				],
			})

			expect(data).toMatchSnapshot()
		},
		{ timeout: 60_000 },
	)

	it(
		'fee cap too high',
		async () => {
			expect(
				call(mc, {
					data: `${mintWithParams4bytes}${fourTwenty}`,
					account,
					to: wagmiContractAddress,
					maxFeePerGas: 2n ** 256n - 1n + 1n,
				}).catch((e) => e),
			).toMatchSnapshot()
		},
		{ timeout: 60_000 },
	)

	it(
		'gas too low',
		async () => {
			expect(
				await call(mc, {
					data: `${mintWithParams4bytes}${fourTwenty}`,
					account,
					to: wagmiContractAddress,
					gas: 100n,
				}).catch((e) => e),
			).toMatchSnapshot()

			expect(() =>
				call(mc, {
					data: `${mintWithParams4bytes}${fourTwenty}`,
					account,
					to: wagmiContractAddress,
					gas: 100n,
				}).then((e) => e),
			).toMatchSnapshot()
		},
		{ timeout: 60_000 },
	)

	it(
		'gas too high',
		async () => {
			expect(
				await call(mc, {
					account,
					to: account.address,
					value: 1n,
					gas: 100_000_000_000_000_000n,
				}).catch((e) => e),
			).toMatchSnapshot()
		},
		{ timeout: 60_000 },
	)

	it(
		'gas fee is less than block base fee',
		async () => {
			expect(
				await call(mc, {
					account,
					to: account.address,
					value: 1n,
					maxFeePerGas: 1n,
				}).catch((e) => e),
			).toMatchSnapshot()

			expect(
				await call(mc, {
					account,
					to: account.address,
					value: 1n,
					maxFeePerGas: 1n,
				}).catch((e) => e),
			).toMatchSnapshot()
		},
		{ timeout: 60_000 },
	)

	it(
		'nonce too low',
		async () => {
			expect(
				await call(mc, {
					account,
					to: account.address,
					value: 1n,
					nonce: 0,
				}).catch((e) => e.message),
			).toMatchSnapshot()
		},
		{ timeout: 60_000 },
	)

	it('insufficient funds', async () => {
		expect(
			await call(mc, {
				account,
				to: account.address,
				value: parseEther('100000'),
			}).catch((e) => e.message),
		).toMatchSnapshot()

		expect(
			await call(mc, {
				account,
				to: account.address,
				value: parseEther('100000'),
			}).catch((e) => e.message),
		).toBe('insufficient funds for gas * price + value')
	})

	it(
		'maxFeePerGas less than maxPriorityFeePerGas',
		async () => {
			expect(
				await call(mc, {
					data: `${mintWithParams4bytes}${fourTwenty}`,
					account: account.address,
					to: wagmiContractAddress,
					maxFeePerGas: parseGwei('20'),
					maxPriorityFeePerGas: parseGwei('22'),
				}).catch((e) => e.message),
			).toMatchSnapshot()
		},
		{ timeout: 60_000 },
	)

	it(
		'contract revert (contract error)',
		async () => {
			expect(
				await call(mc, {
					data: `${mintWithParams4bytes}${fourTwenty}`,
					account: account.address,
					to: wagmiContractAddress,
				}).catch((e) => e.message),
			).toMatchSnapshot()
		},
		{ timeout: 60_000 },
	)

	it(
		'contract revert (insufficient params)',
		async () => {
			expect(
				await call(mc, {
					data: mintWithParams4bytes,
					account,
					to: wagmiContractAddress,
				}).catch((e) => e.message),
			).toMatchSnapshot()
		},
		{ timeout: 60_000 },
	)

	it(
		'duplicate address',
		async () => {
			expect(
				await call(mc, {
					data: name4bytes,
					to: wagmiContractAddress,
					stateOverride: [
						{
							address: wagmiContractAddress,
							stateDiff: [
								{
									slot: `0x${fourTwenty}`,
									value: `0x${fourTwenty}`,
								},
							],
						},
						{
							address: wagmiContractAddress,
							stateDiff: [
								{
									slot: `0x${fourTwenty}`,
									value: `0x${fourTwenty}`,
								},
							],
						},
					],
				}).catch((e) => e.message),
			).toMatchSnapshot()
		},
		{ timeout: 60_000 },
	)

	it(
		'pass state and stateDiff',
		async () => {
			expect(
				await call(mc, {
					data: name4bytes,
					to: wagmiContractAddress,
					stateOverride: [
						// @ts-expect-error Cannot pass `state` and `stateDiff` at the same time
						{
							address: wagmiContractAddress,
							stateDiff: [
								{
									slot: `0x${fourTwenty}`,
									value: `0x${fourTwenty}`,
								},
							],
							state: [
								{
									slot: `0x${fourTwenty}`,
									value: `0x${fourTwenty}`,
								},
							],
						},
					],
				}).catch((e) => e.message),
			).toMatchSnapshot()
		},
		{ timeout: 60_000 },
	)
})
