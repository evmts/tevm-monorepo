import { beforeEach, describe, expect, it } from 'bun:test'
import { prefundedAccounts } from '@tevm/base-client'
import { mainnet } from '@tevm/common'
import { simpleContract, transports } from '@tevm/test-utils'
import { type Address, type Hex } from '@tevm/utils'
import { loadKZG } from 'kzg-wasm'
import { type PublicActions, bytesToHex, encodeFunctionData, numberToHex, parseGwei } from 'viem'
import type { MemoryClient } from '../MemoryClient.js'
import { createMemoryClient } from '../createMemoryClient.js'

const mainnetTransport = transports.mainnet

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
			it('should work', async () => {
				expect(await mc.getBalance({ address: prefundedAccounts[0] as Address })).toBe(999999999999998965953n)
			})
		},
		getBlobBaseFee: () => {
			it.todo('should work', async () => {
				expect(await mc.getBlobBaseFee()).toBe(1n)
			})
		},
		getBlock: () => {
			it('should work with blockHash', async () => {
				const vm = await mc._tevm.getVm()
				const latest = await vm.blockchain.getCanonicalHeadBlock()
				const { hash, timestamp, transactions, ...result } = await mc.getBlock({
					blockHash: bytesToHex(latest.header.hash()),
					includeTransactions: true,
				})
				expect(hash).toStartWith('0x')
				expect(timestamp).toBeDefined()
				expect(transactions.map((tx) => ({ ...tx, blockHash: 'redacted' }))).toMatchSnapshot()
				expect(result).toMatchSnapshot()
			})

			it('should work with blocknumber', async () => {
				const { timestamp, hash, transactions, ...result } = await mc.getBlock({
					blockNumber: 0n,
					includeTransactions: true,
				})
				expect(hash).toStartWith('0x')
				expect(timestamp).toBeDefined()
				expect(transactions.map((tx) => ({ ...tx, blockHash: 'redacted' }))).toMatchSnapshot()
				expect(result).toMatchSnapshot()
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
		getEnsAddress: async () => {
			const kzg = await loadKZG()
			const mainnetClient = createMemoryClient({
				common: Object.assign({ kzg }, mainnet),
				fork: {
					transport: mainnetTransport,
					blockTag: 19804639n,
				},
			})
			it(
				'should work',
				async () => {
					expect(await mainnetClient.getEnsAddress({ name: 'vitalik.eth' })).toBe(
						'0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
					)
				},
				{ timeout: 40_000 },
			)
		},
		getEnsAvatar: async () => {
			const kzg = await loadKZG()
			const mainnetClient = createMemoryClient({
				common: Object.assign({ kzg }, mainnet),
				fork: {
					transport: mainnetTransport,
					blockTag: 19804639n,
				},
			})
			// this test flakes sometimes from third party endpoints so disabled
			it.skip(
				'should work',
				async () => {
					expect(
						await mainnetClient.getEnsAvatar({
							name: 'vitalik.eth',
						}),
					).toBe('https://ipfs.io/ipfs/QmSP4nq9fnN9dAiCj42ug9Wa79rqmQerZXZch82VqpiH7U/image.gif')
				},
				{ timeout: 40_000 },
			)
		},
		getEnsName: async () => {
			const kzg = await loadKZG()
			const mainnetClient = createMemoryClient({
				common: Object.assign({ kzg }, mainnet),
				fork: {
					transport: mainnetTransport,
					blockTag: 19804639n,
				},
			})
			it(
				'should work',
				async () => {
					expect(await mainnetClient.getEnsName({ address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045' })).toBe(
						'vitalik.eth',
					)
				},
				{ timeout: 40_000 },
			)
		},
		getEnsResolver: async () => {
			const kzg = await loadKZG()
			const mainnetClient = createMemoryClient({
				common: Object.assign({ kzg }, mainnet),
				fork: {
					transport: mainnetTransport,
					blockTag: 19804639n,
				},
			})
			it(
				'should work',
				async () => {
					expect(await mainnetClient.getEnsResolver({ name: 'vitalik.eth' })).toBe(
						'0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41',
					)
				},
				{ timeout: 40_000 },
			)
		},
		getEnsText: async () => {
			const kzg = await loadKZG()
			const mainnetClient = createMemoryClient({
				common: Object.assign({ kzg }, mainnet),
				fork: {
					transport: mainnetTransport,
					blockTag: 19804639n,
				},
			})
			it.todo('should work', async () => {
				expect(await mainnetClient.getEnsText({ name: 'vitalik.eth', key: 'key' })).toBe(
					'0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
				)
			})
		},
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
			it('should work', async () => {
				const { blockHash, ...tx } = await mc.getTransaction({ hash: deployTxHash })
				expect(blockHash).toStartWith('0x')
				const vm = await mc._tevm.getVm()
				const block = await vm.blockchain.getCanonicalHeadBlock()
				expect(blockHash).toEqual(bytesToHex(block.header.hash()))
				expect(tx).toMatchSnapshot()
			})
		},
		getTransactionConfirmations: () => {
			it('should work', async () => {
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
		verifySiweMessage: () => {},
	}

	Object.entries(tests).forEach(([actionName, actionTests]) => {
		if (actionName !== 'getStorageAt') {
			// return
		}
		describe(actionName, actionTests)
	})
})
