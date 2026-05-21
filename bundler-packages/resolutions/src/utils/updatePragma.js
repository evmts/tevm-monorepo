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
 * Validates that a Solidity file has a pragma without changing its version constraints.
 * @param {string} solidityCode The Solidity code to update.
 * @param {string} [version] Unused legacy override.
 * @returns {import("effect/Effect").Effect<string, NoPragmaFoundError, never>} The Solidity code.
 */
export const updatePragma = (solidityCode, version) => {
	void version
	let match = solidityCode.match(pragmaPattern)
	if (match?.[3]) {
		return succeed(solidityCode)
	}
	match = solidityCode.match(pragmaPatternWithBounds)
	if (match?.[1]) {
		return succeed(solidityCode)
	}
	return fail(new NoPragmaFoundError('No valid pragma statement found.'))
}
