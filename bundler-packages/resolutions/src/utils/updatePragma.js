import { fail, succeed } from 'effect/Effect'

export class NoPragmaFoundError extends Error {
	/**
	 * @type {'NoPragmaFoundError'}
	 */
	_tag = 'NoPragmaFoundError'
	/**
	 * @type {'NoPragmaFoundError'}
	 * @override
	 */
	name = 'NoPragmaFoundError'
}

/**
 * Updates the pragma statement in a Solidity file to the specified version.
 * @param {string} solidityCode The Solidity code to update.
 * @returns {import("effect/Effect").Effect<never, NoPragmaFoundError, string>} The updated Solidity code.
 */
export const updatePragma = (solidityCode) => {
	const pragmaPattern =
		/pragma\s+solidity\s+((\^|~|>|>=|<|<=)?(\d+\.\d+\.\d+);)/
	const match = solidityCode.match(pragmaPattern)
	if (!match || !match[3]) {
		return fail(new NoPragmaFoundError('No valid pragma statement found.'))
	}
	const newPragma = `pragma solidity >=${match[3]};`
	return succeed(solidityCode.replace(pragmaPattern, newPragma))
}
