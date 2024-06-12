import { Block } from '@tevm/block'
import { ConsensusType, type Hardfork } from '@tevm/common'
import { BlobEIP4844Transaction, Capability, isBlobEIP4844Tx } from '@tevm/tx'
import { EthjsAccount, EthjsAddress, type Hex, bytesToUnprefixedHex, equalsBytes, hexToBytes } from '@tevm/utils'

import { Bloom } from '@ethereumjs/vm'
import type { Common } from '@tevm/common'
import type {
	AccessList,
	AccessListEIP2930Transaction,
	AccessListItem,
	FeeMarketEIP1559Transaction,
	LegacyTransaction,
	TypedTransaction,
} from '@tevm/tx'
import type { BaseVm } from '../BaseVm.js'
import type {
	AfterTxEvent,
	BaseTxReceipt,
	EIP4844BlobTxReceipt,
	PostByzantiumTxReceipt,
	PreByzantiumTxReceipt,
	RunTxOpts,
	RunTxResult,
	TxReceipt,
} from '../utils/types.js'
import {
	BlockGasLimitExceededError,
	EipNotEnabledError,
	InsufficientFundsError,
	InternalError,
	InvalidGasLimitError,
	InvalidGasPriceError,
	InvalidParamsError,
	InvalidTransactionError,
	MisconfiguredClientError,
	NonceTooHighError,
	NonceTooLowError,
} from '@tevm/errors'

// TODO Might want to move these to utils these are getting copy pasted a lot
export const KECCAK256_NULL_S = '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'
export const KECCAK256_NULL = hexToBytes(KECCAK256_NULL_S)

/**
 * Returns the hardfork excluding the merge hf which has
 * no effect on the vm execution capabilities.
 *
 * This is particularly useful in executing/evaluating the transaction
 * when chain td is not available at many places to correctly set the
 * hardfork in for e.g. vm or txs or when the chain is not fully synced yet.
 *
 * @returns Hardfork name
 */
function execHardfork(hardfork: Hardfork | string, preMergeHf: Hardfork | string): string | Hardfork {
	return hardfork !== 'paris' ? hardfork : preMergeHf
}

/**
 * @ignore
 */
export const runTx =
	(vm: BaseVm) =>
	async (opts: RunTxOpts): Promise<RunTxResult> => {
		// create a reasonable default if no block is given
		opts.block = opts.block ?? Block.fromBlockData({}, { common: vm.common })

		if (opts.skipHardForkValidation !== true) {
			// Find and set preMerge hf for easy access later
			const hfs = vm.common.ethjsCommon.hardforks()
			const preMergeIndex = hfs.findIndex((hf) => hf.ttd !== null && hf.ttd !== undefined) - 1
			// If no pre merge hf found, set it to first hf even if its merge
			const preMergeHf = (preMergeIndex >= 0 ? hfs[preMergeIndex]?.name : hfs[0]?.name) as string

			// If block and tx don't have a same hardfork, set tx hardfork to block
			if (
				execHardfork(opts.tx.common.hardfork(), preMergeHf) !==
				execHardfork(opts.block.common.ethjsCommon.hardfork(), preMergeHf)
			) {
				opts.tx.common.setHardfork(opts.block.common.ethjsCommon.hardfork())
			}
			if (
				execHardfork(opts.block.common.ethjsCommon.hardfork(), preMergeHf) !==
				execHardfork(vm.common.ethjsCommon.hardfork(), preMergeHf)
			) {
				// Block and VM's hardfork should match as well
				const msg = _errorMsg('block has a different hardfork than the vm', opts.block, opts.tx)
				throw new MisconfiguredClientError(msg)
			}
		}

		if (opts.skipBlockGasLimitValidation !== true && opts.block.header.gasLimit < opts.tx.gasLimit) {
			const msg = _errorMsg('tx has a higher gas limit than the block', opts.block, opts.tx)
			throw new BlockGasLimitExceededError(msg)
		}

		// Ensure we start with a clear warmed accounts Map
		await vm.evm.journal.cleanup()

		if (opts.reportAccessList === true) {
			vm.evm.journal.startReportingAccessList()
		}

		if (opts.reportPreimages === true) {
			vm.evm.journal.startReportingPreimages?.()
		}

		await vm.evm.journal.checkpoint()
		// Typed transaction specific setup tasks
		if (opts.tx.supports(Capability.EIP2718TypedTransaction) && vm.common.ethjsCommon.isActivatedEIP(2718)) {
			// Is it an Access List transaction?
			if (!vm.common.ethjsCommon.isActivatedEIP(2930)) {
				await vm.evm.journal.revert()
				const msg = _errorMsg('Cannot run transaction: EIP 2930 is not activated.', opts.block, opts.tx)
				throw new Error(msg)
			}
			if (opts.tx.supports(Capability.EIP1559FeeMarket) && !vm.common.ethjsCommon.isActivatedEIP(1559)) {
				await vm.evm.journal.revert()
				const msg = _errorMsg('Cannot run transaction: EIP 1559 is not activated.', opts.block, opts.tx)
				throw new Error(msg)
			}

			const castedTx = <AccessListEIP2930Transaction>opts.tx

			for (const accessListItem of castedTx.AccessListJSON) {
				vm.evm.journal.addAlwaysWarmAddress(accessListItem.address, true)
				for (const storageKey of accessListItem.storageKeys) {
					vm.evm.journal.addAlwaysWarmSlot(accessListItem.address, storageKey, true)
				}
			}
		}

		try {
			const result = await _runTx(vm)(opts)
			await vm.evm.journal.commit()
			return result
		} catch (e: any) {
			await vm.evm.journal.revert()
			throw e
		} finally {
			if (vm.common.ethjsCommon.isActivatedEIP(2929)) {
				vm.evm.journal.cleanJournal()
			}
		}
	}

