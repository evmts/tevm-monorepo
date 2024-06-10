/**
 * @template {string} T
 * @param {T} name
 * @param {string} message
 * @param {string} [input]
 */
export const createError = (name, message, input) => ({
	code: -32700,
	name,
	_tag: name,
	message: `${name}: ${message}`,
	...(input === undefined ? {} : { input }),
})
