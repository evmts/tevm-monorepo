import type { GetSerializedTransactionType } from '../../utils/transaction/getSerializedTransactionType.js';
import { type ParseTransactionReturnType } from '../../utils/transaction/parseTransaction.js';
import type { CeloTransactionSerialized, CeloTransactionType, TransactionSerializableCIP42, TransactionSerializedCIP42 } from './types.js';
export type ParseTransactionCeloReturnType<TSerialized extends CeloTransactionSerialized = CeloTransactionSerialized, TType extends CeloTransactionType = GetSerializedTransactionType<TSerialized>> = TSerialized extends TransactionSerializedCIP42 ? TransactionSerializableCIP42 : ParseTransactionReturnType<TSerialized, TType>;
export declare function parseTransactionCelo<TSerialized extends CeloTransactionSerialized>(serializedTransaction: TSerialized): ParseTransactionCeloReturnType<TSerialized>;
//# sourceMappingURL=parsers.d.ts.map