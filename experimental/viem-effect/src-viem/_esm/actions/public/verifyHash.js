import { universalSignatureValidatorAbi } from '../../constants/abis.js'
import { universalSignatureValidatorByteCode } from '../../constants/contracts.js'
import { CallExecutionError } from '../../errors/contract.js'
import { isBytesEqual } from '../../utils/data/isBytesEqual.js'
import { encodeDeployData, isHex, toHex } from '../../utils/index.js'
import { call } from './call.js'
/**
 * Verifies a message hash on chain using ERC-6492.
 *
 * @param client - Client to use.
 * @param parameters - {@link VerifyHashParameters}
 * @returns Whether or not the signature is valid. {@link VerifyHashReturnType}
 */
export async function verifyHash(
	client,
	{ address, hash, signature, ...callRequest },
) {
	const signatureHex = isHex(signature) ? signature : toHex(signature)
	try {
		const { data } = await call(client, {
			data: encodeDeployData({
				abi: universalSignatureValidatorAbi,
				args: [address, hash, signatureHex],
				bytecode: universalSignatureValidatorByteCode,
			}),
			...callRequest,
		})
		return isBytesEqual(data ?? '0x0', '0x1')
	} catch (error) {
		if (error instanceof CallExecutionError) {
			// if the execution fails, the signature was not valid and an internal method inside of the validator reverted
			// this can happen for many reasons, for example if signer can not be recovered from the signature
			// or if the signature has no valid format
			return false
		}
		throw error
	}
}
//# sourceMappingURL=verifyHash.js.map
