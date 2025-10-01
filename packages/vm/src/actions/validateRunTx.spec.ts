import { beforeEach, describe, expect, it, jest } from 'bun:test'
import { Block } from '@tevm/block'
import { createChain } from '@tevm/blockchain'
import { type Common, createCommon, mainnet, optimism } from '@tevm/common'
import { BlockGasLimitExceededError, EipNotEnabledError, MisconfiguredClientError } from '@tevm/errors'
import { createEvm } from '@tevm/evm'
import { createStateManager } from '@tevm/state'
import { createImpersonatedTx } from '@tevm/tx'
import { createAddressFromString } from '@tevm/utils'
import { createVm } from '../createVm.js'
import type { Vm } from '../Vm.js'
import { validateRunTx } from './validateRunTx.js'

describe('validateRunTx', () => {
	let vm: Vm
	let common: Common

	beforeEach(async () => {
		common = createCommon({ ...mainnet, hardfork: 'prague', loggingLevel: 'warn' })
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

	it('should throw MisconfiguredClientError if no preMerge hardfork is found', async () => {
		const tx = createImpersonatedTx({
			impersonatedAddress: createAddressFromString(`0x${'11'.repeat(20)}`),
			nonce: 0,
			gasLimit: 21064,
			maxFeePerGas: 8n,
			maxPriorityFeePerGas: 1n,
		})

		const block = Block.fromBlockData(
			{
				header: {
					parentHash: `0x${'11'.repeat(32)}`,
				},
			},
			{ common },
		)

		vm.common.ethjsCommon.hardforks = jest.fn().mockReturnValue([])

		const err = await validateRunTx(vm)({ tx, block }).catch((e) => e)
		expect(err).toBeInstanceOf(MisconfiguredClientError)
		expect(err).toMatchSnapshot()
	})

	it('should throw BlockGasLimitExceededError if tx gas limit exceeds block gas limit', async () => {
		const tx = createImpersonatedTx({
			impersonatedAddress: createAddressFromString(`0x${'11'.repeat(20)}`),
			nonce: 0,
			gasLimit: 21064,
			maxFeePerGas: 8n,
			maxPriorityFeePerGas: 1n,
		})

		const block = Block.fromBlockData({ header: { gasLimit: 21000 } }, { common })

		const err = await validateRunTx(vm)({ tx, block }).catch((e) => e)
		expect(err).toBeInstanceOf(BlockGasLimitExceededError)
		expect(err).toMatchSnapshot()
	})

	it('should throw EipNotEnabledError if EIP 2930 is not activated for Access List transaction', async () => {
		const tx = createImpersonatedTx({
			impersonatedAddress: createAddressFromString(`0x${'11'.repeat(20)}`),
			nonce: 0,
			gasLimit: 21064,
			maxFeePerGas: 8n,
			maxPriorityFeePerGas: 1n,
			accessList: [],
		})

		const block = Block.fromBlockData(
			{
				header: {},
			},
			{ common },
		)

		vm.common.ethjsCommon.isActivatedEIP = jest.fn((eip) => eip !== 2930)

		const err = await validateRunTx(vm)({ tx, block }).catch((e) => e)
		expect(err).toBeInstanceOf(EipNotEnabledError)
		expect(err).toMatchSnapshot()
	})

	it('should throw EipNotEnabledError if EIP 1559 is not activated for Fee Market transaction', async () => {
		const tx = createImpersonatedTx({
			impersonatedAddress: createAddressFromString(`0x${'11'.repeat(20)}`),
			nonce: 0,
			gasLimit: 21064,
			maxPriorityFeePerGas: 1n,
			accessList: [],
			maxFeePerGas: 10n,
		})

		const block = Block.fromBlockData({ header: {} }, { common })

		vm.common.ethjsCommon.isActivatedEIP = jest.fn((eip) => eip !== 1559)

		const err = await validateRunTx(vm)({ tx, block }).catch((e) => e)
		expect(err).toBeInstanceOf(EipNotEnabledError)
		expect(err).toMatchSnapshot()
	})

	it('should validate options successfully', async () => {
		const tx = createImpersonatedTx({
			impersonatedAddress: createAddressFromString(`0x${'11'.repeat(20)}`),
			nonce: 0,
			gasLimit: 21064,
			maxFeePerGas: 8n,
			maxPriorityFeePerGas: 1n,
		})

		const block = Block.fromBlockData({ header: {} }, { common })
		const preserveJournal = false

		vm.common.ethjsCommon.isActivatedEIP = jest.fn(() => true)

		const opts = { tx, block, preserveJournal }
		const validate = validateRunTx(vm)

		const result = await validate(opts)

		expect(result).toEqual({
			...opts,
			block,
			preserveJournal,
		})
	})

	it('should validate options successfully with no block', async () => {
		const tx = createImpersonatedTx({
			impersonatedAddress: createAddressFromString(`0x${'11'.repeat(20)}`),
			nonce: 0,
			gasLimit: 21064,
			maxFeePerGas: 8n,
			maxPriorityFeePerGas: 1n,
		})

		vm.common.ethjsCommon.isActivatedEIP = jest.fn(() => true)

		const opts = { tx }
		const validate = validateRunTx(vm)

		const { block, ...rest } = await validate(opts)

		expect(block.header.number).toMatchSnapshot()
		expect(block.header.hash).toMatchSnapshot()
		expect(rest).toMatchSnapshot()
	})

	it('should throw if hardfork doesn not match', async () => {
		const mockCommon = optimism.copy()
		;(mockCommon.ethjsCommon as any)._hardfork = 'shanghai'
		mockCommon.copy = () => mockCommon
		const tx = createImpersonatedTx({
			impersonatedAddress: createAddressFromString(`0x${'11'.repeat(20)}`),
			nonce: 0,
			gasLimit: 21064,
			maxFeePerGas: 8n,
			maxPriorityFeePerGas: 1n,
		})

		const block = Block.fromBlockData(
			{
				header: {
					parentHash: `0x${'11'.repeat(32)}`,
				},
			},
			{ common: mockCommon },
		)

		const opts = { tx, block, skipHardforkValidation: false }
		const validate = validateRunTx(vm)

		const err = await validate(opts).catch((e) => e)

		if (!(err instanceof Error)) {
			throw new Error('Expected error to be an instance of Error')
		}

		expect(err).toBeInstanceOf(Error)
		expect(err).toBeInstanceOf(MisconfiguredClientError)
		expect(err).toMatchSnapshot()
	})
})
