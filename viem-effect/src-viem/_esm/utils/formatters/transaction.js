import { hexToNumber } from '../encoding/fromHex.js';
import { defineFormatter } from './formatter.js';
export const transactionType = {
    '0x0': 'legacy',
    '0x1': 'eip2930',
    '0x2': 'eip1559',
};
export function formatTransaction(transaction) {
    const transaction_ = {
        ...transaction,
        blockHash: transaction.blockHash ? transaction.blockHash : null,
        blockNumber: transaction.blockNumber
            ? BigInt(transaction.blockNumber)
            : null,
        chainId: transaction.chainId ? hexToNumber(transaction.chainId) : undefined,
        gas: transaction.gas ? BigInt(transaction.gas) : undefined,
        gasPrice: transaction.gasPrice ? BigInt(transaction.gasPrice) : undefined,
        maxFeePerGas: transaction.maxFeePerGas
            ? BigInt(transaction.maxFeePerGas)
            : undefined,
        maxPriorityFeePerGas: transaction.maxPriorityFeePerGas
            ? BigInt(transaction.maxPriorityFeePerGas)
            : undefined,
        nonce: transaction.nonce ? hexToNumber(transaction.nonce) : undefined,
        to: transaction.to ? transaction.to : null,
        transactionIndex: transaction.transactionIndex
            ? Number(transaction.transactionIndex)
            : null,
        type: transaction.type ? transactionType[transaction.type] : undefined,
        typeHex: transaction.type ? transaction.type : undefined,
        value: transaction.value ? BigInt(transaction.value) : undefined,
        v: transaction.v ? BigInt(transaction.v) : undefined,
    };
    if (transaction_.type === 'legacy') {
        delete transaction_.accessList;
        delete transaction_.maxFeePerGas;
        delete transaction_.maxPriorityFeePerGas;
    }
    if (transaction_.type === 'eip2930') {
        delete transaction_.maxFeePerGas;
        delete transaction_.maxPriorityFeePerGas;
    }
    return transaction_;
}
export const defineTransaction = /*#__PURE__*/ defineFormatter('transaction', formatTransaction);
//# sourceMappingURL=transaction.js.map