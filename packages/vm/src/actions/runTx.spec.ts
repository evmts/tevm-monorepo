import { afterEach, beforeEach, describe, expect, it } from 'bun:test'
import { EventEmitter } from 'node:events'

// Increase max listeners globally to prevent warnings
EventEmitter.defaultMaxListeners = 100

import { Block } from '@tevm/block'
import { createChain } from '@tevm/blockchain'
import { mainnet } from '@tevm/common'
import { SimpleContract } from '@tevm/contract'
import { InsufficientFundsError, InvalidGasPriceError, NonceTooLowError } from '@tevm/errors'
import { createEvm } from '@tevm/evm'
import { createStateManager } from '@tevm/state'
import { BlobEIP4844Transaction, createImpersonatedTx } from '@tevm/tx'
import {
	bytesToHex,
	createAccount,
	createAddressFromString,
	encodeFunctionData,
	type Hex,
	hexToBytes,
	PREFUNDED_ACCOUNTS,
	parseEther,
	randomBytes,
} from '@tevm/utils'
import { createVm } from '../createVm.js'
import type { Vm } from '../Vm.js'
import { runTx } from './runTx.js'

describe('runTx', () => {
	let vm: Vm

	beforeEach(async () => {
		const common = mainnet
		const stateManager = createStateManager({})
		const blockchain = await createChain({ common })
		const evm = await createEvm({ common, stateManager, blockchain })
		vm = createVm({
			common,
			evm,
			stateManager,
			blockchain,
			activatePrecompiles: false,
		})
	})

	afterEach(() => {
		// Clean up event listeners after each test
		if (vm?.evm?.events) {
			vm.evm.events.removeAllListeners()
		}
	})

	it('should execute a transaction successfully', async () => {
		const tx = createImpersonatedTx({
			impersonatedAddress: createAddressFromString(PREFUNDED_ACCOUNTS[0].address),
			nonce: 0,
			gasLimit: 21064,
			maxFeePerGas: 8n,
			maxPriorityFeePerGas: 1n,
			to: createAddressFromString(`0x${'69'.repeat(20)}`),
			value: 1n,
		})
		const block = new Block({ common: mainnet })
		const result = await runTx(vm)({
			tx,
			block,
			skipNonce: true,
			skipBalance: true,
		})

		expect(result.execResult.exceptionError).toBeUndefined()

		expect((await vm.stateManager.getAccount(createAddressFromString(`0x${'69'.repeat(20)}`)))?.balance).toBe(1n)

		expect(result).toMatchSnapshot()
	})

	it('should execute a contract call successfully', async () => {
		const sender = createAddressFromString(`0x${'69'.repeat(20)}`)

		await vm.stateManager.putAccount(
			sender,
			createAccount({
				balance: parseEther('69'),
				nonce: 3n,
			}),
		)

		const contract = SimpleContract.withAddress(`0x${'02'.repeat(20)}`)

		await vm.stateManager.putCode(createAddressFromString(contract.address), hexToBytes(contract.deployedBytecode))

		const setTx = createImpersonatedTx({
			impersonatedAddress: sender,
			nonce: 3,
			// This is exact
			gasLimit: 44884,
			maxFeePerGas: 8n,
			maxPriorityFeePerGas: 1n,
			to: createAddressFromString(contract.address),
			data: hexToBytes(encodeFunctionData(contract.write.set(20n))),
		})
		const block = new Block({ common: mainnet })

		const writeResult = await runTx(vm)({
			tx: setTx,
			block,
			skipNonce: false,
			skipBalance: false,
		})

		expect(writeResult.execResult.exceptionError).toBeUndefined()
		expect(writeResult.execResult.returnValue).toMatchSnapshot()
		expect(writeResult.execResult.logs).toMatchSnapshot()

		const getTx = createImpersonatedTx({
			impersonatedAddress: sender,
			nonce: 4,
			gasLimit: 40000,
			maxFeePerGas: 8n,
			maxPriorityFeePerGas: 1n,
			to: createAddressFromString(contract.address),
			data: hexToBytes(encodeFunctionData(contract.read.get())),
		})
		const getResult = await runTx(vm)({
			tx: getTx,
			block,
			skipNonce: false,
			skipBalance: false,
		})

		expect(getResult.execResult.exceptionError).toBeUndefined()
		expect(getResult.execResult.returnValue).toMatchSnapshot()
		expect(getResult.execResult.logs).toMatchSnapshot()
	})

	it('should throw error for invalid block parameter', async () => {
		const tx = createImpersonatedTx({
			impersonatedAddress: createAddressFromString(PREFUNDED_ACCOUNTS[0].address),
			nonce: 0,
			gasLimit: 21064,
			maxFeePerGas: 8n,
			maxPriorityFeePerGas: 1n,
			to: createAddressFromString(`0x${'69'.repeat(20)}`),
			value: 1n,
		})
		const err = await runTx(vm)({ tx, block: undefined as any }).catch((e) => e)
		expect(err).toBeInstanceOf(Error)
		expect(err).toMatchSnapshot()
	})

	it('should throw InsufficientFundsError', async () => {
		const tx = createImpersonatedTx({
			impersonatedAddress: createAddressFromString(PREFUNDED_ACCOUNTS[0].address),
			nonce: 0,
			gasLimit: 21064,
			maxFeePerGas: 8n,
			maxPriorityFeePerGas: 1n,
			to: createAddressFromString(`0x${'69'.repeat(20)}`),
			value: parseEther('1000000'), // Exaggerated value
		})
		const block = new Block({ common: mainnet })

		const err = await runTx(vm)({
			tx,
			block,
			skipNonce: true,
			skipBalance: false,
		}).catch((e) => e)

		expect(err).toBeInstanceOf(InsufficientFundsError)
		expect(err).toMatchSnapshot()
	})

	it('should throw NonceTooLowError', async () => {
		const tx = createImpersonatedTx({
			impersonatedAddress: createAddressFromString(PREFUNDED_ACCOUNTS[0].address),
			nonce: 0,
			gasLimit: 21064,
			maxFeePerGas: 8n,
			maxPriorityFeePerGas: 1n,
			to: createAddressFromString(`0x${'69'.repeat(20)}`),
			value: 1n,
		})
		const block = new Block({ common: mainnet })
		await vm.stateManager.putAccount(
			createAddressFromString(PREFUNDED_ACCOUNTS[0].address),
			createAccount({
				balance: parseEther('1'),
				nonce: 5n, // Higher nonce
			}),
		)

		const err = await runTx(vm)({
			tx,
			block,
			skipNonce: false,
			skipBalance: true,
		}).catch((e) => e)

		expect(err).toBeInstanceOf(NonceTooLowError)
		expect(err).toMatchSnapshot()
	})

	it('should report access list', async () => {
		const tx = createImpersonatedTx({
			impersonatedAddress: createAddressFromString(PREFUNDED_ACCOUNTS[0].address),
			nonce: 0,
			gasLimit: 21064,
			maxFeePerGas: 8n,
			maxPriorityFeePerGas: 1n,
			to: createAddressFromString(`0x${'69'.repeat(20)}`),
			value: 1n,
		})
		const block = new Block({ common: mainnet })

		const result = await runTx(vm)({
			tx,
			block,
			skipNonce: true,
			skipBalance: true,
			reportAccessList: true,
		})

		expect(result.accessList).toBeDefined()
		expect(result).toMatchSnapshot()
	})

	it.todo('should throw InvalidGasPriceError for blob transactions', async () => {
		const sender = createAddressFromString(PREFUNDED_ACCOUNTS[0].address)

		await vm.stateManager.putAccount(
			sender,
			createAccount({
				balance: parseEther('1000'),
				nonce: 0n,
			}),
		)

		const tx = (BlobEIP4844Transaction as any)
			.fromTxData(
				{
					blobVersionedHashes: [randomBytes(32)],
					blobs: [randomBytes(32)],
					kzgCommitments: [randomBytes(32)],
					maxFeePerBlobGas: 1000000n,
					gasLimit: 0xffffffn,
					to: randomBytes(20),
				},
				{ common: mainnet.ethjsCommon },
			)
			.sign(randomBytes(32))

		const block = new Block({ common: mainnet })
		const err = await runTx(vm)({
			tx,
			block,
			skipNonce: true,
			skipBalance: false,
		}).catch((e) => e)

		expect(err).toBeInstanceOf(InvalidGasPriceError)
		expect(err).toMatchSnapshot()
	})

	it.todo('should throw EipNotEnabledError for blob transactions when EIP-4844 is not active', async () => {})

	it('should handle EIP-1559 transactions', async () => {
		const tx = createImpersonatedTx({
			impersonatedAddress: createAddressFromString(PREFUNDED_ACCOUNTS[0].address),
			nonce: 0,
			gasLimit: 21064,
			maxFeePerGas: 1000000n,
			maxPriorityFeePerGas: 500000n,
			to: createAddressFromString(`0x${'69'.repeat(20)}`),
			value: 1n,
		})
		const block = new Block({ common: mainnet })

		const result = await runTx(vm)({
			tx,
			block,
			skipNonce: true,
			skipBalance: true,
		})

		expect(result.execResult.exceptionError).toBeUndefined()
		expect(result).toMatchSnapshot()
	})

	it('should handle transactions with access list', async () => {
		const sender = createAddressFromString(`0x${'88'.repeat(20)}`)
		const contractAddress = createAddressFromString(`0x${'99'.repeat(20)}`)

		// Fund sender account
		await vm.stateManager.putAccount(
			sender,
			createAccount({
				balance: parseEther('100'),
				nonce: 0n,
			}),
		)

		// Deploy SimpleContract
		const contract = SimpleContract.withAddress(contractAddress.toString())
		await vm.stateManager.putCode(contractAddress, hexToBytes(contract.deployedBytecode))

		// Create transaction with access list
		// The access list pre-declares the contract address and storage slots that will be accessed
		// Note: accessList format needs to use address and storageKeys as hex strings for createImpersonatedTx
		const accessList = [
			{
				address: contractAddress.toString(),
				storageKeys: [
					// Storage slot 0 is where SimpleContract stores its value
					'0x0000000000000000000000000000000000000000000000000000000000000000' as Hex,
				],
			},
		]

		// First transaction: Set value with access list
		const setTx = createImpersonatedTx({
			impersonatedAddress: sender,
			nonce: 0,
			gasLimit: 50000,
			maxFeePerGas: 10n,
			maxPriorityFeePerGas: 2n,
			to: contractAddress,
			data: hexToBytes(encodeFunctionData(contract.write.set(42n))),
			accessList,
		})

		const block = new Block({ common: mainnet })
		const setResult = await runTx(vm)({
			tx: setTx,
			block,
			skipNonce: false,
			skipBalance: false,
		})

		expect(setResult.execResult.exceptionError).toBeUndefined()
		expect(setResult.execResult.executionGasUsed).toBeGreaterThan(0n)

		// Verify the access list was used
		expect(setTx.accessList).toBeDefined()
		expect(setTx.accessList).toHaveLength(1)
		if (!setTx.accessList[0]) throw new Error('setTx.accessList[0] is undefined')
		if (!accessList[0]) throw new Error('accessList[0] is undefined')
		expect(bytesToHex(setTx.accessList[0][0])).toEqual(accessList[0].address)
		expect(setTx.accessList[0][1].map((key) => bytesToHex(key))).toEqual(accessList[0].storageKeys)

		// Second transaction: Read value with access list
		const getTx = createImpersonatedTx({
			impersonatedAddress: sender,
			nonce: 1,
			gasLimit: 50000,
			maxFeePerGas: 10n,
			maxPriorityFeePerGas: 2n,
			to: contractAddress,
			data: hexToBytes(encodeFunctionData(contract.read.get())),
			accessList: [
				{
					address: contractAddress.toString(),
					storageKeys: ['0x0000000000000000000000000000000000000000000000000000000000000000'],
				},
			],
		})

		const getResult = await runTx(vm)({
			tx: getTx,
			block,
			skipNonce: false,
			skipBalance: false,
		})

		expect(getResult.execResult.exceptionError).toBeUndefined()
		expect(getResult.execResult.returnValue).toBeDefined()

		// Transaction with empty access list should also work
		const emptyAccessListTx = createImpersonatedTx({
			impersonatedAddress: sender,
			nonce: 2,
			gasLimit: 50000,
			maxFeePerGas: 10n,
			maxPriorityFeePerGas: 2n,
			to: contractAddress,
			data: hexToBytes(encodeFunctionData(contract.read.get())),
			accessList: [],
		})

		const emptyAccessListResult = await runTx(vm)({
			tx: emptyAccessListTx,
			block,
			skipNonce: false,
			skipBalance: false,
		})

		expect(emptyAccessListResult.execResult.exceptionError).toBeUndefined()
	})

	it('should execute a transaction with selfdestruct', async () => {})

	it('should generate transaction receipt correctly', async () => {
		const tx = createImpersonatedTx({
			impersonatedAddress: createAddressFromString(PREFUNDED_ACCOUNTS[0].address),
			nonce: 0,
			gasLimit: 21064,
			maxFeePerGas: 8n,
			maxPriorityFeePerGas: 1n,
			to: createAddressFromString(`0x${'69'.repeat(20)}`),
			value: 1n,
		})
		const block = new Block({ common: mainnet })

		const result = await runTx(vm)({
			tx,
			block,
			skipNonce: true,
			skipBalance: true,
		})

		expect(result.receipt).toBeDefined()
		expect(result).toMatchSnapshot()
	})
})
