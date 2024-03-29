import { toHex } from '../utils/encoding/toHex.js'
import { secp256k1 } from '@noble/curves/secp256k1'
/**
 * @description Generates a random private key.
 *
 * @returns A randomly generated private key.
 */
export function generatePrivateKey() {
	return toHex(secp256k1.utils.randomPrivateKey())
}
//# sourceMappingURL=generatePrivateKey.js.map
