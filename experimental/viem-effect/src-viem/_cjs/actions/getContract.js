'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.getEventParameters =
	exports.getFunctionParameters =
	exports.getContract =
		void 0
const createContractEventFilter_js_1 = require('./public/createContractEventFilter.js')
const estimateContractGas_js_1 = require('./public/estimateContractGas.js')
const readContract_js_1 = require('./public/readContract.js')
const simulateContract_js_1 = require('./public/simulateContract.js')
const watchContractEvent_js_1 = require('./public/watchContractEvent.js')
const writeContract_js_1 = require('./wallet/writeContract.js')
function getContract({ abi, address, publicClient, walletClient }) {
	const hasPublicClient = publicClient !== undefined && publicClient !== null
	const hasWalletClient = walletClient !== undefined && walletClient !== null
	const contract = {}
	let hasReadFunction = false
	let hasWriteFunction = false
	let hasEvent = false
	for (const item of abi) {
		if (item.type === 'function')
			if (item.stateMutability === 'view' || item.stateMutability === 'pure')
				hasReadFunction = true
			else hasWriteFunction = true
		else if (item.type === 'event') hasEvent = true
		if (hasReadFunction && hasWriteFunction && hasEvent) break
	}
	if (hasPublicClient) {
		if (hasReadFunction)
			contract.read = new Proxy(
				{},
				{
					get(_, functionName) {
						return (...parameters) => {
							const { args, options } = getFunctionParameters(parameters)
							return (0, readContract_js_1.readContract)(publicClient, {
								abi,
								address,
								functionName,
								args,
								...options,
							})
						}
					},
				},
			)
		if (hasWriteFunction)
			contract.simulate = new Proxy(
				{},
				{
					get(_, functionName) {
						return (...parameters) => {
							const { args, options } = getFunctionParameters(parameters)
							return (0, simulateContract_js_1.simulateContract)(publicClient, {
								abi,
								address,
								functionName,
								args,
								...options,
							})
						}
					},
				},
			)
		if (hasEvent) {
			contract.createEventFilter = new Proxy(
				{},
				{
					get(_, eventName) {
						return (...parameters) => {
							const abiEvent = abi.find(
								(x) => x.type === 'event' && x.name === eventName,
							)
							const { args, options } = getEventParameters(parameters, abiEvent)
							return (0,
							createContractEventFilter_js_1.createContractEventFilter)(
								publicClient,
								{
									abi,
									address,
									eventName,
									args,
									...options,
								},
							)
						}
					},
				},
			)
			contract.watchEvent = new Proxy(
				{},
				{
					get(_, eventName) {
						return (...parameters) => {
							const abiEvent = abi.find(
								(x) => x.type === 'event' && x.name === eventName,
							)
							const { args, options } = getEventParameters(parameters, abiEvent)
							return (0, watchContractEvent_js_1.watchContractEvent)(
								publicClient,
								{
									abi,
									address,
									eventName,
									args,
									...options,
								},
							)
						}
					},
				},
			)
		}
	}
	if (hasWalletClient) {
		if (hasWriteFunction)
			contract.write = new Proxy(
				{},
				{
					get(_, functionName) {
						return (...parameters) => {
							const { args, options } = getFunctionParameters(parameters)
							return (0, writeContract_js_1.writeContract)(walletClient, {
								abi,
								address,
								functionName,
								args,
								...options,
							})
						}
					},
				},
			)
	}
	if (hasPublicClient || hasWalletClient)
		if (hasWriteFunction)
			contract.estimateGas = new Proxy(
				{},
				{
					get(_, functionName) {
						return (...parameters) => {
							const { args, options } = getFunctionParameters(parameters)
							const client = publicClient ?? walletClient
							return (0, estimateContractGas_js_1.estimateContractGas)(client, {
								abi,
								address,
								functionName,
								args,
								...options,
								account: options.account ?? walletClient.account,
							})
						}
					},
				},
			)
	contract.address = address
	contract.abi = abi
	return contract
}
exports.getContract = getContract
function getFunctionParameters(values) {
	const hasArgs = values.length && Array.isArray(values[0])
	const args = hasArgs ? values[0] : []
	const options = (hasArgs ? values[1] : values[0]) ?? {}
	return { args, options }
}
exports.getFunctionParameters = getFunctionParameters
function getEventParameters(values, abiEvent) {
	let hasArgs = false
	if (Array.isArray(values[0])) hasArgs = true
	else if (values.length === 1) {
		hasArgs = abiEvent.inputs.some((x) => x.indexed)
	} else if (values.length === 2) {
		hasArgs = true
	}
	const args = hasArgs ? values[0] : undefined
	const options = (hasArgs ? values[1] : values[0]) ?? {}
	return { args, options }
}
exports.getEventParameters = getEventParameters
//# sourceMappingURL=getContract.js.map
