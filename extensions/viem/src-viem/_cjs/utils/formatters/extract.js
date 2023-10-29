'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.extract = void 0
function extract(value, { format }) {
	if (!format) return {}
	const keys = Object.keys(format({}))
	return keys.reduce((data, key) => {
		if (value?.hasOwnProperty(key)) {
			data[key] = value[key]
		}
		return data
	}, {})
}
exports.extract = extract
//# sourceMappingURL=extract.js.map
