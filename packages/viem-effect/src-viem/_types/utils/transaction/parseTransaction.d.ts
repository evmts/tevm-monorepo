import type { Hex } from '../../types/misc.js'
import type {
	AccessList,
	TransactionSerializableEIP1559,
	TransactionSerializableEIP2930,
	TransactionSerializableLegacy,
	TransactionSerialized,
	TransactionType,
} from '../../types/transaction.js'
import type { RecursiveArray } from '../encoding/toRlp.js'
import { type GetSerializedTransactionType } from './getSerializedTransactionType.js'
export type ParseTransactionReturnType<
	TSerialized extends TransactionSerialized = TransactionSerialized,
	TType extends TransactionType = GetSerializedTransactionType<TSerialized>,
> =
	| (TType extends 'eip1559' ? TransactionSerializableEIP1559 : never)
	| (TType extends 'eip2930' ? TransactionSerializableEIP2930 : never)
	| (TType extends 'legacy' ? TransactionSerializableLegacy : never)
export declare function parseTransaction<
	TSerialized extends TransactionSerialized,
>(serializedTransaction: TSerialized): ParseTransactionReturnType<TSerialized>
export declare function toTransactionArray(
	serializedTransaction: string,
): RecursiveArray<`0x${string}`>
export declare function parseAccessList(
	accessList_: RecursiveArray<Hex>,
): AccessList
//# sourceMappingURL=parseTransaction.d.ts.map
