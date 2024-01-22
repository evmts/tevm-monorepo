'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.assertTransactionCIP42 =
	exports.serializersCelo =
	exports.serializeTransactionCelo =
		void 0
const address_js_1 = require('../../errors/address.js')
const base_js_1 = require('../../errors/base.js')
const chain_js_1 = require('../../errors/chain.js')
const node_js_1 = require('../../errors/node.js')
const isAddress_js_1 = require('../../utils/address/isAddress.js')
const concat_js_1 = require('../../utils/data/concat.js')
const trim_js_1 = require('../../utils/data/trim.js')
const toHex_js_1 = require('../../utils/encoding/toHex.js')
const toRlp_js_1 = require('../../utils/encoding/toRlp.js')
const serializeAccessList_js_1 = require('../../utils/transaction/serializeAccessList.js')
const serializeTransaction_js_1 = require('../../utils/transaction/serializeTransaction.js')
const serializeTransactionCelo = (tx, signature) => {
	if (isCIP42(tx)) return serializeTransactionCIP42(tx, signature)
	return (0, serializeTransaction_js_1.serializeTransaction)(tx, signature)
}
exports.serializeTransactionCelo = serializeTransactionCelo
exports.serializersCelo = {
	transaction: exports.serializeTransactionCelo,
}
function serializeTransactionCIP42(transaction, signature) {
	assertTransactionCIP42(transaction)
	const {
		chainId,
		gas,
		nonce,
		to,
		value,
		maxFeePerGas,
		maxPriorityFeePerGas,
		accessList,
		feeCurrency,
		gatewayFeeRecipient,
		gatewayFee,
		data,
	} = transaction
	const serializedTransaction = [
		(0, toHex_js_1.toHex)(chainId),
		nonce ? (0, toHex_js_1.toHex)(nonce) : '0x',
		maxPriorityFeePerGas ? (0, toHex_js_1.toHex)(maxPriorityFeePerGas) : '0x',
		maxFeePerGas ? (0, toHex_js_1.toHex)(maxFeePerGas) : '0x',
		gas ? (0, toHex_js_1.toHex)(gas) : '0x',
		feeCurrency ?? '0x',
		gatewayFeeRecipient ?? '0x',
		gatewayFee ? (0, toHex_js_1.toHex)(gatewayFee) : '0x',
		to ?? '0x',
		value ? (0, toHex_js_1.toHex)(value) : '0x',
		data ?? '0x',
		(0, serializeAccessList_js_1.serializeAccessList)(accessList),
	]
	if (signature) {
		serializedTransaction.push(
			signature.v === 27n ? '0x' : (0, toHex_js_1.toHex)(1),
			(0, trim_js_1.trim)(signature.r),
			(0, trim_js_1.trim)(signature.s),
		)
	}
	return (0, concat_js_1.concatHex)([
		'0x7c',
		(0, toRlp_js_1.toRlp)(serializedTransaction),
	])
}
function isCIP42(transaction) {
	if (
		'maxFeePerGas' in transaction &&
		'maxPriorityFeePerGas' in transaction &&
		('feeCurrency' in transaction ||
			'gatewayFee' in transaction ||
			'gatewayFeeRecipient' in transaction)
	)
		return true
	return false
}
const MAX_MAX_FEE_PER_GAS =
	115792089237316195423570985008687907853269984665640564039457584007913129639935n
function assertTransactionCIP42(transaction) {
	const {
		chainId,
		maxPriorityFeePerGas,
		gasPrice,
		maxFeePerGas,
		to,
		feeCurrency,
		gatewayFee,
		gatewayFeeRecipient,
	} = transaction
	if (chainId <= 0) throw new chain_js_1.InvalidChainIdError({ chainId })
	if (to && !(0, isAddress_js_1.isAddress)(to))
		throw new address_js_1.InvalidAddressError({ address: to })
	if (gasPrice)
		throw new base_js_1.BaseError(
			'`gasPrice` is not a valid CIP-42 Transaction attribute.',
		)
	if (maxFeePerGas && maxFeePerGas > MAX_MAX_FEE_PER_GAS)
		throw new node_js_1.FeeCapTooHighError({ maxFeePerGas })
	if (
		maxPriorityFeePerGas &&
		maxFeePerGas &&
		maxPriorityFeePerGas > maxFeePerGas
	)
		throw new node_js_1.TipAboveFeeCapError({
			maxFeePerGas,
			maxPriorityFeePerGas,
		})
	if (
		(gatewayFee && !gatewayFeeRecipient) ||
		(gatewayFeeRecipient && !gatewayFee)
	) {
		throw new base_js_1.BaseError(
			'`gatewayFee` and `gatewayFeeRecipient` must be provided together.',
		)
	}
	if (feeCurrency && !feeCurrency?.startsWith('0x')) {
		throw new base_js_1.BaseError(
			'`feeCurrency` MUST be a token address for CIP-42 transactions.',
		)
	}
	if (!feeCurrency && !gatewayFeeRecipient) {
		throw new base_js_1.BaseError(
			'Either `feeCurrency` or `gatewayFeeRecipient` must be provided for CIP-42 transactions.',
		)
	}
}
exports.assertTransactionCIP42 = assertTransactionCIP42
//# sourceMappingURL=serializers.js.map
