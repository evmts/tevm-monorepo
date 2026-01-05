/**
 * Generates cryptographically secure random bytes.
 *
 * Uses Web Crypto API in browser/Deno/Bun, or Node.js crypto module in Node.js.
 *
 * @param {number} length - The number of random bytes to generate
 * @returns {Uint8Array} A Uint8Array of cryptographically secure random bytes
 * @throws {Error} If length is not a positive integer
 * @throws {Error} If the environment doesn't support cryptographic random bytes
 *
 * @example
 * ```javascript
 * import { randomBytes } from '@tevm/utils'
 *
 * // Generate 32 random bytes (common for private keys)
 * const privateKey = randomBytes(32)
 * console.log(privateKey.length) // 32
 *
 * // Generate 16 random bytes
 * const bytes = randomBytes(16)
 * console.log(bytes instanceof Uint8Array) // true
 * ```
 */
export const randomBytes = (length) => {
	if (typeof length !== 'number' || length < 0 || !Number.isInteger(length)) {
		throw new Error('randomBytes: length must be a non-negative integer')
	}

	// Try Web Crypto API first (works in browsers, Deno, Bun, and modern Node.js)
	if (typeof globalThis !== 'undefined' && globalThis.crypto && typeof globalThis.crypto.getRandomValues === 'function') {
		return globalThis.crypto.getRandomValues(new Uint8Array(length))
	}

	// Fallback for Node.js environments without Web Crypto API
	try {
		// Dynamic import to avoid bundler issues
		const nodeCrypto = require('crypto')
		if (nodeCrypto && typeof nodeCrypto.randomBytes === 'function') {
			return new Uint8Array(nodeCrypto.randomBytes(length))
		}
	} catch {
		// Node.js crypto not available
	}

	throw new Error("randomBytes: The environment doesn't support cryptographic random bytes generation")
}
