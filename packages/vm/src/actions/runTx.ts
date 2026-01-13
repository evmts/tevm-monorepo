// Originally from ethjs
import { ConsensusType } from '@tevm/common'
import {
	EipNotEnabledError,
	InsufficientFundsError,
	InternalError,
	InvalidArgsError,
	InvalidGasLimitError,
	InvalidGasPriceError,
	InvalidParamsError,
	InvalidTransactionError,
	NonceTooHighError,
	NonceTooLowError,
} from '@tevm/errors'
import type {
	AccessList,
	AccessListEIP2930Transaction,
	AccessListItem,
	EOACodeEIP7702Transaction,
	FeeMarketEIP1559Transaction,
	LegacyTransaction,
} from '@tevm/tx'
import { BlobEIP4844Transaction, Capability, isBlobEIP4844Tx } from '@tevm/tx'
import {
	BIGINT_0,
	BIGINT_1,
	bytesToBigInt,
	concatBytes,
	EthjsAccount,
	EthjsAddress,
	eoaCode7702RecoverAuthority,
	equalsBytes,
	type Hex,
	hexToBytes,
	MAX_UINT64,
	SECP256K1_ORDER_DIV_2,
} from '@tevm/utils'
import type { BaseVm } from '../BaseVm.js'
import type { AfterTxEvent, RunTxOpts, RunTxResult } from '../utils/index.js'
import { KECCAK256_NULL } from './constants.js'
import { errorMsg } from './errorMessage.js'
import { generateTxReceipt } from './generateTxResult.js'
import { txLogsBloom } from './txLogsBloom.js'
import { validateRunTx } from './validateRunTx.js'
import { warmAddresses2929 } from './warmAddresses2929.js'

// EIP-7702 flag: if contract code starts with these 3 bytes, it is a 7702-delegated EOA
const DELEGATION_7702_FLAG = new Uint8Array([0xef, 0x01, 0x00])

export type RunTx = (opts: RunTxOpts) => Promise<RunTxResult>

/**
 * @ignore
 */