const _runTx =
	(vm: BaseVm) =>
	async (opts: RunTxOpts): Promise<RunTxResult> => {
		await vm.ready()
		const state = vm.stateManager

		const { tx, block } = opts

		if (!block) {
			throw new InvalidParamsError('block required')
		}

		/**
		 * The `beforeTx` event
		 *
		 * @event Event: beforeTx
		 * @type {Object}
		 * @property {Transaction} tx emits the Transaction that is about to be processed
		 */
		await vm._emit('beforeTx', tx)

		const caller = tx.getSenderAddress()
		if (vm.common.ethjsCommon.isActivatedEIP(2929)) {
			// Add origin and precompiles to warm addresses
			const activePrecompiles = vm.evm.precompiles
			for (const [addressStr] of activePrecompiles.entries()) {
				vm.evm.journal.addAlwaysWarmAddress(addressStr)
			}
			vm.evm.journal.addAlwaysWarmAddress(caller.toString())
			if (tx.to !== undefined) {
				// Note: in case we create a contract, we do vm in EVMs `_executeCreate` (vm is also correct in inner calls, per the EIP)
				vm.evm.journal.addAlwaysWarmAddress(bytesToUnprefixedHex(tx.to.bytes))
			}
			if (vm.common.ethjsCommon.isActivatedEIP(3651)) {
				vm.evm.journal.addAlwaysWarmAddress(bytesToUnprefixedHex(block.header.coinbase.bytes))
			}
		}

		// Validate gas limit against tx base fee (DataFee + TxFee + Creation Fee)
		const txBaseFee = tx.getBaseFee()
		let gasLimit = tx.gasLimit
		if (gasLimit < txBaseFee) {
			const msg = _errorMsg(
				`tx gas limit ${Number(gasLimit)} is lower than the minimum gas limit of ${Number(txBaseFee)}`,
				block,
				tx,
			)
			throw new InvalidGasLimitError(msg)
		}
		gasLimit -= txBaseFee

		if (vm.common.ethjsCommon.isActivatedEIP(1559)) {
			// EIP-1559 spec:
			// Ensure that the user was willing to at least pay the base fee
			// assert transaction.max_fee_per_gas >= block.base_fee_per_gas
			const maxFeePerGas = 'maxFeePerGas' in tx ? tx.maxFeePerGas : tx.gasPrice
			const baseFeePerGas = block.header.baseFeePerGas ?? 0n
			if (maxFeePerGas < baseFeePerGas) {
				const msg = _errorMsg(
					`Transaction's ${
						'maxFeePerGas' in tx ? 'maxFeePerGas' : 'gasPrice'
					} (${maxFeePerGas}) is less than the block's baseFeePerGas (${baseFeePerGas})`,
					block,
					tx,
				)
				throw new InvalidParamsError(msg)
			}
		}
		// Check from account's balance and nonce
		let fromAccount = await state.getAccount(caller)
		if (fromAccount === undefined) {
			fromAccount = new EthjsAccount()
		}
		const { nonce, balance } = fromAccount
		// EIP-3607: Reject transactions from senders with deployed code
		if (vm.common.ethjsCommon.isActivatedEIP(3607) && !equalsBytes(fromAccount.codeHash, KECCAK256_NULL)) {
			const msg = _errorMsg(
				'invalid sender address, address is not EOA (EIP-3607). When EIP-3607 is disabled this check is skipped',
				block,
				tx,
			)
			throw new InvalidTransactionError(msg)
		}

		// Check balance against upfront tx cost
		const upFrontCost = tx.getUpfrontCost(block.header.baseFeePerGas)
		if (balance < upFrontCost) {
			if (opts.skipBalance === true && fromAccount.balance < upFrontCost) {
				if (tx.supports(Capability.EIP1559FeeMarket) === false) {
					// if skipBalance and not EIP1559 transaction, ensure caller balance is enough to run transaction
					fromAccount.balance = upFrontCost
					await vm.evm.journal.putAccount(caller, fromAccount)
				}
			} else {
				const msg = _errorMsg(
					`sender doesn't have enough funds to send tx. The upfront cost is: ${upFrontCost} and the sender's account (${caller}) only has: ${balance}`,
					block,
					tx,
				)
				throw new InsufficientFundsError(msg)
			}
		}

		// Check balance against max potential cost (for EIP 1559 and 4844)
		let maxCost = tx.value
		let blobGasPrice = 0n
		let totalblobGas = 0n
		if (tx.supports(Capability.EIP1559FeeMarket)) {
			// EIP-1559 spec:
			// The signer must be able to afford the transaction
			// `assert balance >= gas_limit * max_fee_per_gas`
			maxCost += tx.gasLimit * (tx as FeeMarketEIP1559Transaction).maxFeePerGas
		}

		if (tx instanceof BlobEIP4844Transaction) {
			if (!vm.common.ethjsCommon.isActivatedEIP(4844)) {
				const msg = _errorMsg('blob transactions are only valid with EIP4844 active', block, tx)
				throw new EipNotEnabledError(msg)
			}
			// EIP-4844 spec
			// the signer must be able to afford the transaction
			// assert signer(tx).balance >= tx.message.gas * tx.message.max_fee_per_gas + get_total_data_gas(tx) * tx.message.max_fee_per_data_gas
			const castTx = tx as BlobEIP4844Transaction
			totalblobGas = castTx.common.param('gasConfig', 'blobGasPerBlob') * BigInt(castTx.numBlobs())
			maxCost += totalblobGas * castTx.maxFeePerBlobGas

			// 4844 minimum blobGas price check
			if (opts.block === undefined) {
				const msg = _errorMsg('Block option must be supplied to compute blob gas price', block, tx)
				throw new InvalidParamsError(msg)
			}
			blobGasPrice = opts.block.header.getBlobGasPrice()
			if (castTx.maxFeePerBlobGas < blobGasPrice) {
				const msg = _errorMsg(
					`Transaction's maxFeePerBlobGas ${castTx.maxFeePerBlobGas}) is less than block blobGasPrice (${blobGasPrice}).`,
					block,
					tx,
				)
				throw new InvalidGasPriceError(msg)
			}
		}

		if (fromAccount.balance < maxCost) {
			if (opts.skipBalance === true && fromAccount.balance < maxCost) {
				// if skipBalance, ensure caller balance is enough to run transaction
				fromAccount.balance = maxCost
				await vm.evm.journal.putAccount(caller, fromAccount)
			} else {
				const msg = _errorMsg(
					`sender doesn't have enough funds to send tx. The max cost is: ${maxCost} and the sender's account (${caller}) only has: ${balance}`,
					block,
					tx,
				)
				throw new InsufficientFundsError(msg)
			}
		}

		if (opts.skipNonce !== true) {
			if (nonce !== tx.nonce) {
				const msg = _errorMsg(
					`the tx doesn't have the correct nonce. account has nonce of: ${nonce} tx has nonce of: ${tx.nonce}`,
					block,
					tx,
				)
				throw nonce > tx.nonce ? new NonceTooLowError(msg) : new NonceTooHighError(msg)
			}
		}

		let gasPrice: bigint
		let inclusionFeePerGas: bigint | undefined = undefined
		// EIP-1559 tx
		if (tx.supports(Capability.EIP1559FeeMarket)) {
			// TODO make txs use the new getEffectivePriorityFee
			const baseFee = block.header.baseFeePerGas ?? 0n
			inclusionFeePerGas = tx.getEffectivePriorityFee(baseFee)

			gasPrice = inclusionFeePerGas + baseFee
		} else {
			// Have to cast as legacy tx since EIP1559 tx does not have gas price
			gasPrice = (<LegacyTransaction>tx).gasPrice
			if (vm.common.ethjsCommon.isActivatedEIP(1559)) {
				const baseFee = block.header.baseFeePerGas ?? 0n
				inclusionFeePerGas = (<LegacyTransaction>tx).gasPrice - baseFee
			}
		}

		// EIP-4844 tx
		let blobVersionedHashes: Uint8Array[] | undefined = undefined
		if (tx instanceof BlobEIP4844Transaction) {
			blobVersionedHashes = (tx as BlobEIP4844Transaction).blobVersionedHashes
		}

		// Update from account's balance
		const txCost = tx.gasLimit * gasPrice
		const blobGasCost = totalblobGas * blobGasPrice
		fromAccount.balance -= txCost
		fromAccount.balance -= blobGasCost
		if (opts.skipBalance === true && fromAccount.balance < 0n) {
			fromAccount.balance = 0n
		}
		await vm.evm.journal.putAccount(caller, fromAccount)

		/*
		 * Execute message
		 */
		const { value, data, to } = tx

		const results = (await vm.evm.runCall({
			block,
			gasPrice,
			caller,
			gasLimit,
			...(to !== undefined ? { to } : {}),
			...(blobVersionedHashes !== undefined ? { blobVersionedHashes } : {}),
			value,
			data,
			skipBalance: opts.skipBalance ?? false,
		})) as RunTxResult

		/*
		 * Parse results
		 */
		// Generate the bloom for the tx
		results.bloom = txLogsBloom(results.execResult.logs, vm.common)

		// Calculate the total gas used
		results.totalGasSpent = results.execResult.executionGasUsed + txBaseFee

		// Add blob gas used to result
		if (isBlobEIP4844Tx(tx)) {
			results.blobGasUsed = totalblobGas
		}

		// Process any gas refund
		let gasRefund = results.execResult.gasRefund ?? 0n
		results.gasRefund = gasRefund
		const maxRefundQuotient = vm.common.ethjsCommon.param('gasConfig', 'maxRefundQuotient')
		if (gasRefund !== 0n) {
			const maxRefund = results.totalGasSpent / maxRefundQuotient
			gasRefund = gasRefund < maxRefund ? gasRefund : maxRefund
			results.totalGasSpent -= gasRefund
		} else {
			// TODO warn that no gas is used
		}
		results.amountSpent = results.totalGasSpent * gasPrice

		// Update sender's balance
		fromAccount = await state.getAccount(caller)
		if (fromAccount === undefined) {
			fromAccount = new EthjsAccount()
		}
		const actualTxCost = results.totalGasSpent * gasPrice
		const txCostDiff = txCost - actualTxCost
		fromAccount.balance += txCostDiff
		await vm.evm.journal.putAccount(caller, fromAccount)

		// Update miner's balance
		let miner: EthjsAddress
		if (vm.common.ethjsCommon.consensusType() === ConsensusType.ProofOfAuthority) {
			miner = block.header.cliqueSigner()
		} else {
			miner = block.header.coinbase
		}

		let minerAccount = await state.getAccount(miner)
		if (minerAccount === undefined) {
			minerAccount = new EthjsAccount()
		}
		// add the amount spent on gas to the miner's account
		results.minerValue = vm.common.ethjsCommon.isActivatedEIP(1559)
			? results.totalGasSpent * (inclusionFeePerGas ?? 0n)
			: results.amountSpent
		minerAccount.balance += results.minerValue

		// Put the miner account into the state. If the balance of the miner account remains zero, note that
		// the state.putAccount function puts this into the "touched" accounts. This will thus be removed when
		// we clean the touched accounts below in case we are in a fork >= SpuriousDragon
		await vm.evm.journal.putAccount(miner, minerAccount)

		/*
		 * Cleanup accounts
		 */
		if (results.execResult.selfdestruct !== undefined) {
			for (const addressToSelfdestructHex of results.execResult.selfdestruct) {
				const address = new EthjsAddress(hexToBytes(addressToSelfdestructHex as Hex))
				if (vm.common.ethjsCommon.isActivatedEIP(6780)) {
					// skip cleanup of addresses not in createdAddresses
					if (!results.execResult.createdAddresses?.has(address.toString())) {
						continue
					}
				}
				await vm.evm.journal.deleteAccount(address)
			}
		}

		if (opts.reportAccessList === true && vm.common.ethjsCommon.isActivatedEIP(2930)) {
			// Convert the Map to the desired type
			const accessList: AccessList = []
			if (!vm.evm.journal.accessList) {
				throw new InternalError('expected journal accesslist to be defined')
			}
			for (const [address, set] of vm.evm.journal.accessList) {
				const item: AccessListItem = {
					address,
					storageKeys: [],
				}
				for (const slot of set) {
					item.storageKeys.push(slot)
				}
				accessList.push(item)
			}

			results.accessList = accessList
		}

		if (opts.reportPreimages === true && vm.evm.journal.preimages !== undefined) {
			results.preimages = vm.evm.journal.preimages as any
		}

		await vm.evm.journal.cleanup()

		// Generate the tx receipt
		const gasUsed = opts.blockGasUsed !== undefined ? opts.blockGasUsed : block.header.gasUsed
		const cumulativeGasUsed = gasUsed + results.totalGasSpent
		results.receipt = await generateTxReceipt(vm)(tx, results, cumulativeGasUsed, totalblobGas, blobGasPrice)

		/**
		 * The `afterTx` event
		 *
		 * @event Event: afterTx
		 * @type {Object}
		 * @property {Object} result result of the transaction
		 */
		const event: AfterTxEvent = { transaction: tx, ...results }
		await vm._emit('afterTx', event)

		return results
	}

