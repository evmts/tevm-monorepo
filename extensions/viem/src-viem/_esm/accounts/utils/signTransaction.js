import { keccak256 } from '../../utils/hash/keccak256.js'
import { serializeTransaction } from '../../utils/transaction/serializeTransaction.js'
import { sign } from './sign.js'
export async function signTransaction({
	privateKey,
	transaction,
	serializer = serializeTransaction,
}) {
	const signature = await sign({
		hash: keccak256(serializer(transaction)),
		privateKey,
	})
	return serializer(transaction, signature)
}
//# sourceMappingURL=signTransaction.js.map