export const runTx =
	(vm: BaseVm): RunTx =>
	async (opts: RunTxOpts): Promise<RunTxResult> => {
		await vm.ready()

		const validatedOpts = await validateRunTx(vm)(opts)

		// Ensure we start with a clear warmed accounts Map
		if (!validatedOpts.preserveJournal) await vm.evm.journal.cleanup()

		if (validatedOpts.reportAccessList === true) {
			vm.evm.journal.startReportingAccessList()
		}

		if (validatedOpts.reportPreimages === true) {
			vm.evm.journal.startReportingPreimages?.()
		}

		await vm.evm.journal.checkpoint()
		// Typed transaction specific setup tasks
		if (validatedOpts.tx.supports(Capability.EIP2718TypedTransaction) && vm.common.ethjsCommon.isActivatedEIP(2718)) {
			const castedTx = <AccessListEIP2930Transaction>validatedOpts.tx
			for (const accessListItem of castedTx.accessList ?? []) {
				vm.evm.journal.addAlwaysWarmAddress(accessListItem[0].toString(), true)
				for (const storageKey of accessListItem[1] ?? []) {
					vm.evm.journal.addAlwaysWarmSlot(accessListItem[0].toString(), storageKey.toString(), true)
				}
			}
		}

		try {
			const result = await _runTx(vm)(validatedOpts)
			if (!validatedOpts.preserveJournal) await vm.evm.journal.commit()
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
		const { tx, block } = opts
		if (!block) {
			throw new InvalidArgsError('block is required')
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

		warmAddresses2929(vm, caller, tx.to, block.header.coinbase)

		// Validate gas limit against tx base fee (DataFee + TxFee + Creation Fee)
		const txBaseFee = tx.getIntrinsicGas()
		let gasLimit = tx.gasLimit
		if (gasLimit < txBaseFee) {
			const msg = errorMsg(
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
				const msg = errorMsg(
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
		let fromAccount = await vm.stateManager.getAccount(caller)
		if (fromAccount === undefined) {
			fromAccount = new EthjsAccount()
		}
		const { nonce, balance } = fromAccount
		// EIP-3607: Reject transactions from senders with deployed code
		// EIP-7702: Allow 7702-delegated EOAs to send transactions
		if (vm.common.ethjsCommon.isActivatedEIP(3607) && !equalsBytes(fromAccount.codeHash, KECCAK256_NULL)) {
			const isActive7702 = vm.common.ethjsCommon.isActivatedEIP(7702)
			if (isActive7702) {
				const code = await vm.stateManager.getCode(caller)
				// If the EOA is 7702-delegated, sending txs from this EOA is fine
				if (!equalsBytes(code.slice(0, 3), DELEGATION_7702_FLAG)) {
					// Trying to send TX from account with code (which is not 7702-delegated)
					const msg = errorMsg('invalid sender address, address is not EOA (EIP-3607)', block, tx)
					throw new InvalidTransactionError(msg)
				}
			} else {
				const msg = errorMsg(
					'invalid sender address, address is not EOA (EIP-3607). When EIP-3607 is disabled this check is skipped',
					block,
					tx,
				)
				throw new InvalidTransactionError(msg)
			}
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
				const msg = errorMsg(
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
				const msg = errorMsg('blob transactions are only valid with EIP4844 active', block, tx)
				throw new EipNotEnabledError(msg)
			}
			// EIP-4844 spec
			// the signer must be able to afford the transaction
			// assert signer(tx).balance >= tx.message.gas * tx.message.max_fee_per_gas + get_total_data_gas(tx) * tx.message.max_fee_per_data_gas
			const castTx = tx as BlobEIP4844Transaction
			totalblobGas = BigInt(vm.common.ethjsCommon.param('blobGasPerBlob')) * BigInt(castTx.numBlobs())
			maxCost += totalblobGas * castTx.maxFeePerBlobGas

			// 4844 minimum blobGas price check
			if (opts.block === undefined) {
				const msg = errorMsg('Block option must be supplied to compute blob gas price', block, tx)
				throw new InvalidParamsError(msg)
			}
			blobGasPrice = opts.block.header.getBlobGasPrice()
			if (castTx.maxFeePerBlobGas < blobGasPrice) {
				const msg = errorMsg(
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
				const msg = errorMsg(
					`sender doesn't have enough funds to send tx. The max cost is: ${maxCost} and the sender's account (${caller}) only has: ${balance}`,
					block,
					tx,
				)
				throw new InsufficientFundsError(msg)
			}
		}

		if (opts.skipNonce !== true) {
			if (nonce !== tx.nonce) {
				const msg = errorMsg(
					`the tx doesn't have the correct nonce. account has nonce of: ${nonce} tx has nonce of: ${tx.nonce}`,
					block,
					tx,
				)
				throw nonce > tx.nonce ? new NonceTooLowError(msg) : new NonceTooHighError(msg)
			}
		}

		let gasPrice: bigint
		let inclusionFeePerGas: bigint | undefined
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
		let blobVersionedHashes: `0x${string}`[] | undefined
		if (tx instanceof BlobEIP4844Transaction) {
			const rawHashes = (tx as BlobEIP4844Transaction).blobVersionedHashes
			blobVersionedHashes = rawHashes.map((hash) =>
				hash.startsWith('0x') ? (hash as `0x${string}`) : (`0x${hash}` as `0x${string}`),
			)
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

		// EIP-7702: Process authorization list for EOA code transactions
		let gasRefund = BIGINT_0
		if (tx.supports(Capability.EIP7702EOACode)) {
			// Add contract code for authority tuples provided by EIP 7702 tx
			const castedTx = tx as EOACodeEIP7702Transaction
			const authorizationList = castedTx.authorizationList
			for (let i = 0; i < authorizationList.length; i++) {
				// Authority tuple validation
				const authTuple = authorizationList[i]
				if (!authTuple) continue
				const authChainId = authTuple[0]
				const authChainIdBN = bytesToBigInt(authChainId)
				if (authChainIdBN !== BIGINT_0 && authChainIdBN !== BigInt(vm.common.ethjsCommon.chainId())) {
					// Chain id does not match, continue
					continue
				}
				// Address to take code from
				const delegateAddress = authTuple[1]
				const authNonce = authTuple[2]
				if (bytesToBigInt(authNonce) >= MAX_UINT64) {
					// authority nonce >= 2^64 - 1. Bumping this nonce by one will not make this fit in an uint64.
					continue
				}
				const authS = authTuple[5]
				if (bytesToBigInt(authS) > SECP256K1_ORDER_DIV_2) {
					// Malleability protection to avoid "flipping" a valid signature to get
					// another valid signature (which yields the same account on `ecrecover`)
					continue
				}
				const yParity = bytesToBigInt(authTuple[3])
				if (yParity > BIGINT_1) {
					continue
				}
				// Address to set code to (recover authority from signature)
				let authority: EthjsAddress
				try {
					authority = eoaCode7702RecoverAuthority(authTuple)
				} catch {
					// Invalid signature, continue
					continue
				}

				const accountMaybeUndefined = await vm.stateManager.getAccount(authority)
				const accountExists = accountMaybeUndefined !== undefined
				const account = accountMaybeUndefined ?? new EthjsAccount()

				// Add authority address to warm addresses
				vm.evm.journal.addAlwaysWarmAddress(authority.toString())

				if (account.isContract()) {
					const code = await vm.stateManager.getCode(authority)
					if (!equalsBytes(code.slice(0, 3), DELEGATION_7702_FLAG)) {
						// Account is a "normal" contract
						continue
					}
				}

				// Nonce check
				if (caller.toString() === authority.toString()) {
					if (account.nonce + BIGINT_1 !== bytesToBigInt(authNonce)) {
						// Edge case: caller is the authority, so is self-signing the delegation
						// In this case, we "virtually" bump the account nonce by one
						continue
					}
				} else if (account.nonce !== bytesToBigInt(authNonce)) {
					continue
				}

				if (accountExists) {
					const refund =
						BigInt(vm.common.ethjsCommon.param('perEmptyAccountCost')) -
						BigInt(vm.common.ethjsCommon.param('perAuthBaseGas'))
					gasRefund += refund
				}
				account.nonce++
				await vm.evm.journal.putAccount(authority, account)

				if (equalsBytes(delegateAddress, new Uint8Array(20))) {
					// Special case: If delegated to the zero address, clear the delegation of authority
					await vm.stateManager.putCode(authority, new Uint8Array())
				} else {
					const addressCode = concatBytes(DELEGATION_7702_FLAG, delegateAddress)
					await vm.stateManager.putCode(authority, addressCode)
				}
			}
		}

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

		// Process any gas refund (including EIP-7702 refund accumulated above)
		gasRefund += results.execResult.gasRefund ?? BIGINT_0
		results.gasRefund = gasRefund
		const maxRefundQuotient = BigInt(vm.common.ethjsCommon.param('maxRefundQuotient'))
		if (gasRefund !== BIGINT_0) {
			const maxRefund = results.totalGasSpent / maxRefundQuotient
			gasRefund = gasRefund < maxRefund ? gasRefund : maxRefund
			results.totalGasSpent -= gasRefund
		}
		results.amountSpent = results.totalGasSpent * gasPrice

		// Update sender's balance
		fromAccount = await vm.stateManager.getAccount(caller)
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

		let minerAccount = await vm.stateManager.getAccount(miner)
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
					address: address as Hex,
					storageKeys: [],
				}
				for (const slot of set) {
					item.storageKeys.push(slot as Hex)
				}
				accessList.push(item)
			}

			results.accessList = accessList
		}

		if (opts.reportPreimages === true && vm.evm.journal.preimages !== undefined) {
			results.preimages = vm.evm.journal.preimages as any
		}

		if (!opts.preserveJournal) await vm.evm.journal.cleanup()

		// Generate the tx receipt
		const gasUsed = (opts.blockGasUsed !== undefined ? opts.blockGasUsed : block.header.gasUsed) ?? 0n
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
