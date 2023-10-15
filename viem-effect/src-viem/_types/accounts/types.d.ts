import type { HDKey } from '@scure/bip32';
import type { Address, TypedData } from 'abitype';
import type { Hash, Hex, SignableMessage } from '../types/misc.js';
import type { TransactionSerializable, TransactionSerialized } from '../types/transaction.js';
import type { TypedDataDefinition } from '../types/typedData.js';
import type { IsNarrowable } from '../types/utils.js';
import type { GetTransactionType } from '../utils/transaction/getTransactionType.js';
import type { SerializeTransactionFn } from '../utils/transaction/serializeTransaction.js';
export type Account<TAddress extends Address = Address> = JsonRpcAccount<TAddress> | LocalAccount<string, TAddress>;
export type AccountSource = Address | CustomSource;
export type CustomSource = {
    address: Address;
    signMessage: ({ message }: {
        message: SignableMessage;
    }) => Promise<Hash>;
    signTransaction: <TTransactionSerializable extends TransactionSerializable>(transaction: TTransactionSerializable, args?: {
        serializer?: SerializeTransactionFn<TTransactionSerializable>;
    }) => Promise<IsNarrowable<TransactionSerialized<GetTransactionType<TTransactionSerializable>>, Hash> extends true ? TransactionSerialized<GetTransactionType<TTransactionSerializable>> : Hash>;
    signTypedData: <const TTypedData extends TypedData | {
        [key: string]: unknown;
    }, TPrimaryType extends string = string>(typedData: TypedDataDefinition<TTypedData, TPrimaryType>) => Promise<Hash>;
};
export type JsonRpcAccount<TAddress extends Address = Address> = {
    address: TAddress;
    type: 'json-rpc';
};
export type LocalAccount<TSource extends string = 'custom', TAddress extends Address = Address> = CustomSource & {
    address: TAddress;
    publicKey: Hex;
    source: TSource;
    type: 'local';
};
export type HDAccount = LocalAccount<'hd'> & {
    getHdKey(): HDKey;
};
export type HDOptions = {
    /** The account index to use in the path (`"m/44'/60'/${accountIndex}'/0/0"`). */
    accountIndex?: number;
    /** The address index to use in the path (`"m/44'/60'/0'/0/${addressIndex}"`). */
    addressIndex?: number;
    /** The change index to use in the path (`"m/44'/60'/0'/${changeIndex}/0"`). */
    changeIndex?: number;
    path?: never;
} | {
    accountIndex?: never;
    addressIndex?: never;
    changeIndex?: never;
    /** The HD path. */
    path: `m/44'/60'/${string}`;
};
export type PrivateKeyAccount = LocalAccount<'privateKey'>;
//# sourceMappingURL=types.d.ts.map