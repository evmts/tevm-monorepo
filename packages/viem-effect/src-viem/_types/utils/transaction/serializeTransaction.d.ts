import type { Signature } from '../../types/misc.js'
import type {
	TransactionSerializable,
	TransactionSerialized,
	TransactionType,
} from '../../types/transaction.js'
import { type GetTransactionType } from './getTransactionType.js'
export type SerializedTransactionReturnType<
	TTransactionSerializable extends TransactionSerializable = TransactionSerializable,
	TTransactionType extends TransactionType = GetTransactionType<TTransactionSerializable>,
> = TransactionSerialized<TTransactionType>
export type SerializeTransactionFn<
	TTransactionSerializable extends TransactionSerializable = TransactionSerializable,
> = typeof serializeTransaction<TTransactionSerializable>
export declare function serializeTransaction<
	TTransactionSerializable extends TransactionSerializable,
>(
	transaction: TTransactionSerializable,
	signature?: Signature,
): SerializedTransactionReturnType<TTransactionSerializable>
//# sourceMappingURL=serializeTransaction.d.ts.map
