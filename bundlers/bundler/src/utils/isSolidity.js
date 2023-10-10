import { filter, parseEither, string } from "@effect/schema/Schema"
import { formatErrors } from "@effect/schema/TreeFormatter"
import { mapError } from "effect/Effect"

export class InvalidSolidityFileError extends TypeError {
	/**
	 * @override
	 */
	name = InvalidSolidityFileError.name
	_tag = InvalidSolidityFileError.name
	/**
	 * @param {Object} options - The options for the error.
	 * @param {unknown} options.value - The invalid value.
	 * @param {import('effect/ReadonlyArray').NonEmptyReadonlyArray<import('@effect/schema/ParseResult').ParseErrors>} [options.cause] - The cause 
of the error.
	 * @param {string} [options.message] - The error message.
	 * @param {string} [options.docs] - The documentation URL.
	 */
	constructor({
		value,
		cause,
		message = `Provided value ${value} is not a valid Address`,
		docs = 'https://evmts.dev/reference/errors',
	}) {
		super(`${InvalidSolidityFileError.name}: ${message}\n${docs}`)
		this.cause = cause && formatErrors(cause)
	}
}
/**
 * Util to determine if a file path is a solidity file
 * @param {string} fileName
 * @returns {boolean}
 */
export const isSolidity = (fileName) =>
	fileName.endsWith('.sol') &&
	!fileName.endsWith('/.sol') &&
	fileName !== '.sol'

/**
 * Schema to validate a solidity file
 */
export const sSolidityFilePath = string.pipe(
	filter(isSolidity, {
		message: () => 'Expected a solidity file path that ended in .sol'
	}),
)

/**
 * Parses a solidityFile into an Effect
 * @param {string} solidityFile
 * @returns {import("effect/Effect").Effect<never, InvalidSolidityFileError, string>}
 */
export const parseSolidityFile = (solidityFile) => {
	const parsedFile = parseEither(sSolidityFilePath)(solidityFile)
	return mapError(parsedFile, ({ errors }) => new InvalidSolidityFileError({
		value: solidityFile,
		cause: errors,
	}))
}
