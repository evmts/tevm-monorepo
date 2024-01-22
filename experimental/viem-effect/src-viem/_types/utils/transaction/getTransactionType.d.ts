import type {
	TransactionSerializable,
	TransactionSerializableEIP1559,
	TransactionSerializableEIP2930,
	TransactionSerializableGeneric,
	TransactionSerializableLegacy,
} from '../../types/transaction.js'
export type GetTransactionType<
	TTransactionSerializable extends TransactionSerializable = TransactionSerializable,
> =
	| (TTransactionSerializable extends TransactionSerializableLegacy
			? 'legacy'
			: never)
	| (TTransactionSerializable extends TransactionSerializableEIP1559
			? 'eip1559'
			: never)
	| (TTransactionSerializable extends TransactionSerializableEIP2930
			? 'eip2930'
			: never)
	| (TTransactionSerializable extends TransactionSerializableGeneric
			? TTransactionSerializable['type']
			: never)
export declare function getTransactionType<
	TTransactionSerializable extends TransactionSerializable,
>(
	transaction: TTransactionSerializable,
): GetTransactionType<TTransactionSerializable>
//# sourceMappingURL=getTransactionType.d.ts.map
