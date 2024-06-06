import { beforeEach, describe, expect, it } from 'bun:test'
import { SimpleContract } from '@tevm/contract'
import { type Hex, encodeFunctionData, pad, parseEther, parseGwei, toHex, testActions } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { call } from 'viem/actions'
import type { MemoryClient } from '../../MemoryClient.js'
import { createMemoryClient } from '../../createMemoryClient.js'

let mc: MemoryClient
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
	await mc.extend(testActions({ mode: 'anvil' })).mine({ blocks: 1 })
	expect(await mc.getBlockNumber()).toBe(1n)
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

	it.todo(
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

	it.todo(
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

	it.todo(
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

	it.todo(
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

	it.todo(
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

	it.todo(
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

	it.todo(
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

	it.todo(
		'nonce too low',
		async () => {
			expect(
				await call(mc, {
					account,
					to: account.address,
					value: 1n,
					nonce: 0,
				}).catch((e) => e.message),
			).toEqual(`
      [CallExecutionError: Nonce provided for the transaction is lower than the current nonce of the account.
      Try increasing the nonce or find the latest nonce with \`getTransactionCount\`.

      Raw Call Arguments:
        from:   0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
        to:     0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
        value:  0.000000000000000001 ETH
        nonce:  0

      Details: nonce too low
      Version: viem@1.0.2]
    `)
		},
		{ timeout: 60_000 },
	)

	it.todo('insufficient funds', async () => {
		expect(
			await call(mc, {
				account,
				to: account.address,
				value: parseEther('100000'),
			}).catch((e) => e.message),
		).toBe(`
      [CallExecutionError: The total cost (gas * gas fee + value) of executing this transaction exceeds the balance of the account.

      This error could arise when the account does not have enough funds to:
       - pay for the total gas fee,
       - pay for the value to send.
       
      The cost of the transaction is calculated as \`gas * gas fee + value\`, where:
       - \`gas\` is the amount of gas needed for transaction to execute,
       - \`gas fee\` is the gas fee,
       - \`value\` is the amount of ether to send to the recipient.
       
      Raw Call Arguments:
        from:   0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
        to:     0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
        value:  100000 ETH

      Details: Insufficient funds for gas * price + value
      Version: viem@1.0.2]
    `)

		expect(
			await call(mc, {
				account,
				to: account.address,
				value: parseEther('100000'),
			}).catch((e) => e.message),
		).toBe('insufficient funds for gas * price + value')
	})

	it.todo(
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
			).toBe(`
      [CallExecutionError: The provided tip (\`maxPriorityFeePerGas\` = 22 gwei) cannot be higher than the fee cap (\`maxFeePerGas\` = 20 gwei).

      Raw Call Arguments:
        from:                  0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
        to:                    0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2
        data:                  0xa0712d6800000000000000000000000000000000000000000000000000000000000001a4
        maxFeePerGas:          20 gwei
        maxPriorityFeePerGas:  22 gwei

      Version: viem@1.0.2]
    `)
		},
		{ timeout: 60_000 },
	)

	it.todo(
		'contract revert (contract error)',
		async () => {
			expect(
				await call(mc, {
					data: `${mintWithParams4bytes}${fourTwenty}`,
					account: account.address,
					to: wagmiContractAddress,
				}).catch((e) => e.message),
			).toBe(
				`
      [CallExecutionError: Execution reverted with reason: revert: Token ID is taken.

      Raw Call Arguments:
        from:  0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
        to:    0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2
        data:  0xa0712d6800000000000000000000000000000000000000000000000000000000000001a4

      Details: execution reverted: revert: Token ID is taken
      Version: viem@1.0.2]
    `,
			)
		},
		{ timeout: 60_000 },
	)

	it.todo(
		'contract revert (insufficient params)',
		async () => {
			expect(
				await call(mc, {
					data: mintWithParams4bytes,
					account,
					to: wagmiContractAddress,
				}).catch((e) => e.message),
			).toBe(`
      [CallExecutionError: Execution reverted for an unknown reason.

      Raw Call Arguments:
        from:  0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
        to:    0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2
        data:  0xa0712d68

      Details: execution reverted
      Version: viem@1.0.2]
    `)
		},
		{ timeout: 60_000 },
	)

	it.todo(
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
			).toBe(`
        [CallExecutionError: State for account "0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2" is set multiple times.

        Raw Call Arguments:
          from:  0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
          to:    0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2
          data:  0x06fdde03
          State Override:
            0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2:
              stateDiff:
                0x00000000000000000000000000000000000000000000000000000000000001a4: 0x00000000000000000000000000000000000000000000000000000000000001a4
            0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2:
              stateDiff:
                0x00000000000000000000000000000000000000000000000000000000000001a4: 0x00000000000000000000000000000000000000000000000000000000000001a4

        Version: viem@1.0.2]
      `)
		},
		{ timeout: 60_000 },
	)

	it.todo(
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
			).toBe(`
        [CallExecutionError: state and stateDiff are set on the same account.

        Raw Call Arguments:
          from:  0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
          to:    0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2
          data:  0x06fdde03
          State Override:
            0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2:
              state:
                0x00000000000000000000000000000000000000000000000000000000000001a4: 0x00000000000000000000000000000000000000000000000000000000000001a4
              stateDiff:
                0x00000000000000000000000000000000000000000000000000000000000001a4: 0x00000000000000000000000000000000000000000000000000000000000001a4

        Version: viem@1.0.2]
      `)
		},
		{ timeout: 60_000 },
	)
})
