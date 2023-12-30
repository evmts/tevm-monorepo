'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.serializeTransaction = void 0
const transaction_js_1 = require('../../errors/transaction.js')
const concat_js_1 = require('../data/concat.js')
const trim_js_1 = require('../data/trim.js')
const toHex_js_1 = require('../encoding/toHex.js')
const toRlp_js_1 = require('../encoding/toRlp.js')
const assertTransaction_js_1 = require('./assertTransaction.js')
const getTransactionType_js_1 = require('./getTransactionType.js')
const serializeAccessList_js_1 = require('./serializeAccessList.js')
function serializeTransaction(transaction, signature) {
	const type = (0, getTransactionType_js_1.getTransactionType)(transaction)
	if (type === 'eip1559')
		return serializeTransactionEIP1559(transaction, signature)
	if (type === 'eip2930')
		return serializeTransactionEIP2930(transaction, signature)
	return serializeTransactionLegacy(transaction, signature)
}
exports.serializeTransaction = serializeTransaction
function serializeTransactionEIP1559(transaction, signature) {
	const {
		chainId,
		gas,
		nonce,
		to,
		value,
		maxFeePerGas,
		maxPriorityFeePerGas,
		accessList,
		data,
	} = transaction
	;(0, assertTransaction_js_1.assertTransactionEIP1559)(transaction)
	const serializedAccessList = (0,
	serializeAccessList_js_1.serializeAccessList)(accessList)
	const serializedTransaction = [
		(0, toHex_js_1.toHex)(chainId),
		nonce ? (0, toHex_js_1.toHex)(nonce) : '0x',
		maxPriorityFeePerGas ? (0, toHex_js_1.toHex)(maxPriorityFeePerGas) : '0x',
		maxFeePerGas ? (0, toHex_js_1.toHex)(maxFeePerGas) : '0x',
		gas ? (0, toHex_js_1.toHex)(gas) : '0x',
		to ?? '0x',
		value ? (0, toHex_js_1.toHex)(value) : '0x',
		data ?? '0x',
		serializedAccessList,
	]
	if (signature)
		serializedTransaction.push(
			signature.v === 27n ? '0x' : (0, toHex_js_1.toHex)(1),
			(0, trim_js_1.trim)(signature.r),
			(0, trim_js_1.trim)(signature.s),
		)
	return (0, concat_js_1.concatHex)([
		'0x02',
		(0, toRlp_js_1.toRlp)(serializedTransaction),
	])
}
function serializeTransactionEIP2930(transaction, signature) {
	const { chainId, gas, data, nonce, to, value, accessList, gasPrice } =
		transaction
	;(0, assertTransaction_js_1.assertTransactionEIP2930)(transaction)
	const serializedAccessList = (0,
	serializeAccessList_js_1.serializeAccessList)(accessList)
	const serializedTransaction = [
		(0, toHex_js_1.toHex)(chainId),
		nonce ? (0, toHex_js_1.toHex)(nonce) : '0x',
		gasPrice ? (0, toHex_js_1.toHex)(gasPrice) : '0x',
		gas ? (0, toHex_js_1.toHex)(gas) : '0x',
		to ?? '0x',
		value ? (0, toHex_js_1.toHex)(value) : '0x',
		data ?? '0x',
		serializedAccessList,
	]
	if (signature)
		serializedTransaction.push(
			signature.v === 27n ? '0x' : (0, toHex_js_1.toHex)(1),
			signature.r,
			signature.s,
		)
	return (0, concat_js_1.concatHex)([
		'0x01',
		(0, toRlp_js_1.toRlp)(serializedTransaction),
	])
}
function serializeTransactionLegacy(transaction, signature) {
	const { chainId = 0, gas, data, nonce, to, value, gasPrice } = transaction
	;(0, assertTransaction_js_1.assertTransactionLegacy)(transaction)
	let serializedTransaction = [
		nonce ? (0, toHex_js_1.toHex)(nonce) : '0x',
		gasPrice ? (0, toHex_js_1.toHex)(gasPrice) : '0x',
		gas ? (0, toHex_js_1.toHex)(gas) : '0x',
		to ?? '0x',
		value ? (0, toHex_js_1.toHex)(value) : '0x',
		data ?? '0x',
	]
	if (signature) {
		let v = 27n + (signature.v === 27n ? 0n : 1n)
		if (chainId > 0) v = BigInt(chainId * 2) + BigInt(35n + signature.v - 27n)
		else if (signature.v !== v)
			throw new transaction_js_1.InvalidLegacyVError({ v: signature.v })
		serializedTransaction = [
			...serializedTransaction,
			(0, toHex_js_1.toHex)(v),
			signature.r,
			signature.s,
		]
	} else if (chainId > 0) {
		serializedTransaction = [
			...serializedTransaction,
			(0, toHex_js_1.toHex)(chainId),
			'0x',
			'0x',
		]
	}
	return (0, toRlp_js_1.toRlp)(serializedTransaction)
}
//# sourceMappingURL=serializeTransaction.js.map
