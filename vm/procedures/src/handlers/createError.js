/**
 * Creates a typed Error
 * @template {string} T
 * @param {T} name
 * @param {string} message
 * @param {string} input
 */
export const createError = (name, message, input) => ({
	name,
	_tag: name,
	input,
	message: `${name}: ${message}`,
})
