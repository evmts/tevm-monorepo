'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.parseAccessList =
	exports.toTransactionArray =
	exports.parseTransaction =
		void 0
const address_js_1 = require('../../errors/address.js')
const transaction_js_1 = require('../../errors/transaction.js')
const isAddress_js_1 = require('../address/isAddress.js')
const isHex_js_1 = require('../data/isHex.js')
const pad_js_1 = require('../data/pad.js')
const trim_js_1 = require('../data/trim.js')
const fromHex_js_1 = require('../encoding/fromHex.js')
const fromRlp_js_1 = require('../encoding/fromRlp.js')
const isHash_js_1 = require('../hash/isHash.js')
const assertTransaction_js_1 = require('./assertTransaction.js')
const getSerializedTransactionType_js_1 = require('./getSerializedTransactionType.js')
function parseTransaction(serializedTransaction) {
	const type = (0,
	getSerializedTransactionType_js_1.getSerializedTransactionType)(
		serializedTransaction,
	)
	if (type === 'eip1559') return parseTransactionEIP1559(serializedTransaction)
	if (type === 'eip2930') return parseTransactionEIP2930(serializedTransaction)
	return parseTransactionLegacy(serializedTransaction)
}
exports.parseTransaction = parseTransaction
function parseTransactionEIP1559(serializedTransaction) {
	const transactionArray = toTransactionArray(serializedTransaction)
	const [
		chainId,
		nonce,
		maxPriorityFeePerGas,
		maxFeePerGas,
		gas,
		to,
		value,
		data,
		accessList,
		v,
		r,
		s,
	] = transactionArray
	if (!(transactionArray.length === 9 || transactionArray.length === 12))
		throw new transaction_js_1.InvalidSerializedTransactionError({
			attributes: {
				chainId,
				nonce,
				maxPriorityFeePerGas,
				maxFeePerGas,
				gas,
				to,
				value,
				data,
				accessList,
				...(transactionArray.length > 9
					? {
							v,
							r,
							s,
					  }
					: {}),
			},
			serializedTransaction,
			type: 'eip1559',
		})
	const transaction = {
		chainId: (0, fromHex_js_1.hexToNumber)(chainId),
		type: 'eip1559',
	}
	if ((0, isHex_js_1.isHex)(to) && to !== '0x') transaction.to = to
	if ((0, isHex_js_1.isHex)(gas) && gas !== '0x')
		transaction.gas = (0, fromHex_js_1.hexToBigInt)(gas)
	if ((0, isHex_js_1.isHex)(data) && data !== '0x') transaction.data = data
	if ((0, isHex_js_1.isHex)(nonce) && nonce !== '0x')
		transaction.nonce = (0, fromHex_js_1.hexToNumber)(nonce)
	if ((0, isHex_js_1.isHex)(value) && value !== '0x')
		transaction.value = (0, fromHex_js_1.hexToBigInt)(value)
	if ((0, isHex_js_1.isHex)(maxFeePerGas) && maxFeePerGas !== '0x')
		transaction.maxFeePerGas = (0, fromHex_js_1.hexToBigInt)(maxFeePerGas)
	if (
		(0, isHex_js_1.isHex)(maxPriorityFeePerGas) &&
		maxPriorityFeePerGas !== '0x'
	)
		transaction.maxPriorityFeePerGas = (0, fromHex_js_1.hexToBigInt)(
			maxPriorityFeePerGas,
		)
	if (accessList.length !== 0 && accessList !== '0x')
		transaction.accessList = parseAccessList(accessList)
	;(0, assertTransaction_js_1.assertTransactionEIP1559)(transaction)
	const signature =
		transactionArray.length === 12
			? parseEIP155Signature(transactionArray)
			: undefined
	return { ...signature, ...transaction }
}
function parseTransactionEIP2930(serializedTransaction) {
	const transactionArray = toTransactionArray(serializedTransaction)
	const [chainId, nonce, gasPrice, gas, to, value, data, accessList, v, r, s] =
		transactionArray
	if (!(transactionArray.length === 8 || transactionArray.length === 11))
		throw new transaction_js_1.InvalidSerializedTransactionError({
			attributes: {
				chainId,
				nonce,
				gasPrice,
				gas,
				to,
				value,
				data,
				accessList,
				...(transactionArray.length > 8
					? {
							v,
							r,
							s,
					  }
					: {}),
			},
			serializedTransaction,
			type: 'eip2930',
		})
	const transaction = {
		chainId: (0, fromHex_js_1.hexToNumber)(chainId),
		type: 'eip2930',
	}
	if ((0, isHex_js_1.isHex)(to) && to !== '0x') transaction.to = to
	if ((0, isHex_js_1.isHex)(gas) && gas !== '0x')
		transaction.gas = (0, fromHex_js_1.hexToBigInt)(gas)
	if ((0, isHex_js_1.isHex)(data) && data !== '0x') transaction.data = data
	if ((0, isHex_js_1.isHex)(nonce) && nonce !== '0x')
		transaction.nonce = (0, fromHex_js_1.hexToNumber)(nonce)
	if ((0, isHex_js_1.isHex)(value) && value !== '0x')
		transaction.value = (0, fromHex_js_1.hexToBigInt)(value)
	if ((0, isHex_js_1.isHex)(gasPrice) && gasPrice !== '0x')
		transaction.gasPrice = (0, fromHex_js_1.hexToBigInt)(gasPrice)
	if (accessList.length !== 0 && accessList !== '0x')
		transaction.accessList = parseAccessList(accessList)
	;(0, assertTransaction_js_1.assertTransactionEIP2930)(transaction)
	const signature =
		transactionArray.length === 11
			? parseEIP155Signature(transactionArray)
			: undefined
	return { ...signature, ...transaction }
}
function parseTransactionLegacy(serializedTransaction) {
	const transactionArray = (0, fromRlp_js_1.fromRlp)(
		serializedTransaction,
		'hex',
	)
	const [nonce, gasPrice, gas, to, value, data, chainIdOrV_, r, s] =
		transactionArray
	if (!(transactionArray.length === 6 || transactionArray.length === 9))
		throw new transaction_js_1.InvalidSerializedTransactionError({
			attributes: {
				nonce,
				gasPrice,
				gas,
				to,
				value,
				data,
				...(transactionArray.length > 6
					? {
							v: chainIdOrV_,
							r,
							s,
					  }
					: {}),
			},
			serializedTransaction,
			type: 'legacy',
		})
	const transaction = {
		type: 'legacy',
	}
	if ((0, isHex_js_1.isHex)(to) && to !== '0x') transaction.to = to
	if ((0, isHex_js_1.isHex)(gas) && gas !== '0x')
		transaction.gas = (0, fromHex_js_1.hexToBigInt)(gas)
	if ((0, isHex_js_1.isHex)(data) && data !== '0x') transaction.data = data
	if ((0, isHex_js_1.isHex)(nonce) && nonce !== '0x')
		transaction.nonce = (0, fromHex_js_1.hexToNumber)(nonce)
	if ((0, isHex_js_1.isHex)(value) && value !== '0x')
		transaction.value = (0, fromHex_js_1.hexToBigInt)(value)
	if ((0, isHex_js_1.isHex)(gasPrice) && gasPrice !== '0x')
		transaction.gasPrice = (0, fromHex_js_1.hexToBigInt)(gasPrice)
	;(0, assertTransaction_js_1.assertTransactionLegacy)(transaction)
	if (transactionArray.length === 6) return transaction
	const chainIdOrV =
		(0, isHex_js_1.isHex)(chainIdOrV_) && chainIdOrV_ !== '0x'
			? (0, fromHex_js_1.hexToBigInt)(chainIdOrV_)
			: 0n
	if (s === '0x' && r === '0x') {
		if (chainIdOrV > 0) transaction.chainId = Number(chainIdOrV)
		return transaction
	}
	const v = chainIdOrV
	const chainId = Number((v - 35n) / 2n)
	if (chainId > 0) transaction.chainId = chainId
	else if (v !== 27n && v !== 28n)
		throw new transaction_js_1.InvalidLegacyVError({ v })
	transaction.v = v
	transaction.s = s
	transaction.r = r
	return transaction
}
function toTransactionArray(serializedTransaction) {
	return (0, fromRlp_js_1.fromRlp)(`0x${serializedTransaction.slice(4)}`, 'hex')
}
exports.toTransactionArray = toTransactionArray
function parseAccessList(accessList_) {
	const accessList = []
	for (let i = 0; i < accessList_.length; i++) {
		const [address, storageKeys] = accessList_[i]
		if (!(0, isAddress_js_1.isAddress)(address))
			throw new address_js_1.InvalidAddressError({ address })
		accessList.push({
			address: address,
			storageKeys: storageKeys.map((key) =>
				(0, isHash_js_1.isHash)(key) ? key : (0, trim_js_1.trim)(key),
			),
		})
	}
	return accessList
}
exports.parseAccessList = parseAccessList
function parseEIP155Signature(transactionArray) {
	const signature = transactionArray.slice(-3)
	const v =
		signature[0] === '0x' || (0, fromHex_js_1.hexToBigInt)(signature[0]) === 0n
			? 27n
			: 28n
	return {
		r: (0, pad_js_1.padHex)(signature[1], { size: 32 }),
		s: (0, pad_js_1.padHex)(signature[2], { size: 32 }),
		v,
		yParity: v === 27n ? 0 : 1,
	}
}
//# sourceMappingURL=parseTransaction.js.map
