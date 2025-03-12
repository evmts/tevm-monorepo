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
 * @param {string} [version] Optional version to update to. If not provided, uses the version in the file.
 * @returns {import("effect/Effect").Effect<string, NoPragmaFoundError, never>} The updated Solidity code.
 */
export const updatePragma = (solidityCode, version) => {
	let match = solidityCode.match(pragmaPattern)
	if (match?.[3]) {
		const versionToUse = version || match[3]
		const newPragma = `pragma solidity >=${versionToUse};`
		return succeed(solidityCode.replace(pragmaPattern, newPragma))
	}
	match = solidityCode.match(pragmaPatternWithBounds)
	if (match?.[1]) {
		const versionToUse = version ? `>=${version}` : match[1]
		const newPragma = `pragma solidity ${versionToUse};`
		return succeed(solidityCode.replace(pragmaPatternWithBounds, newPragma))
	}
	return fail(new NoPragmaFoundError('No valid pragma statement found.'))
}
