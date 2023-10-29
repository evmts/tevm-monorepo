import { hashMessage } from '../../utils/index.js'
import { verifyHash } from './verifyHash.js'
/**
 * Verify that a message was signed by the provided address.
 *
 * Compatible with Smart Contract Accounts & Externally Owned Accounts via [ERC-6492](https://eips.ethereum.org/EIPS/eip-6492).
 *
 * - Docs {@link https://viem.sh/docs/actions/public/verifyMessage.html}
 *
 * @param client - Client to use.
 * @param parameters - {@link VerifyMessageParameters}
 * @returns Whether or not the signature is valid. {@link VerifyMessageReturnType}
 */
export async function verifyMessage(
	client,
	{ address, message, signature, ...callRequest },
) {
	const hash = hashMessage(message)
	return verifyHash(client, {
		address,
		hash,
		signature,
		...callRequest,
	})
}
//# sourceMappingURL=verifyMessage.js.map