/**
 * @method txLogsBloom
 * @private
 */
function txLogsBloom(logs?: any[], common?: Common): Bloom {
	const bloom = new Bloom(undefined, common?.ethjsCommon)
	if (logs) {
		for (let i = 0; i < logs.length; i++) {
			const log = logs[i]
			// add the address
			bloom.add(log[0])
			// add the topics
			const topics = log[1]
			for (let q = 0; q < topics.length; q++) {
				bloom.add(topics[q])
			}
		}
	}
	return bloom
}

/**
 * Returns the tx receipt.
 * @param this The vm instance
 * @param tx The transaction
 * @param txResult The tx result
 * @param cumulativeGasUsed The gas used in the block including this tx
 * @param blobGasUsed The blob gas used in the tx
 * @param blobGasPrice The blob gas price for the block including this tx
 */
export const generateTxReceipt =
	(vm: BaseVm) =>
	async (
		tx: TypedTransaction,
		txResult: RunTxResult,
		cumulativeGasUsed: bigint,
		blobGasUsed?: bigint,
		blobGasPrice?: bigint,
	): Promise<TxReceipt> => {
		const baseReceipt: BaseTxReceipt = {
			cumulativeBlockGasUsed: cumulativeGasUsed,
			bitvector: txResult.bloom.bitvector,
			logs: txResult.execResult.logs ?? [],
		}

		let receipt: PostByzantiumTxReceipt | PreByzantiumTxReceipt | EIP4844BlobTxReceipt

		if (!tx.supports(Capability.EIP2718TypedTransaction)) {
			// Legacy transaction
			if (vm.common.ethjsCommon.gteHardfork('byzantium') === true) {
				// Post-Byzantium
				receipt = {
					status: txResult.execResult.exceptionError !== undefined ? 0 : 1, // Receipts have a 0 as status on error
					...baseReceipt,
				} as PostByzantiumTxReceipt
			} else {
				// Pre-Byzantium
				const stateRoot = await vm.stateManager.getStateRoot()
				receipt = {
					stateRoot,
					...baseReceipt,
				} as PreByzantiumTxReceipt
			}
		} else {
			// Typed EIP-2718 Transaction
			if (isBlobEIP4844Tx(tx)) {
				receipt = {
					blobGasUsed,
					blobGasPrice,
					status: txResult.execResult.exceptionError ? 0 : 1,
					...baseReceipt,
				} as EIP4844BlobTxReceipt
			} else {
				receipt = {
					status: txResult.execResult.exceptionError ? 0 : 1,
					...baseReceipt,
				} as PostByzantiumTxReceipt
			}
		}
		return receipt
	}

/**
 * Internal helper function to create an annotated error message
 *
 * @param msg Base error message
 * @hidden
 */
function _errorMsg(msg: string, block: Block, tx: TypedTransaction) {
	const blockErrorStr = 'errorStr' in block ? block.errorStr() : 'block'
	const txErrorStr = 'errorStr' in tx ? tx.errorStr() : 'tx'

	const errorMsg = `${msg} -> ${blockErrorStr} -> ${txErrorStr})`
	return errorMsg
}
