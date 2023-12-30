import { toHex } from '../utils/encoding/toHex.js'
import { toAccount } from './toAccount.js'
import { publicKeyToAddress } from './utils/publicKeyToAddress.js'
import { signMessage } from './utils/signMessage.js'
import { signTransaction } from './utils/signTransaction.js'
import { signTypedData } from './utils/signTypedData.js'
import { secp256k1 } from '@noble/curves/secp256k1'
/**
 * @description Creates an Account from a private key.
 *
 * @returns A Private Key Account.
 */
export function privateKeyToAccount(privateKey) {
	const publicKey = toHex(secp256k1.getPublicKey(privateKey.slice(2), false))
	const address = publicKeyToAddress(publicKey)
	const account = toAccount({
		address,
		async signMessage({ message }) {
			return signMessage({ message, privateKey })
		},
		async signTransaction(transaction, { serializer } = {}) {
			return signTransaction({ privateKey, transaction, serializer })
		},
		async signTypedData(typedData) {
			return signTypedData({ ...typedData, privateKey })
		},
	})
	return {
		...account,
		publicKey,
		source: 'privateKey',
	}
}
//# sourceMappingURL=privateKeyToAccount.js.map
