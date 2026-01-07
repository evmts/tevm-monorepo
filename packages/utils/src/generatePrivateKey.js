import { randomBytes } from './randomBytes.js'
import { bytesToHex } from './viem.js'

/**
 * Generates a cryptographically secure random private key.
 *
 * Uses Web Crypto API for secure random bytes and returns a hex-encoded 32-byte private key.
 * This is a native implementation that matches viem's generatePrivateKey API.
 *
 * @returns {import('./hex-types.js').Hex} A hex-encoded 32-byte private key (e.g., '0x...' with 66 total characters)
 *
 * @example
 * ```javascript
 * import { generatePrivateKey } from '@tevm/utils'
 *
 * const privateKey = generatePrivateKey()
 * console.log(privateKey) // '0x805c2dca738243c14a7e0b440ae1fb5775042ea3673643a1dead3faced740304'
 * console.log(privateKey.length) // 66 (32 bytes = 64 hex chars + '0x')
 * ```
 */
export const generatePrivateKey = () => {
	const bytes = randomBytes(32)
	return bytesToHex(bytes)
}
