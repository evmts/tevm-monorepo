import { BlobEIP4844Transaction, TransactionFactory } from '@tevm/tx'
import { bytesToHex, hexToBytes } from '@tevm/utils'
import { callHandler } from '../index.js'

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
 */
const getTx = (vm, txBuf) => {
	switch (txBuf[0]) {
		case txType.LEGACY:
		case txType.ACCESS_LIST:
		case txType.EIP1559:
			return TransactionFactory.fromSerializedData(txBuf, {
				common: vm.common,
			})
		case txType.BLOB: {
			const tx = BlobEIP4844Transaction.fromSerializedBlobTxNetworkWrapper(txBuf, { common: vm.common })
			const blobGasLimit = vm.common.param('gasConfig', 'maxblobGasPerBlock')
			const blobGasPerBlob = vm.common.param('gasConfig', 'blobGasPerBlob')

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
 * @param {import('@tevm/base-client').BaseClient} client
 * @returns {import('@tevm/actions-types').EthSendRawTransactionHandler}
 */
export const ethSendRawTransactionHandler = (client) => async (params) => {
	const vm = await client.getVm()
	const txBuf = hexToBytes(params.data)
	/**
	 * @type {import('@tevm/tx').BlobEIP4844Transaction | import('@tevm/tx').LegacyTransaction | import('@tevm/tx').AccessListEIP2930Transaction | import('@tevm/tx').FeeMarketEIP1559Transaction}
	 */
	let tx
	try {
		tx = getTx(vm, txBuf)
	} catch (e) {
		// TODO type this error
		throw new Error('Invalid transaction. Unable to parse data')
	}
	if (!tx.isSigned()) {
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
			from: /** @type {import('@tevm/utils').Address}*/ (tx.getSenderAddress().toString()),
			to: /** @type {import('@tevm/utils').Address}*/ (tx.to?.toString()),
			blobVersionedHashes: /** @type {import('@tevm/tx').EIP4844CompatibleTx}*/ (tx).blobVersionedHashes.map((bytes) =>
				bytesToHex(bytes),
			),
			data: bytesToHex(tx.data),
		})
	} catch (error) {
		// TODO type this error
		throw new Error('Invalid transaction. Unable to add transaction to pool')
	}

	if (res.errors?.length === 1) {
		throw res.errors[0]
	}
	if ((res.errors?.length ?? 0) > 0) {
		throw new AggregateError(res.errors ?? [])
	}

	return bytesToHex(tx.hash())
}
