import { InvalidSerializableTransactionError } from '../../errors/transaction.js';
export function getTransactionType(transaction) {
    if (transaction.type)
        return transaction.type;
    if (typeof transaction.maxFeePerGas !== 'undefined' ||
        typeof transaction.maxPriorityFeePerGas !== 'undefined')
        return 'eip1559';
    if (typeof transaction.gasPrice !== 'undefined') {
        if (typeof transaction.accessList !== 'undefined')
            return 'eip2930';
        return 'legacy';
    }
    throw new InvalidSerializableTransactionError({ transaction });
}
//# sourceMappingURL=getTransactionType.js.map