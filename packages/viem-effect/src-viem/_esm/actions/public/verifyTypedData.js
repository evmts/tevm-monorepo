import { hashTypedData } from '../../utils/signature/hashTypedData.js'
import { verifyHash } from './verifyHash.js'
/**
 * Verify that typed data was signed by the provided address.
 *
 * - Docs {@link https://viem.sh/docs/actions/public/verifyTypedData.html}
 *
 * @param client - Client to use.
 * @param parameters - {@link VerifyTypedDataParameters}
 * @returns Whether or not the signature is valid. {@link VerifyTypedDataReturnType}
 */
export async function verifyTypedData(
	client,
	{ address, signature, message, primaryType, types, domain, ...callRequest },
) {
	const hash = hashTypedData({ message, primaryType, types, domain })
	return verifyHash(client, {
		address,
		hash,
		signature,
		...callRequest,
	})
}
//# sourceMappingURL=verifyTypedData.js.map
