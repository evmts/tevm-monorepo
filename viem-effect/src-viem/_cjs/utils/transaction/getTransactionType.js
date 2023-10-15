"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactionType = void 0;
const transaction_js_1 = require("../../errors/transaction.js");
function getTransactionType(transaction) {
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
    throw new transaction_js_1.InvalidSerializableTransactionError({ transaction });
}
exports.getTransactionType = getTransactionType;
//# sourceMappingURL=getTransactionType.js.map