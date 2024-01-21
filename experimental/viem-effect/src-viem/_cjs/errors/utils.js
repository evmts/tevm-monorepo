'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.getVersion = exports.getUrl = exports.getContractAddress = void 0
const version_js_1 = require('./version.js')
const getContractAddress = (address) => address
exports.getContractAddress = getContractAddress
const getUrl = (url) => url
exports.getUrl = getUrl
const getVersion = () => `viem@${version_js_1.version}`
exports.getVersion = getVersion
//# sourceMappingURL=utils.js.map
