const normalize = (value) => {
	if (Array.isArray(value)) {
		return value.map(normalize)
	}
	if (value && typeof value === 'object') {
		return Object.fromEntries(
			Object.entries(value)
				.sort(([a], [b]) => a.localeCompare(b))
				.map(([key, item]) => [key, normalize(item)]),
		)
	}
	return value
}

/**
 * @param {import('@tevm/config').ResolvedCompilerConfig} config
 * @param {import('@tevm/solc').Solc} solc
 * @param {boolean} includeAst
 * @param {boolean} includeBytecode
 * @returns {string}
 */
export const createCompileFingerprint = (config, solc, includeAst, includeBytecode) => {
	let solcVersion
	try {
		solcVersion = typeof solc.version === 'function' ? solc.version() : solc.version
	} catch (_e) {
		solcVersion = undefined
	}
	return JSON.stringify(
		normalize({
			config: {
				foundryProject: config.foundryProject,
				jsonAsConst: config.jsonAsConst,
				libs: config.libs,
				remappings: config.remappings,
			},
			outputSelection: {
				includeAst,
				includeBytecode,
			},
			solcVersion,
		}),
	)
}
