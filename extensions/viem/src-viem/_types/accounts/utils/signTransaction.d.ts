import type { Hex } from '../../types/misc.js'
import type {
	TransactionSerializable,
	TransactionSerialized,
} from '../../types/transaction.js'
import type { GetTransactionType } from '../../utils/transaction/getTransactionType.js'
import { type SerializeTransactionFn } from '../../utils/transaction/serializeTransaction.js'
export type SignTransactionParameters<
	TTransactionSerializable extends TransactionSerializable = TransactionSerializable,
> = {
	privateKey: Hex
	transaction: TTransactionSerializable
	serializer?: SerializeTransactionFn<
		TransactionSerializable & TTransactionSerializable
	>
}
export type SignTransactionReturnType<
	TTransactionSerializable extends TransactionSerializable = TransactionSerializable,
> = TransactionSerialized<GetTransactionType<TTransactionSerializable>>
export declare function signTransaction<
	TTransactionSerializable extends TransactionSerializable,
>({
	privateKey,
	transaction,
	serializer,
}: SignTransactionParameters<TTransactionSerializable>): Promise<
	SignTransactionReturnType<TTransactionSerializable>
>
//# sourceMappingURL=signTransaction.d.ts.map
