import { beforeEach, describe, expect, it } from 'bun:test'
import { prefundedAccounts } from '@tevm/base-client'
import { mainnet, tevmDefault } from '@tevm/common'
import { SimpleContract, transports } from '@tevm/test-utils'
import { type Address, type Hex, hexToBytes } from '@tevm/utils'
import { loadKZG } from 'kzg-wasm'
import {
	type PublicActions,
	type WatchContractEventOnLogsParameter,
	bytesToHex,
	encodeFunctionData,
	numberToHex,
	parseGwei,
} from 'viem'
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'
import { prepareTransactionRequest, signTransaction } from 'viem/actions'
import { createSiweMessage } from 'viem/siwe'
import type { MemoryClient } from '../MemoryClient.js'
import { createMemoryClient } from '../createMemoryClient.js'

const privateKey = generatePrivateKey()

const account = privateKeyToAccount(privateKey)

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
		deployTxHash = deployResult.txHash
		await mc.tevmMine()
	})

	const tests: Record<keyof PublicActions, () => void> = {
		call: () => {
			it('should work', async () => {
				expect(
					await mc.call({
						to: c.simpleContract.address,
						data: encodeFunctionData(c.simpleContract.read.get()),
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
			it.todo('createPendingTransactionFilter work', async () => {
				expect(await mc.createPendingTransactionFilter()).toMatchSnapshot()
			})
		},
		estimateContractGas: () => {
			it('should work', async () => {
				expect(await mc.estimateContractGas(c.simpleContract.write.set(69n))).toBe(16770635n)
			})
		},
		estimateFeesPerGas: () => {
			it('should work', async () => {
				const block = await mc.getBlock()
				const { maxFeePerGas, maxPriorityFeePerGas } = await mc.estimateFeesPerGas()
				if (block.baseFeePerGas === null) throw new Error('baseFeePerGas is null')
				expect(maxFeePerGas).toBe(1000000001n)
				expect(maxPriorityFeePerGas).toMatchSnapshot()
			})
		},
		estimateGas: () => {
			it('should work', async () => {
				expect(
					await mc.estimateGas({
						to: c.simpleContract.address,
						data: encodeFunctionData(c.simpleContract.write.set(69n)),
					}),
				).toBe(16770635n)
			})
		},
		estimateMaxPriorityFeePerGas: () => {
			it('should work', async () => {
				expect(await mc.estimateMaxPriorityFeePerGas()).toMatchSnapshot()
			})
		},
		getBalance: () => {
			it('should work', async () => {
				expect(await mc.getBalance({ address: prefundedAccounts[0] as Address })).toBe(999999999999998882303n)
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

			// this is broken has a bug
			it.todo('should work with blocknumber', async () => {
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
			it('should work', async () => {
				const newClient = createMemoryClient()
				expect(await newClient.getBlockNumber()).toBe(0n)
			})
		},
		getBlockTransactionCount: () => {
			it('should work', async () => {
				expect(await mc.getBlockTransactionCount({ blockTag: 'latest' })).toBe(1)
			})
		},
		getBytecode: () => {
			it('should work', async () => {
				expect(await mc.getBytecode({ address: c.simpleContract.address })).toBe(c.simpleContract.deployedBytecode)
			})
		},
		getChainId: () => {
			it('should work', async () => {
				expect(await mc.getChainId()).toBe(900)
			})
		},
		getContractEvents: () => {
			it('getContractEvents should work', async () => {
				// do a thing first
				await mc.tevmCall({
					to: c.simpleContract.address,
					data: encodeFunctionData(c.simpleContract.write.set(69n)),
					createTransaction: true,
				})
				const events = mc.getContractEvents({
					address: c.simpleContract.address,
					abi: c.simpleContract.abi,
				})
				expect(events).toMatchSnapshot()
			})
		},
		getEnsAddress: async () => {
			it.todo(
				'should work',
				async () => {
					const kzg = await loadKZG()
					const mainnetClient = createMemoryClient({
						common: Object.assign({ kzg }, mainnet),
						fork: {
							transport: mainnetTransport,
							blockTag: 19804639n,
						},
					})
					expect(await mainnetClient.getEnsAddress({ name: 'vitalik.eth' })).toBe(
						'0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
					)
				},
				{ timeout: 40_000 },
			)
		},
		getEnsAvatar: async () => {
			it.todo(
				'should work',
				async () => {
					const kzg = await loadKZG()
					const mainnetClient = createMemoryClient({
						common: Object.assign({ kzg }, mainnet),
						fork: {
							transport: mainnetTransport,
							blockTag: 19804639n,
						},
					})
					expect(
						await mainnetClient.getEnsAvatar({
							name: 'wevm.eth',
						}),
					).toBe('https://euc.li/wevm.eth')
				},
				{ timeout: 40_000 },
			)
		},
		getEnsName: async () => {
			it.todo(
				'should work',
				async () => {
					const kzg = await loadKZG()
					const mainnetClient = createMemoryClient({
						common: Object.assign({ kzg }, mainnet),
						fork: {
							transport: mainnetTransport,
							blockTag: 19804639n,
						},
					})
					expect(await mainnetClient.getEnsName({ address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045' })).toBe(
						'vitalik.eth',
					)
				},
				{ timeout: 40_000 },
			)
		},
		getEnsResolver: async () => {
			it.todo(
				'should work',
				async () => {
					const kzg = await loadKZG()
					const mainnetClient = createMemoryClient({
						common: Object.assign({ kzg }, mainnet),
						fork: {
							transport: mainnetTransport,
							blockTag: 19804639n,
						},
					})
					expect(await mainnetClient.getEnsResolver({ name: 'vitalik.eth' })).toBe(
						'0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41',
					)
				},
				{ timeout: 40_000 },
			)
		},
		getEnsText: async () => {
			it.todo('should work', async () => {
				const kzg = await loadKZG()
				const mainnetClient = createMemoryClient({
					common: Object.assign({ kzg }, mainnet),
					fork: {
						transport: mainnetTransport,
						blockTag: 19804639n,
					},
				})
				expect(await mainnetClient.getEnsText({ name: 'vitalik.eth', key: 'key' })).toBe(
					'0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
				)
			})
		},
		getFeeHistory: () => {
			it.todo('should work', async () => {
				const blockTag = 19804639n
				const mainnetClient = createMemoryClient({
					common: mainnet,
					fork: {
						transport: mainnetTransport,
						blockTag,
					},
				})
				expect(
					await mainnetClient.getFeeHistory({ blockCount: 3, blockNumber: blockTag, rewardPercentiles: [0, 50, 100] }),
				).toMatchSnapshot()
			})
		},
		getFilterChanges: () => {
			it.todo('should work', async () => {
				const filter = await mc.createPendingTransactionFilter()
				expect(await mc.getFilterChanges({ filter })).toMatchSnapshot()
			})
		},
		getFilterLogs: () => {
			it.todo('should work', async () => {
				const filter = await mc.createEventFilter()
				expect(await mc.getFilterLogs({ filter })).toMatchSnapshot()
			})
		},
		getGasPrice: () => {
			it('should work', async () => {
				const mc = createMemoryClient()
				expect(await mc.getGasPrice()).toBe(parseGwei('1'))
			})
		},
		getLogs: () => {
			// this has a bug
			it.todo('should work', async () => {
				const filter = await mc.createEventFilter(eventAbi)
				const logs = await mc.getLogs(filter)
				expect(logs).toHaveLength(0)
			})
		},
		getProof: () => {
			// this has a bug
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
			it('should work', async () => {
				expect(await mc.getTransactionCount({ address: prefundedAccounts[0] as Address })).toBe(1)
			})
		},
		getTransactionReceipt: () => {
			it('should work', async () => {
				const { blockHash, ...receipt } = await mc.getTransactionReceipt({ hash: deployTxHash })
				expect(blockHash).toStartWith('0x')
				expect(receipt).toMatchSnapshot()
			})
		},
		multicall: () => {
			it('should work', async () => {
				const result = await mc.multicall({
					contracts: [c.simpleContract.read.get(), c.simpleContract.read.get(), c.simpleContract.read.get()],
				})
				expect(result).toMatchSnapshot()
			})
		},
		prepareTransactionRequest: () => {
			it('prepareTransactionRequest should work', async () => {
				const tx = await mc.prepareTransactionRequest({
					to: c.simpleContract.address,
					data: encodeFunctionData(c.simpleContract.write.set(69n)),
					chain: tevmDefault,
				})
				expect(tx).toMatchSnapshot()
			})
		},
		readContract: () => {
			it('should work', async () => {
				expect(await mc.readContract(c.simpleContract.read.get())).toBe(420n)
			})
		},
		sendRawTransaction: () => {
			// weird bug with tevm thinking tx is not signed
			it.todo('should work', async () => {
				const to = `0x${'69'.repeat(20)}` as const
				const request = await prepareTransactionRequest(mc, {
					account,
					to,
					value: 420n,
					chain: tevmDefault,
				})
				console.log('sending raw')
				const tx = await signTransaction(mc, request)
				const hash = await mc.sendRawTransaction({
					serializedTransaction: tx,
				})
				const txPool = await mc._tevm.getTxPool()
				expect(txPool.getByHash([hexToBytes(hash)])).toMatchSnapshot()
			})
		},
		simulateContract: () => {
			it('should work', async () => {
				expect(await mc.simulateContract(c.simpleContract.write.set(99999n))).toMatchSnapshot()
			})
		},
		uninstallFilter: () => {},
		verifyMessage: () => {
			it('verifyMessage should work', async () => {
				const message = 'hello'
				const signature = await account.signMessage({ message })
				expect(await mc.verifyMessage({ message, signature, address: account.address })).toBe(true)
			})
		},
		verifyTypedData: async () => {
			it('verifyTypedData should work', async () => {
				const message = {
					from: {
						name: 'Cow',
						wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
					},
					to: {
						name: 'Bob',
						wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
					},
					contents: 'Hello, Bob!',
				} as const

				const signature = await account.signTypedData({
					types: {
						Person: [
							{ name: 'name', type: 'string' },
							{ name: 'wallet', type: 'address' },
						],
						Mail: [
							{ name: 'from', type: 'Person' },
							{ name: 'to', type: 'Person' },
							{ name: 'contents', type: 'string' },
						],
					},
					primaryType: 'Mail',
					message,
				})
				expect(
					await mc.verifyTypedData({
						address: account.address,
						types: {
							Person: [
								{ name: 'name', type: 'string' },
								{ name: 'wallet', type: 'address' },
							],
							Mail: [
								{ name: 'from', type: 'Person' },
								{ name: 'to', type: 'Person' },
								{ name: 'contents', type: 'string' },
							],
						},
						primaryType: 'Mail',
						message,
						signature,
					}),
				).toBe(true)
			})
		},
		watchContractEvent: () => {
			it('watchContract should work', async () => {
				const logs: WatchContractEventOnLogsParameter<typeof c.simpleContract.abi> = []
				const unwatch = mc.watchContractEvent({
					abi: c.simpleContract.abi,
					address: c.simpleContract.address,
					poll: true,
					onLogs: (/**log*/) => {
						// todo need to add events to simpleContract
						logs.push()
					},
				})
				unwatch()
			})
		},
		waitForTransactionReceipt: () => {
			it('waitForTransactionReceipt hould work', async () => {
				const { txHash } = await mc.tevmCall({
					to: c.simpleContract.address,
					data: encodeFunctionData(c.simpleContract.write.set(69n)),
					createTransaction: true,
				})
				if (!txHash) throw new Error('txHash not found')
				await mc.mine({ blocks: 1 })
				const { blockHash, logs, ...receipt } = await mc.waitForTransactionReceipt({ hash: txHash })
				const vm = await mc._tevm.getVm()
				const block = await vm.blockchain.getCanonicalHeadBlock()
				expect(blockHash).toBe(bytesToHex(block.header.hash()))
				expect(receipt).toMatchSnapshot()
				expect(logs.map((log) => ({ ...log, blockHash: 'redacted' }))).toMatchSnapshot()
			})
		},
		watchBlockNumber: () => {
			it('watchBlockNumber should work', async () => {
				const resultPromises = [
					Promise.withResolvers<bigint>(),
					Promise.withResolvers<bigint>(),
					Promise.withResolvers<bigint>(),
					Promise.withResolvers<bigint>(),
					Promise.withResolvers<bigint>(),
				] as const
				const errors: Error[] = []
				const unwatch = mc.watchBlockNumber({
					poll: true,
					pollingInterval: 100,
					emitOnBegin: true,
					emitMissed: false,
					onError: (e) => errors.push(e),
					onBlockNumber: (blockNumber) => {
						resultPromises[Number(blockNumber)]?.resolve(blockNumber)
					},
				})
				for (let i = 1; i <= 4; i++) {
					expect(await resultPromises[i]?.promise).toBe(BigInt(i))
					await mc.tevmMine()
				}
				expect(errors).toHaveLength(0)
				unwatch()
			})
		},
		watchBlocks: () => {
			it('should work', async () => {
				const expectedBlock = Promise.withResolvers()
				const unwatch = mc.watchBlocks({
					poll: true,
					pollingInterval: 100,
					onBlock: (block) => {
						block.hash = '0xredacted'
						block.stateRoot = '0xredacted'
						block.parentHash = '0xredacted'
						block.timestamp = 69n
						expectedBlock.resolve(block)
					},
				})
				await mc.tevmMine()
				expect(await expectedBlock.promise).toMatchSnapshot()
				unwatch()
			})
		},
		watchEvent: () => {
			it.todo('should work', async () => {
				const expectedEvent = Promise.withResolvers()
				const unwatch = mc.watchEvent({
					poll: true,
					pollingInterval: 100,
					onLogs: (event) => {
						expectedEvent.resolve(event)
					},
				})
				await mc.tevmCall({
					to: c.simpleContract.address,
					data: encodeFunctionData(c.simpleContract.write.set(69n)),
					createTransaction: true,
				})
				expect(await expectedEvent.promise).toMatchSnapshot()
				unwatch()
			})
		},
		watchPendingTransactions: () => {
			it.todo('should work', async () => {
				const expectedTx = Promise.withResolvers()
				const unwatch = mc.watchPendingTransactions({
					poll: true,
					pollingInterval: 100,
					onTransactions: (tx) => {
						expectedTx.resolve(tx)
					},
				})
				await mc.tevmCall({
					to: c.simpleContract.address,
					data: encodeFunctionData(c.simpleContract.write.set(69n)),
					createTransaction: true,
				})
				expect(await expectedTx.promise).toMatchSnapshot()
				unwatch()
			})
		},
		verifySiweMessage: () => {
			it('should work', async () => {
				const message = createSiweMessage({
					address: account.address,
					chainId: tevmDefault.id,
					domain: 'tevm.sh',
					nonce: 'foobarbaz',
					uri: 'https://tevm.sh',
					version: '1',
				})

				const signature = await account.signMessage({ message })

				expect(await mc.verifySiweMessage({ message, signature })).toBe(true)
			})
		},
	}

	Object.entries(tests).forEach(([actionName, actionTests]) => {
		if (actionName !== 'multicall') {
			// return
		}
		describe(actionName, actionTests)
	})
})
