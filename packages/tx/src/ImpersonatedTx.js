import { Capability, FeeMarketEIP1559Transaction } from '@ethereumjs/tx'
import { EthjsAddress, keccak256 } from '@tevm/utils'

/**
 */
export class ImpersonatedTx {
	/**
	 * @protected
	 */
	_validateCannotExceedMaxInteger() {
		// protected property
		return /** @type {any}*/ (this._wrappedTx)._validateCannotExceedMaxInteger()
	}
	/**
	 * @protected
	 */
	_getSharedErrorPostfix() {
		// protected property
		return /** @type {any}*/ (this._wrappedTx)._getSharedErrorPostfix()
	}
	_getCommon() {
		return this.common
	}
	/**
	 * @protected
	 */
	_errorMsg() {
		// protected property
		return /** @type {any}*/ (this._wrappedTx)._errorMsg()
	}
	/**
	 * @protected
	 */
	get _type() {
		// protected property
		return /** @type {any}*/ (this._wrappedTx)._type
	}
	/**
	 * @protected
	 */
	get DEFAULT_CHAIN() {
		// protected property
		return /** @type {any}*/ (this._wrappedTx).DEFAULT_CHAIN
	}
	get AccessListJSON() {
		return this._wrappedTx.AccessListJSON
	}
	/**
	 * @protected
	 */
	get activeCapabilities() {
		// protected property
		return /** @type any*/ (this._wrappedTx).activeCapabilities
	}
	get maxPriorityFeePerGas() {
		return this._wrappedTx.maxPriorityFeePerGas
	}
	get gasLimit() {
		return this._wrappedTx.gasLimit
	}
	/**
	 * @protected
	 */
	get txOptions() {
		// returning a protected property here
		return /** @type any*/ (this._wrappedTx).txOptions
	}
	get accessList() {
		return this._wrappedTx.accessList
	}
	get maxFeePerGas() {
		return this._wrappedTx.maxFeePerGas
	}
	get cache() {
		return this._wrappedTx.cache
	}
	get nonce() {
		return this._wrappedTx.nonce
	}
	get value() {
		return this._wrappedTx.value
	}
	get chainId() {
		return this._wrappedTx.chainId
	}
	get common() {
		return this._wrappedTx.common
	}
	get type() {
		return this._wrappedTx.type
	}
	get data() {
		return this._wrappedTx.data
	}
	get to() {
		return this._wrappedTx.to
	}
	get r() {
		return this._wrappedTx.r
	}
	get s() {
		return this._wrappedTx.s
	}
	get v() {
		return this._wrappedTx.v
	}
	/**
	 * @type {FeeMarketEIP1559Transaction}
	 * @private
	 */
	_wrappedTx
	/**
	 * The impersonated sender
	 * @private
	 * @type {EthjsAddress}
	 */
	_impersonatedAddress

	/**
	 * Computes a sha3-256 hash of the serialized tx.
	 *
	 * This method is faked for transactions that don't have a signer (impersonated). The returned hash is simply keccak256 of the message that is usually signed
	 * See also {@link FeeMarketEIP1559Transaction.getMessageToSign}
	 */
	hash() {
		return keccak256(this._wrappedTx.getHashedMessageToSign(), 'bytes')
	}

	isSigned() {
		return true
	}

	getSenderAddress() {
		return this._impersonatedAddress
	}

	getHashedMessageToSign() {
		return this._wrappedTx.getHashedMessageToSign()
	}

	raw() {
		return this._wrappedTx.raw()
	}

	/**
	 * @param {Uint8Array} privateKey
	 */
	sign(privateKey) {
		return this._wrappedTx.sign(privateKey)
	}

	toJSON() {
		return this._wrappedTx.toJSON()
	}

	isValid() {
		return this._wrappedTx.isValid()
	}

	errorStr() {
		return this._wrappedTx.errorStr()
	}

	/**
	 * @param {Capability} capability
	 */
	supports(capability) {
		return this._wrappedTx.supports(capability)
	}

	serialize() {
		return this._wrappedTx.serialize()
	}

	getBaseFee() {
		return this._wrappedTx.getBaseFee()
	}

	/**
	 * @param {bigint} v
	 * @param {bigint} r
	 * @param {bigint} s
	 * @param {boolean | undefined} [convertV]
	 */
	addSignature(v, r, s, convertV) {
		return this._wrappedTx.addSignature(v, r, s, convertV)
	}
	/**
	 * @param {bigint} baseFee
	 */
	getUpfrontCost(baseFee) {
		return this._wrappedTx.getUpfrontCost(baseFee)
	}
	getDataFee() {
		return this._wrappedTx.getDataFee()
	}
	verifySignature() {
		return this._wrappedTx.verifySignature()
	}
	getMessageToSign() {
		return this._wrappedTx.getMessageToSign()
	}
	toCreationAddress() {
		return this._wrappedTx.toCreationAddress()
	}
	getSenderPublicKey() {
		return this._wrappedTx.getSenderPublicKey()
	}
	getValidationErrors() {
		return this._wrappedTx.getValidationErrors()
	}
	/**
	 * @param {bigint} baseFee
	 */
	getEffectivePriorityFee(baseFee) {
		return this._wrappedTx.getEffectivePriorityFee(baseFee)
	}
	getMessageToVerifySignature() {
		return this._wrappedTx.getMessageToVerifySignature()
	}
	/**
	 * @param {import("@ethereumjs/tx").FeeMarketEIP1559TxData & {impersonatedAddress: EthjsAddress}} txData
	 * @param {import("@ethereumjs/tx").TxOptions} [opts]
	 */
	constructor({ impersonatedAddress, ...txData }, opts = {}) {
		this._impersonatedAddress = impersonatedAddress
		this._wrappedTx = new FeeMarketEIP1559Transaction(txData, opts)
	}
}
