/**
 * @template {string} T
 * @param {T} name
 * @param {string} message
 * @param {string} [input]
 */
export const createError = (name, message, input) => ({
	name,
	_tag: name,
	message: `${name}: ${message}`,
	...(input === undefined ? {} : { input }),
})
