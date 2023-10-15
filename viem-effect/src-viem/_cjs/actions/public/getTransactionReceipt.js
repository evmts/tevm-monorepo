"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactionReceipt = void 0;
const transaction_js_1 = require("../../errors/transaction.js");
const transactionReceipt_js_1 = require("../../utils/formatters/transactionReceipt.js");
async function getTransactionReceipt(client, { hash }) {
    const receipt = await client.request({
        method: 'eth_getTransactionReceipt',
        params: [hash],
    });
    if (!receipt)
        throw new transaction_js_1.TransactionReceiptNotFoundError({ hash });
    const format = client.chain?.formatters?.transactionReceipt?.format ||
        transactionReceipt_js_1.formatTransactionReceipt;
    return format(receipt);
}
exports.getTransactionReceipt = getTransactionReceipt;
//# sourceMappingURL=getTransactionReceipt.js.map