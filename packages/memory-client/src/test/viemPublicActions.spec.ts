import { beforeEach, describe, expect, it } from 'bun:test'
import { prefundedAccounts } from '@tevm/base-client'
import { getAlchemyUrl, simpleContract } from '@tevm/test-utils'
import { type Address, type Hex } from '@tevm/utils'
import { type PublicActions, encodeFunctionData, numberToHex, parseEther, parseGwei } from 'viem'
import type { MemoryClient } from '../MemoryClient.js'
import { createMemoryClient } from '../createMemoryClient.js'

const eventAbi = {
	event: {
		inputs: [
			{
				indexed: true,
				name: 'from',
				type: 'address',
			},
			{
				indexed: true,
				name: 'to',
				type: 'address',
			},
			{
				indexed: true,
				name: 'tokenId',
				type: 'uint256',
			},
		],
		name: 'Transfer',
		type: 'event',
	},
} as const

describe('viemPublicActions', () => {
	let mc: MemoryClient
	let deployTxHash: Hex
	let c = {
		simpleContract: simpleContract.withAddress(`0x${'00'.repeat(20)}`),
	}

	beforeEach(async () => {
		mc = createMemoryClient()
		const deployResult = await mc.tevmDeploy({
			bytecode: simpleContract.bytecode,
			abi: simpleContract.abi,
			args: [420n],
		})
		if (!deployResult.createdAddress) {
			throw new Error('contract never deployed')
		}
		c = {
			simpleContract: simpleContract.withAddress(deployResult.createdAddress),
		}
		if (!deployResult.txHash) {
			throw new Error('txHash not found')
		}
		deployTxHash = deployResult.txHash
		await mc.tevmMine()
	})

	const tests: Record<keyof PublicActions, () => void> = {
		call: () => {
			it('should work', async () => {
				expect(
					await mc.call({
						to: c.simpleContract.address,
						data: encodeFunctionData(simpleContract.read.get()),
					}),
				).toEqual({
					data: '0x00000000000000000000000000000000000000000000000000000000000001a4',
				})
			})
		},
		createBlockFilter: () => {
			it.todo('works', async () => {
				expect(await mc.createBlockFilter()).toMatchSnapshot()
			})
		},
		createContractEventFilter: async () => {
			it.todo('works', async () => {
				const filter = await mc.createContractEventFilter({
					abi: c.simpleContract.abi,
				})
				expect(filter.id).toBeDefined()
				expect(filter.type).toBe('event')
				expect(filter.args).toBeUndefined()
				expect(filter.eventName).toBeUndefined()
			})
		},
		createEventFilter: () => {
			it.todo('works with no args', async () => {
				const filter = await mc.createEventFilter()
				expect(filter.id).toBeDefined()
				expect(filter.type).toBe('event')
				expect(filter.args).toBeUndefined()
				expect(filter.abi).toBeUndefined()
				expect(filter.eventName).toBeUndefined()
			})

			it.todo('works with args: address', async () => {
				await mc.createEventFilter({
					address: `0x${'69'.repeat(20)}`,
				})
			})

			it.todo('works with args: event', async () => {
				const filter = await mc.createEventFilter(eventAbi)
				expect(filter.args).toBeUndefined()
				// @ts-expect-errory TODO this is a viem test copy pasted why is type not working?
				expect(filter.abi).toEqual([eventAbi])
				expect(filter.eventName).toEqual('Transfer')
			})
		},
		createPendingTransactionFilter: () => {
			it.todo('should work')
		},
		estimateContractGas: () => {
			it('should work', async () => {
				expect(await mc.estimateContractGas(c.simpleContract.write.set(69n))).toBe(16771823n)
			})
		},
		estimateFeesPerGas: () => {},
		estimateGas: () => {
			it('should work', async () => {
				expect(
					await mc.estimateGas({
						to: c.simpleContract.address,
						data: encodeFunctionData(simpleContract.write.set(69n)),
					}),
				).toBe(16771823n)
			})
		},
		estimateMaxPriorityFeePerGas: () => {},
		getBalance: () => {
			it.todo('should work', async () => {
				expect(await mc.getBalance({ address: prefundedAccounts[0] as Address })).toBe(parseEther('1000'))
			})
		},
		getBlobBaseFee: () => {
			it.todo('should work', async () => {
				const TODO = 0n
				expect(await mc.getBlobBaseFee()).toBe(TODO)
			})
		},
		getBlock: () => {
			it.todo('should work with latest', async () => {
				expect(await mc.getBlock({ blockTag: 'latest', includeTransactions: true })).toMatchSnapshot()
			})

			it.todo('should work with blocknumber', async () => {
				expect(await mc.getBlock({ blockNumber: 100_000n, includeTransactions: false })).toMatchSnapshot()
			})
		},
		getBlockNumber: () => {
			it.todo('should work', async () => {
				const newClient = createMemoryClient()
				expect(await newClient.getBlockNumber()).toBe(0n)
			})
		},
		getBlockTransactionCount: () => {
			it.todo('should work', async () => {
				// TODO
				expect(await mc.getBlockTransactionCount({ blockTag: 'latest' })).toBe(10)
			})
		},
		getBytecode: () => {
			it('should work', async () => {
				// this will fail because bytecode is wrong
				expect(await mc.getBytecode({ address: c.simpleContract.address })).toBe(c.simpleContract.deployedBytecode)
			})
		},
		getChainId: () => {
			it('should work', async () => {
				expect(await mc.getChainId()).toBe(900)
			})
		},
		getContractEvents: () => {},
		getEnsAddress: () => {
			const mainnetClient = createMemoryClient({
				fork: {
					url: getAlchemyUrl('mainnet'),
				},
			})
			it.todo('should work', async () => {
				expect(await mainnetClient.getEnsAddress({ name: 'vitalik.eth' })).toBe('0x0')
			})
		},
		getEnsAvatar: () => {
			const mainnetClient = createMemoryClient({
				fork: {
					url: getAlchemyUrl('mainnet'),
				},
			})
			it.todo('should work', async () => {
				expect(await mainnetClient.getEnsAvatar({ name: 'vitalik.eth' })).toBe('0x0')
			})
		},
		getEnsName: () => {},
		getEnsResolver: () => {},
		getEnsText: () => {},
		getFeeHistory: () => {},
		getFilterChanges: () => {},
		getFilterLogs: () => {},
		getGasPrice: () => {
			it('should work', async () => {
				const mc = createMemoryClient()
				expect(await mc.getGasPrice()).toBe(parseGwei('1'))
			})
		},
		getLogs: () => {
			it.todo('should work', async () => {
				const filter = await mc.createEventFilter(eventAbi)
				const logs = await mc.getLogs(filter)
				expect(logs).toHaveLength(0)
			})
		},
		getProof: () => {
			it.todo('should work', async () => {
				expect(
					await mc.getProof({ address: c.simpleContract.address, storageKeys: [numberToHex(0)] }),
				).toMatchSnapshot()
			})
		},
		getStorageAt: () => {
			it('should work', async () => {
				expect(await mc.getStorageAt({ address: c.simpleContract.address, slot: numberToHex(0) })).toBe(
					// TODO why does this have to be size 2?
					numberToHex(420, { size: 2 }),
				)
			})
		},
		getTransaction: () => {
			it.todo('should work', async () => {
				expect(await mc.getTransaction({ hash: deployTxHash })).toMatchSnapshot()
			})
		},
		getTransactionConfirmations: () => {
			it.todo('should work', async () => {
				expect(await mc.getTransactionConfirmations({ hash: deployTxHash })).toBe(1n)
			})
		},
		getTransactionCount: () => {
			it.todo('should work', async () => {
				// TODO
				expect(await mc.getTransactionCount({ address: prefundedAccounts[0] as Address })).toBe(0)
			})
		},
		getTransactionReceipt: () => {
			it('should work', async () => {
				const { blockHash, ...receipt } = await mc.getTransactionReceipt({ hash: deployTxHash })
				expect(blockHash).toStartWith('0x')
				expect(receipt).toMatchSnapshot()
			})
		},
		multicall: () => {},
		prepareTransactionRequest: () => {},
		readContract: () => {
			it('should work', async () => {
				expect(await mc.readContract(c.simpleContract.read.get())).toBe(420n)
			})
		},
		sendRawTransaction: () => {},
		simulateContract: () => {
			it('should work', async () => {
				expect(await mc.simulateContract(c.simpleContract.write.set(99999n))).toMatchSnapshot()
			})
		},
		uninstallFilter: () => {},
		verifyMessage: () => {},
		verifyTypedData: () => {},
		watchContractEvent: () => {},
		waitForTransactionReceipt: () => {},
		watchBlockNumber: () => {},
		watchBlocks: () => {},
		watchEvent: () => {},
		watchPendingTransactions: () => {},
	}

	Object.entries(tests).forEach(([actionName, actionTests]) => {
		if (actionName !== 'getStorageAt') {
			// return
		}
		describe(actionName, actionTests)
	})
})
