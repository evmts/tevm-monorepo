import { callHandler } from '../index.js'
import { BlobEIP4844Transaction, TransactionFactory } from '@tevm/tx'
import { bytesToHex, hexToBytes } from '@tevm/utils'

const txType = {
	LEGACY: 0x00,
	ACCESS_LIST: 0x01,
	EIP1559: 0x02,
	BLOB: 0x03,
	OPTIMISM_DEPOSIT: 0x7e,
}

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
 * @param {import('@tevm/vm').TevmVm} vm
 * @param {Uint8Array} txBuf
 * @param {import('@tevm/base-client').BaseClient} client
 */
const getTx = (vm, txBuf, client) => {
	client.logger.info(txBuf, 'creating tx from buffer')
	switch (txBuf[0]) {
		case txType.LEGACY:
		case txType.ACCESS_LIST:
		case txType.EIP1559:
			client.logger.info(
				txBuf[0],
				'identified legacy access list or eip1559 tx type',
			)
			return TransactionFactory.fromSerializedData(txBuf, {
				common: vm.common,
			})
		case txType.BLOB: {
			client.logger.info(txBuf[0], 'identified blob tx type')
			const tx = BlobEIP4844Transaction.fromSerializedBlobTxNetworkWrapper(
				txBuf,
				{ common: vm.common },
			)
			const blobGasLimit = vm.common.param('gasConfig', 'maxblobGasPerBlock')
			const blobGasPerBlob = vm.common.param('gasConfig', 'blobGasPerBlob')

			client.logger.info(
				{ blobGasLimit, blobGasPerBlob },
				'read common for blob gas config options',
			)

			const blobCount = BigInt(tx.blobs?.length ?? 0)
			const blobGas = blobCount * blobGasPerBlob
			if (blobGas > blobGasLimit) {
				client.logger.error(
					{ blobGas, blobGasLimit },
					'Error: BlobGasLimit is lower than BlobGas',
				)
				throw new BlobGasLimitExceededError()
			}
			return tx
		}
		case txType.OPTIMISM_DEPOSIT:
			client.logger.info(txBuf[0], 'identified optimism deposit tx type')
			throw new Error('Optimism deposit tx are not supported')
		default:
			throw new Error(`Invalid transaction type ${txBuf[0]}`)
	}
}

/**
 * @param {import('@tevm/base-client').BaseClient} client
 * @returns {import('@tevm/actions-types').EthSendRawTransactionHandler}
 */
export const ethSendRawTransactionHandler = (client) => async (params) => {
	client.logger.debug(params, 'ethSendRawTransaction called with params')

	const vm = await client.getVm()
	const txBuf = hexToBytes(params.data)
	/**
	 * @type {import('@tevm/tx').BlobEIP4844Transaction | import('@tevm/tx').LegacyTransaction | import('@tevm/tx').AccessListEIP2930Transaction | import('@tevm/tx').FeeMarketEIP1559Transaction}
	 */
	let tx
	try {
		tx = getTx(vm, txBuf, client)
		client.logger.debug(tx, 'parsed tx')
	} catch (e) {
		client.logger.error(e, 'There was an error parsing transaction')
		// TODO type this error
		throw new Error('Invalid transaction. Unable to parse data')
	}
	if (!tx.isSigned()) {
		client.logger.error('Invalid transaction unsigned')
		// TODO type this error
		throw new Error('Invalid transaction. Transaction is not signed')
	}

	/**
	 * @type {import('@tevm/actions-types').CallResult}
	 */
	let res
	try {
		res = await callHandler(client)({
			throwOnFail: false,
			createTransaction: 'always',
			...tx,
			from: /** @type {import('@tevm/utils').Address}*/ (
				tx.getSenderAddress().toString()
			),
			to: /** @type {import('@tevm/utils').Address}*/ (tx.to?.toString()),
			blobVersionedHashes:
				/** @type {import('@tevm/tx').EIP4844CompatibleTx}*/ (
					tx
				).blobVersionedHashes.map((bytes) => bytesToHex(bytes)),
			data: bytesToHex(tx.data),
		})
	} catch (error) {
		client.logger.error(error, 'There was an error adding transaction to pool')
		// TODO type this error
		throw new Error('Invalid transaction. Unable to add transaction to pool')
	}

	if (res.errors?.length === 1) {
		client.logger.error(
			res.errors,
			`There was an error in transaction${res.txHash}`
				? '. The transaction was still added to mempool to be included in cannonical chain'
				: '',
		)
		if (!res.txHash) {
			throw res.errors[0]
		}
	}
	if ((res.errors?.length ?? 0) > 0) {
		client.logger.error(
			res.errors,
			`There was an error in transaction${res.txHash}`
				? '. The transaction was still added to mempool to be included in cannonical chain'
				: '',
		)
		if (!res.txHash) {
			throw new AggregateError(res.errors ?? [])
		}
	}

	client.logger.debug(tx.hash(), 'ethSendRawTransactionHandler successful')

	return bytesToHex(tx.hash())
}
