/**
 * @description Picks out the keys from `value` that exist in the formatter.
 */
export function extract(value, { format }) {
	if (!format) return {}
	const keys = Object.keys(format({}))
	return keys.reduce((data, key) => {
		// biome-ignore lint/suspicious/noPrototypeBuiltins:
		if (value?.hasOwnProperty(key)) {
			data[key] = value[key]
		}
		return data
	}, {})
}
//# sourceMappingURL=extract.js.map
