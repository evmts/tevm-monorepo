import { type SerializeTransactionFn } from '../../utils/transaction/serializeTransaction.js'
import type {
	CeloTransactionSerializable,
	TransactionSerializableCIP42,
	TransactionSerializedCIP42,
} from './types.js'
export declare const serializeTransactionCelo: SerializeTransactionFn<CeloTransactionSerializable>
export declare const serializersCelo: {
	readonly transaction: SerializeTransactionFn<CeloTransactionSerializable>
}
export type SerializeTransactionCIP42ReturnType = TransactionSerializedCIP42
export declare function assertTransactionCIP42(
	transaction: TransactionSerializableCIP42,
): void
//# sourceMappingURL=serializers.d.ts.map
