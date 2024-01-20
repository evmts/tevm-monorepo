'use strict'

const client = require('@tevm/client')
const contract = require('@tevm/contract')
const vm = require('@tevm/vm')

Object.defineProperty(exports, 'createTevmClient', {
	enumerable: true,
	get: function () {
		return client.createTevmClient
	},
})
Object.defineProperty(exports, 'createContract', {
	enumerable: true,
	get: function () {
		return contract.createContract
	},
})
Object.defineProperty(exports, 'decodeFunctionData', {
	enumerable: true,
	get: function () {
		return contract.decodeFunctionData
	},
})
Object.defineProperty(exports, 'decodeFunctionResult', {
	enumerable: true,
	get: function () {
		return contract.decodeFunctionResult
	},
})
Object.defineProperty(exports, 'encodeFunctionData', {
	enumerable: true,
	get: function () {
		return contract.encodeFunctionData
	},
})
Object.defineProperty(exports, 'encodeFunctionResult', {
	enumerable: true,
	get: function () {
		return contract.encodeFunctionResult
	},
})
Object.defineProperty(exports, 'parseAbi', {
	enumerable: true,
	get: function () {
		return contract.parseAbi
	},
})
Object.defineProperty(exports, 'createMemoryTevm', {
	enumerable: true,
	get: function () {
		return vm.createMemoryTevm
	},
})
//# sourceMappingURL=out.js.map
//# sourceMappingURL=index.cjs.map
