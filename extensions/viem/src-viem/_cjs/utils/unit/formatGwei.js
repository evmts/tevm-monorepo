'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.formatGwei = void 0
const unit_js_1 = require('../../constants/unit.js')
const formatUnits_js_1 = require('./formatUnits.js')
function formatGwei(wei, unit = 'wei') {
	return (0, formatUnits_js_1.formatUnits)(wei, unit_js_1.gweiUnits[unit])
}
exports.formatGwei = formatGwei
//# sourceMappingURL=formatGwei.js.map
