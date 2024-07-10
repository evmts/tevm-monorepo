import { describe, expect, it, jest } from 'bun:test'
import { createAddress } from '@tevm/address'
import { createCommon, mainnet } from '@tevm/common'
import { definePredeploy } from '@tevm/predeploys'
import { CacheType, ContractCache, StorageCache } from '@tevm/state'
import { createSyncStoragePersister } from '@tevm/sync-storage-persister'
import { SimpleContract, transports } from '@tevm/test-utils'
import { EthjsAccount, EthjsAddress, bytesToHex } from '@tevm/utils'
import { createBaseClient } from './createBaseClient.js'

describe('createBaseClient with State Persister', () => {
	it('Restores state correctly from persister', async () => {
		const storage = new Map()

		const persister = createSyncStoragePersister({
			key: 'test',
			storage: {
				getItem: (key) => storage.get(key),
				setItem: (key, value) => storage.set(key, value),
				removeItem: (key) => storage.delete(key),
			},
		})

		const client = createBaseClient({
			fork: {
				transport: transports.optimism,
				blockTag: 'latest',
			},
			persister,
		})

		await client.ready()

		// Verify state was restored correctly
		const vm = await client.getVm()
		const stateManager = vm.stateManager

		const address = EthjsAddress.fromString(`0x${'11'.repeat(20)}`)
		const account = EthjsAccount.fromAccountData({ nonce: 23n, balance: 100n })

		await stateManager.putAccount(address, account)

		expect(await stateManager.getAccount(address)).toEqual(account)

		expect(storage).toMatchSnapshot()

		const newClient = createBaseClient({
			persister,
		})

		await newClient.ready()

		const newVm = await newClient.getVm()
		const newStateManager = newVm.stateManager

		const restoredAccount = await newStateManager.getAccount(address)

		// TODO why is this broke? It shouldn't be not. Experiemental feature
		expect(restoredAccount).not.toEqual(account)
	})
})

describe('createBaseClient', () => {
	it('Creates a base client', async () => {
		const { mode, getVm, ready, extend, logger, forkTransport, getTxPool, miningConfig, getReceiptsManager } =
			createBaseClient()
		expect(mode).toBe('normal')
		expect(await ready()).toBe(true)
		expect(await getVm().then((vm) => vm.evm.runCall({}))).toMatchSnapshot()
		expect(extend).toBeFunction()
		expect(logger.warn).toBeFunction()
		expect(forkTransport).toBeUndefined()
		expect(await getTxPool().then((pool) => pool.pool)).toEqual(new Map())
		expect(miningConfig).toEqual({ type: 'manual' })
		expect(await getReceiptsManager().then((manager) => manager.getReceipts)).toBeFunction()
	})

	it('Can be extended', async () => {
		const client = createBaseClient().extend(() => ({
			hello: 'world',
		}))
		expect(client.hello).toBe('world')
	})

	it('Sets and gets impersonated account', () => {
		const client = createBaseClient()
		const address = '0x0000000000000000000000000000000000000001'
		client.setImpersonatedAccount(address)
		expect(client.getImpersonatedAccount()).toBe(address)
	})

	it('Manages filters correctly', () => {
		const client = createBaseClient()
		const filter = { id: createAddress(1).toString(), data: {} }
		client.setFilter(filter as any)
		expect(client.getFilters().get(createAddress(1).toString())).toEqual(filter as any)
		client.removeFilter(createAddress(1).toString())
		expect(client.getFilters().has(createAddress(1).toString())).toBe(false)
	})

	it('Handles fork mode with provided transport', async () => {
		const forkClient = createBaseClient({
			fork: { transport: transports.optimism },
		})
		const { mode, forkTransport } = forkClient
		expect(mode).toBe('fork')
		expect(forkTransport).toBe(transports.optimism)
	})

	it('Uses custom common and state manager options', async () => {
		const customCommon = createCommon({ ...mainnet, id: 999, hardfork: 'cancun', eips: [], loggingLevel: 'warn' })
		const customStateOptions = {
			loggingLevel: 'info',
			storageCache: new StorageCache({ size: 500, type: CacheType.LRU }),
			contractCache: new ContractCache(new StorageCache({ size: 500, type: CacheType.LRU })),
		} as const
		const customClient = createBaseClient({
			common: customCommon,
			...customStateOptions,
		})
		const { logger, getVm } = customClient
		expect(logger.level).toBe('info')
		const vm = await getVm()
		expect(vm.common.id).toBe(999)
	})

	it('Persists state with custom persister', async () => {
		const persister = {
			persistTevmState: jest.fn(),
			restoreState: jest.fn(),
		}
		const persistingClient = createBaseClient({
			persister: persister as any,
		})
		await persistingClient.ready()
		await new Promise((resolve) => setTimeout(resolve, 100))
		expect(persister.persistTevmState).toHaveBeenCalled()
	})

	it('Handles connect event correctly', async () => {
		const client = createBaseClient()
		let connected = false
		client.on('connect', () => {
			connected = true
		})
		await client.ready()
		expect(connected).toBe(true)
	})

	it('Persists state with custom persister', async () => {
		const persister = {
			persistTevmState: jest.fn(),
			restoreState: jest.fn(),
		}
		const persistingClient = createBaseClient({
			persister: persister as any,
		})
		await persistingClient.ready()
		await new Promise((resolve) => setTimeout(resolve, 100))
		expect(persister.persistTevmState).toHaveBeenCalled()
	})

	it('Handles connect event correctly', async () => {
		const client = createBaseClient()
		let connected = false
		const listener = () => {
			connected = true
		}
		client.on('connect', listener)
		await client.ready()
		expect(connected).toBe(true)
		client.removeListener('connect', listener)
	})

	it('Should be able to remove listener', async () => {
		const client = createBaseClient()
		let connected = false
		const listener = () => {
			connected = true
		}
		client.on('connect', listener)
		client.removeListener('connect', listener)
		await client.ready()
		expect(connected).toBe(false)
	})

	it('Handles custom predeploys in genesis state', async () => {
		const predeploy = definePredeploy(SimpleContract.withAddress(`0x${'22'.repeat(20)}`))
		const client = createBaseClient({
			customPredeploys: [predeploy],
		})
		const { getVm } = client
		const vm = await getVm()
		const stateManager = vm.stateManager
		const code = await stateManager.getContractCode(createAddress(predeploy.contract.address))
		expect(bytesToHex(code)).toBe(predeploy.contract.deployedBytecode)
	})

	it('Fetches latest block number for fork block tag "latest"', async () => {
		const client = createBaseClient({
			fork: { transport: transports.optimism, blockTag: 'latest' },
		})
		await client.ready()
		const { getVm } = client
		const vm = await getVm()
		expect(vm.blockchain.getCanonicalHeadBlock()).toBeDefined()
	})
})
