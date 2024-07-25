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

const pragmaPattern = /pragma\s+solidity\s+((\^|~|>|>=|<|<=)?\s*(\d+\.\d+\.\d+)\s*);/
const pragmaPatternWithBounds = /pragma\s+solidity\s+(>=?\d+\.\d+\.\d+)\s*<\s*(\d+\.\d+\.\d+)\s*;/

/**
 * Updates the pragma statement in a Solidity file to the specified version.
 * This is a huge hack to avoid needing to dynamically download solc versions. We should fix this in future
 * @param {string} solidityCode The Solidity code to update.
 * @returns {import("effect/Effect").Effect<never, NoPragmaFoundError, string>} The updated Solidity code.
 */
export const updatePragma = (solidityCode) => {
	let match = solidityCode.match(pragmaPattern)
	if (match?.[3]) {
		const newPragma = `pragma solidity >=${match[3]};`
		return succeed(solidityCode.replace(pragmaPattern, newPragma))
	}
	match = solidityCode.match(pragmaPatternWithBounds)
	if (match?.[1]) {
		const newPragma = `pragma solidity ${match[1]};`
		return succeed(solidityCode.replace(pragmaPatternWithBounds, newPragma))
	}
	return fail(new NoPragmaFoundError('No valid pragma statement found.'))
}
