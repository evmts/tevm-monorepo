import { hashMessage } from '../../utils/signature/hashMessage.js'
import { signatureToHex } from '../../utils/signature/signatureToHex.js'
import { sign } from './sign.js'
/**
 * @description Calculates an Ethereum-specific signature in [EIP-191 format](https://eips.ethereum.org/EIPS/eip-191):
 * `keccak256("\x19Ethereum Signed Message:\n" + len(message) + message))`.
 *
 * @returns The signature.
 */
export async function signMessage({ message, privateKey }) {
	const signature = await sign({ hash: hashMessage(message), privateKey })
	return signatureToHex(signature)
}
//# sourceMappingURL=signMessage.js.map
