/**
 * @type {''}
 */
export const fileLevelOption = ''

/**
 * Typesafe wrapper around solc.compile
 * @param {any} solc
 * @param {import("./solcTypes.js").SolcInputDescription} input
 * @returns {import("./solcTypes.js").SolcOutput}
 */
export const solcCompile = (solc, input) => {
	return JSON.parse(solc.compile(JSON.stringify(input)))
}
