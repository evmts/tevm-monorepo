import type { Account } from '../accounts/types.js';
import type { SendTransactionParameters } from '../actions/wallet/sendTransaction.js';
import type { BlockTag } from '../types/block.js';
import type { Chain } from '../types/chain.js';
import type { Hash, Hex } from '../types/misc.js';
import type { TransactionType } from '../types/transaction.js';
import { BaseError } from './base.js';
export declare function prettyPrint(args: Record<string, bigint | number | string | undefined | false | unknown>): string;
export declare class FeeConflictError extends BaseError {
    name: string;
    constructor();
}
export declare class InvalidLegacyVError extends BaseError {
    name: string;
    constructor({ v }: {
        v: bigint;
    });
}
export declare class InvalidSerializableTransactionError extends BaseError {
    name: string;
    constructor({ transaction }: {
        transaction: Record<string, unknown>;
    });
}
export declare class InvalidSerializedTransactionTypeError extends BaseError {
    name: string;
    serializedType: Hex;
    constructor({ serializedType }: {
        serializedType: Hex;
    });
}
export declare class InvalidSerializedTransactionError extends BaseError {
    name: string;
    serializedTransaction: Hex;
    type: TransactionType;
    constructor({ attributes, serializedTransaction, type, }: {
        attributes: Record<string, unknown>;
        serializedTransaction: Hex;
        type: TransactionType;
    });
}
export declare class InvalidStorageKeySizeError extends BaseError {
    name: string;
    constructor({ storageKey }: {
        storageKey: Hex;
    });
}
export declare class TransactionExecutionError extends BaseError {
    cause: BaseError;
    name: string;
    constructor(cause: BaseError, { account, docsPath, chain, data, gas, gasPrice, maxFeePerGas, maxPriorityFeePerGas, nonce, to, value, }: Omit<SendTransactionParameters, 'account' | 'chain'> & {
        account: Account;
        chain?: Chain;
        docsPath?: string;
    });
}
export declare class TransactionNotFoundError extends BaseError {
    name: string;
    constructor({ blockHash, blockNumber, blockTag, hash, index, }: {
        blockHash?: Hash;
        blockNumber?: bigint;
        blockTag?: BlockTag;
        hash?: Hash;
        index?: number;
    });
}
export declare class TransactionReceiptNotFoundError extends BaseError {
    name: string;
    constructor({ hash }: {
        hash: Hash;
    });
}
export declare class WaitForTransactionReceiptTimeoutError extends BaseError {
    name: string;
    constructor({ hash }: {
        hash: Hash;
    });
}
//# sourceMappingURL=transaction.d.ts.map