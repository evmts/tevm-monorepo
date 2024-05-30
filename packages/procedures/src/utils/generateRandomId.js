/**
 * @returns {import("@tevm/utils").Hex}
 */
export const generateRandomId = () => {
	return `0x${Array.from(crypto.getRandomValues(new Uint8Array(16)))
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('')}`
}
