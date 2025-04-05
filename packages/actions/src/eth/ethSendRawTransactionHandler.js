import { createAddress } from '@tevm/address'
import { InvalidTransactionError } from '@tevm/errors'
import { prefundedAccounts } from '@tevm/node'
import { BlobEIP4844Transaction, TransactionFactory, createImpersonatedTx } from '@tevm/tx'
import { EthjsAddress, bytesToHex, hexToBytes } from '@tevm/utils'
import { callHandler } from '../Call/callHandler.js'

const txType = {
	LEGACY: 0x00,
	ACCESS_LIST: 0x01,
	EIP1559: 0x02,
	BLOB: 0x03,
	OPTIMISM_DEPOSIT: 0x7e,
}

// TODO we should be properly checking signatures

// TODO move this to @tevm/errors
/**
 * Error thrown when blob gas limit is exceeded
 */
export class BlobGasLimitExceededError extends Error {
	/**
	 * @type {'BlobGasLimitExceededError'}
	 */
	_tag = 'BlobGasLimitExceededError'

	/**
	 * @type {'BlobGasLimitExceededError'}
	 * @override
	 */
	name = 'BlobGasLimitExceededError'

	constructor() {
		super('Blob gas limit exceeded')
	}
}

/**
 * @internal
 * @param {import('@tevm/vm').Vm} vm
 * @param {Uint8Array} txBuf
 */
const getTx = (vm, txBuf) => {
	switch (txBuf[0]) {
		case txType.LEGACY:
		case txType.ACCESS_LIST:
		case txType.EIP1559:
			return TransactionFactory.fromSerializedData(txBuf, {
				common: vm.common.vmConfig,
				freeze: false,
			})
		case txType.BLOB: {
			const tx = BlobEIP4844Transaction.fromSerializedBlobTxNetworkWrapper(txBuf, {
				common: vm.common.vmConfig,
				freeze: false,
			})
			const blobGasLimit = vm.common.vmConfig.param('gasConfig', 'maxblobGasPerBlock')
			const blobGasPerBlob = vm.common.vmConfig.param('gasConfig', 'blobGasPerBlob')

			const blobCount = BigInt(tx.blobs?.length ?? 0)
			const blobGas = blobCount * blobGasPerBlob
			if (blobGas > blobGasLimit) {
				throw new BlobGasLimitExceededError()
			}
			return tx
		}
		case txType.OPTIMISM_DEPOSIT:
			throw new Error('Optimism deposit tx are not supported')
		default:
			throw new Error(`Invalid transaction type ${txBuf[0]}`)
	}
}

/**
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./EthHandler.js').EthSendRawTransactionHandler}
 */
export const ethSendRawTransactionHandler = (client) => async (params) => {
	const vm = await client.getVm()
	const txBuf = hexToBytes(params.data)
	/**
	 * @type {import('@tevm/tx').BlobEIP4844Transaction | import('@tevm/tx').LegacyTransaction | import('@tevm/tx').AccessListEIP2930Transaction | import('@tevm/tx').FeeMarketEIP1559Transaction}
	 */
	let tx
	try {
		// huh? why did type break?
		tx = /** @type {any} */ (getTx(vm, txBuf))
	} catch (e) {
		// TODO type this error
		throw new InvalidTransactionError('Invalid transaction. Unable to parse data', { cause: /** @type {Error}*/ (e) })
	}
	const impersonatedAccount = client.getImpersonatedAccount()
	if (!tx.isSigned() && impersonatedAccount !== undefined) {
		/**
		 * @type {import("@tevm/tx").FeeMarketEIP1559Transaction & {impersonatedAddress: EthjsAddress} }
		 **/
		const impersonatedTx = /** @type {any}*/ (tx)
		impersonatedTx.impersonatedAddress = createAddress(impersonatedAccount)
		tx = createImpersonatedTx(impersonatedTx)
	} else if (!tx.isSigned()) {
		client.logger.debug(
			'Raw Transaction is not signed. Consider calling impersonate endpoint. In future versions unsigned transactions will be rejected.',
		)
		/**
		 * @type {import("@tevm/tx").FeeMarketEIP1559Transaction & {impersonatedAddress: EthjsAddress} }
		 **/
		const impersonatedTx = /** @type {any}*/ (tx)
		impersonatedTx.impersonatedAddress = createAddress(
			impersonatedAccount ?? /** @type {import('@tevm/utils').Address} */ (prefundedAccounts[0]),
		)
		tx = createImpersonatedTx(impersonatedTx)
	}
	/**
	 * @type {import('../Call/CallResult.js').CallResult}
	 */
	let res
	try {
		res = await callHandler(client)({
			throwOnFail: false,
			createTransaction: 'always',
			...tx,
			from: /** @type {import('@tevm/utils').Address}*/ (tx.getSenderAddress().toString()),
			to: /** @type {import('@tevm/utils').Address}*/ (tx.to?.toString()),
			blobVersionedHashes: /** @type {import('@tevm/tx').EIP4844CompatibleTx}*/ (tx).blobVersionedHashes?.map((bytes) =>
				bytesToHex(bytes),
			),
			data: bytesToHex(tx.data),
		})
	} catch (error) {
		// TODO type this error
		throw new InvalidTransactionError('Invalid transaction. Unable to add transaction to pool', {
			cause: /** @type {Error}*/ (error),
		})
	}

	if (res.errors?.length === 1) {
		throw res.errors[0]
	}
	if ((res.errors?.length ?? 0) > 0) {
		throw new AggregateError(res.errors ?? [])
	}

	return bytesToHex(tx.hash())
}
