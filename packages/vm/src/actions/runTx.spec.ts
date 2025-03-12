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
	EthjsAccount,
	EthjsAddress,
	PREFUNDED_ACCOUNTS,
	encodeFunctionData,
	hexToBytes,
	parseEther,
	randomBytes,
} from '@tevm/utils'
import type { Vm } from '../Vm.js'
import { createVm } from '../createVm.js'
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
			impersonatedAddress: EthjsAddress.fromString(PREFUNDED_ACCOUNTS[0].address),
			nonce: 0,
			gasLimit: 21064,
			maxFeePerGas: 8n,
			maxPriorityFeePerGas: 1n,
			to: EthjsAddress.fromString(`0x${'69'.repeat(20)}`),
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

		expect((await vm.stateManager.getAccount(EthjsAddress.fromString(`0x${'69'.repeat(20)}`)))?.balance).toBe(1n)

		expect(result).toMatchSnapshot()
	})

	it('should execute a contract call successfully', async () => {
		const sender = EthjsAddress.fromString(`0x${'69'.repeat(20)}`)

		await vm.stateManager.putAccount(
			sender,
			EthjsAccount.fromAccountData({
				balance: parseEther('69'),
				nonce: 3n,
			}),
		)

		const contract = SimpleContract.withAddress(`0x${'02'.repeat(20)}`)

		await vm.stateManager.putContractCode(
			EthjsAddress.fromString(contract.address),
			hexToBytes(contract.deployedBytecode),
		)

		const setTx = createImpersonatedTx({
			impersonatedAddress: sender,
			nonce: 3,
			// This is exact
			gasLimit: 44884,
			maxFeePerGas: 8n,
			maxPriorityFeePerGas: 1n,
			to: EthjsAddress.fromString(contract.address),
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
			to: EthjsAddress.fromString(contract.address),
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
			impersonatedAddress: EthjsAddress.fromString(PREFUNDED_ACCOUNTS[0].address),
			nonce: 0,
			gasLimit: 21064,
			maxFeePerGas: 8n,
			maxPriorityFeePerGas: 1n,
			to: EthjsAddress.fromString(`0x${'69'.repeat(20)}`),
			value: 1n,
		})
		const err = await runTx(vm)({ tx, block: undefined as any }).catch((e) => e)
		expect(err).toBeInstanceOf(Error)
		expect(err).toMatchSnapshot()
	})

	it('should throw InsufficientFundsError', async () => {
		const tx = createImpersonatedTx({
			impersonatedAddress: EthjsAddress.fromString(PREFUNDED_ACCOUNTS[0].address),
			nonce: 0,
			gasLimit: 21064,
			maxFeePerGas: 8n,
			maxPriorityFeePerGas: 1n,
			to: EthjsAddress.fromString(`0x${'69'.repeat(20)}`),
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
			impersonatedAddress: EthjsAddress.fromString(PREFUNDED_ACCOUNTS[0].address),
			nonce: 0,
			gasLimit: 21064,
			maxFeePerGas: 8n,
			maxPriorityFeePerGas: 1n,
			to: EthjsAddress.fromString(`0x${'69'.repeat(20)}`),
			value: 1n,
		})
		const block = new Block({ common: mainnet })
		await vm.stateManager.putAccount(
			EthjsAddress.fromString(PREFUNDED_ACCOUNTS[0].address),
			EthjsAccount.fromAccountData({
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
			impersonatedAddress: EthjsAddress.fromString(PREFUNDED_ACCOUNTS[0].address),
			nonce: 0,
			gasLimit: 21064,
			maxFeePerGas: 8n,
			maxPriorityFeePerGas: 1n,
			to: EthjsAddress.fromString(`0x${'69'.repeat(20)}`),
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
		const sender = EthjsAddress.fromString(PREFUNDED_ACCOUNTS[0].address)

		await vm.stateManager.putAccount(
			sender,
			EthjsAccount.fromAccountData({
				balance: parseEther('1000'),
				nonce: 0n,
			}),
		)

		const tx = BlobEIP4844Transaction.fromTxData(
			{
				blobVersionedHashes: [randomBytes(32)],
				blobs: [randomBytes(32)],
				kzgCommitments: [randomBytes(32)],
				maxFeePerBlobGas: 1000000n,
				gasLimit: 0xffffffn,
				to: randomBytes(20),
			},
			{ common: mainnet.ethjsCommon },
		).sign(randomBytes(32))

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
			impersonatedAddress: EthjsAddress.fromString(PREFUNDED_ACCOUNTS[0].address),
			nonce: 0,
			gasLimit: 21064,
			maxFeePerGas: 1000000n,
			maxPriorityFeePerGas: 500000n,
			to: EthjsAddress.fromString(`0x${'69'.repeat(20)}`),
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

	it.todo('should handle transactions with access list', async () => {})

	it('should execute a transaction with selfdestruct', async () => {})

	it('should generate transaction receipt correctly', async () => {
		const tx = createImpersonatedTx({
			impersonatedAddress: EthjsAddress.fromString(PREFUNDED_ACCOUNTS[0].address),
			nonce: 0,
			gasLimit: 21064,
			maxFeePerGas: 8n,
			maxPriorityFeePerGas: 1n,
			to: EthjsAddress.fromString(`0x${'69'.repeat(20)}`),
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
