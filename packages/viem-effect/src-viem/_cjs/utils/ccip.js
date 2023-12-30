'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.ccipFetch =
	exports.offchainLookup =
	exports.offchainLookupAbiItem =
	exports.offchainLookupSignature =
		void 0
const call_js_1 = require('../actions/public/call.js')
const ccip_js_1 = require('../errors/ccip.js')
const request_js_1 = require('../errors/request.js')
const decodeErrorResult_js_1 = require('./abi/decodeErrorResult.js')
const encodeAbiParameters_js_1 = require('./abi/encodeAbiParameters.js')
const isAddressEqual_js_1 = require('./address/isAddressEqual.js')
const concat_js_1 = require('./data/concat.js')
const isHex_js_1 = require('./data/isHex.js')
const stringify_js_1 = require('./stringify.js')
exports.offchainLookupSignature = '0x556f1830'
exports.offchainLookupAbiItem = {
	name: 'OffchainLookup',
	type: 'error',
	inputs: [
		{
			name: 'sender',
			type: 'address',
		},
		{
			name: 'urls',
			type: 'string[]',
		},
		{
			name: 'callData',
			type: 'bytes',
		},
		{
			name: 'callbackFunction',
			type: 'bytes4',
		},
		{
			name: 'extraData',
			type: 'bytes',
		},
	],
}
async function offchainLookup(client, { blockNumber, blockTag, data, to }) {
	const { args } = (0, decodeErrorResult_js_1.decodeErrorResult)({
		data,
		abi: [exports.offchainLookupAbiItem],
	})
	const [sender, urls, callData, callbackSelector, extraData] = args
	try {
		if (!(0, isAddressEqual_js_1.isAddressEqual)(to, sender))
			throw new ccip_js_1.OffchainLookupSenderMismatchError({ sender, to })
		const result = await ccipFetch({ data: callData, sender, urls })
		const { data: data_ } = await (0, call_js_1.call)(client, {
			blockNumber,
			blockTag,
			data: (0, concat_js_1.concat)([
				callbackSelector,
				(0, encodeAbiParameters_js_1.encodeAbiParameters)(
					[{ type: 'bytes' }, { type: 'bytes' }],
					[result, extraData],
				),
			]),
			to,
		})
		return data_
	} catch (err) {
		throw new ccip_js_1.OffchainLookupError({
			callbackSelector,
			cause: err,
			data,
			extraData,
			sender,
			urls,
		})
	}
}
exports.offchainLookup = offchainLookup
async function ccipFetch({ data, sender, urls }) {
	let error = new Error('An unknown error occurred.')
	for (let i = 0; i < urls.length; i++) {
		const url = urls[i]
		const method =
			url.includes('{sender}') || url.includes('{data}') ? 'GET' : 'POST'
		const body = method === 'POST' ? { data, sender } : undefined
		try {
			const response = await fetch(
				url.replace('{sender}', sender).replace('{data}', data),
				{
					body: JSON.stringify(body),
					method,
				},
			)
			let result
			if (
				response.headers.get('Content-Type')?.startsWith('application/json')
			) {
				result = (await response.json()).data
			} else {
				result = await response.text()
			}
			if (!response.ok) {
				error = new request_js_1.HttpRequestError({
					body,
					details:
						(0, stringify_js_1.stringify)(result.error) || response.statusText,
					headers: response.headers,
					status: response.status,
					url,
				})
				continue
			}
			if (!(0, isHex_js_1.isHex)(result)) {
				error = new ccip_js_1.OffchainLookupResponseMalformedError({
					result,
					url,
				})
				continue
			}
			return result
		} catch (err) {
			error = new request_js_1.HttpRequestError({
				body,
				details: err.message,
				url,
			})
		}
	}
	throw error
}
exports.ccipFetch = ccipFetch
//# sourceMappingURL=ccip.js.map
