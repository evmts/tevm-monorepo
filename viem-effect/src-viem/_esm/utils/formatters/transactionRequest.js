import { numberToHex } from '../encoding/toHex.js';
import { defineFormatter } from './formatter.js';
export const rpcTransactionType = {
    legacy: '0x0',
    eip2930: '0x1',
    eip1559: '0x2',
};
export function formatTransactionRequest(transactionRequest) {
    return {
        ...transactionRequest,
        gas: typeof transactionRequest.gas !== 'undefined'
            ? numberToHex(transactionRequest.gas)
            : undefined,
        gasPrice: typeof transactionRequest.gasPrice !== 'undefined'
            ? numberToHex(transactionRequest.gasPrice)
            : undefined,
        maxFeePerGas: typeof transactionRequest.maxFeePerGas !== 'undefined'
            ? numberToHex(transactionRequest.maxFeePerGas)
            : undefined,
        maxPriorityFeePerGas: typeof transactionRequest.maxPriorityFeePerGas !== 'undefined'
            ? numberToHex(transactionRequest.maxPriorityFeePerGas)
            : undefined,
        nonce: typeof transactionRequest.nonce !== 'undefined'
            ? numberToHex(transactionRequest.nonce)
            : undefined,
        type: typeof transactionRequest.type !== 'undefined'
            ? rpcTransactionType[transactionRequest.type]
            : undefined,
        value: typeof transactionRequest.value !== 'undefined'
            ? numberToHex(transactionRequest.value)
            : undefined,
    };
}
export const defineTransactionRequest = /*#__PURE__*/ defineFormatter('transactionRequest', formatTransactionRequest);
//# sourceMappingURL=transactionRequest.js.map