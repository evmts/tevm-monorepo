// @ts-ignore
import solc from 'solc'

/**
 * @type {''}
 */
export const fileLevelOption = ''

/**
 * Typesafe wrapper around solc.compile
 * @param {import("./solcTypes.js").SolcInputDescription} input
 * @returns {import("./solcTypes.js").SolcOutput}
 */
export const solcCompile = (input) => {
	return JSON.parse(solc.compile(JSON.stringify(input)))
}
