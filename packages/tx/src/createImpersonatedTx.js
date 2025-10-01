import { FeeMarket1559Tx } from '@ethereumjs/tx'
import { InternalError, InvalidGasLimitError } from '@tevm/errors'
import { EthjsAddress, keccak256 } from '@tevm/utils'

/**
 * @typedef {InternalError | InvalidGasLimitError} CreateImpersonatedTxError
 */

/**
 * Creates an impersonated tx that wraps {@link FeeMarket1559Tx}.
 * Wraps following methods
 * - 'isImpersonated'
 * - 'hash'
 * - 'isSigned'
 * - 'getSenderAddress'
 * @throws {CreateImpersonatedTxError} Error if the constructor for {@link FeeMarket1559Tx} throws
 * @param {import("@ethereumjs/tx").FeeMarketEIP1559TxData & {impersonatedAddress: EthjsAddress}} txData
 * @param {import("@ethereumjs/tx").TxOptions} [opts]
 * @returns {import('./ImpersonatedTx.js').ImpersonatedTx}
 */
export const createImpersonatedTx = (txData, opts) => {
	/**
	 * @type {FeeMarket1559Tx}
	 */
	let tx
	try {
		tx = new FeeMarket1559Tx(txData, opts)
	} catch (e) {
		if (!(e instanceof Error)) {
			throw new InternalError('Unknown Error', { cause: /** @type any*/ (e) })
		}
		if (e.message.includes('EIP-1559 not enabled on Common')) {
			throw new InternalError(
				'EIP-1559 is not enabled on Common. Tevm currently only supports 1559 and it should be enabled by default',
				{ cause: e },
			)
		}
		if (
			e.message.includes('gasLimit cannot exceed MAX_UINT64 (2^64-1)') ||
			e.message.includes('gasLimit * maxFeePerGas cannot exceed MAX_INTEGER (2^256-1)')
		) {
			throw new InvalidGasLimitError(e.message, { cause: e })
		}
		if (
			e.message.includes(
				'maxFeePerGas cannot be less than maxPriorityFeePerGas (The total must be the larger of the two)',
			)
		) {
			throw new InvalidGasLimitError(e.message, { cause: e })
		}
		throw new InternalError(e.message, { cause: e })
	}
	return /** @type {import('./ImpersonatedTx.js').ImpersonatedTx}*/ (
		new Proxy(tx, {
			get(target, prop) {
				if (prop === 'isImpersonated') {
					return true
				}
				if (prop === 'hash') {
					return () => {
						try {
							return target.hash()
						} catch (_e) {
							return keccak256(target.getHashedMessageToSign(), 'bytes')
						}
					}
				}
				if (prop === 'isSigned') {
					return () => true
				}
				if (prop === 'getSenderAddress') {
					return () => txData.impersonatedAddress
				}
				return Reflect.get(target, prop)
			},
		})
	)
}
