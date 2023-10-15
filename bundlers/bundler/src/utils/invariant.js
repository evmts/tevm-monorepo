/**
 * Asserts an invariant in a typesafe way
 * @param {boolean} condition - The condition to assert
 * @param {string} message - The message to display if the condition is false
 * @throws {Error} Throws an error if the condition is false
 */
export function invariant(condition, message) {
	if (!condition) {
		throw new Error(message)
	}
}
