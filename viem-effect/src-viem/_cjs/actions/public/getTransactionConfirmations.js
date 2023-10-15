"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactionConfirmations = void 0;
const getBlockNumber_js_1 = require("./getBlockNumber.js");
const getTransaction_js_1 = require("./getTransaction.js");
async function getTransactionConfirmations(client, { hash, transactionReceipt }) {
    const [blockNumber, transaction] = await Promise.all([
        (0, getBlockNumber_js_1.getBlockNumber)(client),
        hash ? (0, getTransaction_js_1.getTransaction)(client, { hash }) : undefined,
    ]);
    const transactionBlockNumber = transactionReceipt?.blockNumber || transaction?.blockNumber;
    if (!transactionBlockNumber)
        return 0n;
    return blockNumber - transactionBlockNumber + 1n;
}
exports.getTransactionConfirmations = getTransactionConfirmations;
//# sourceMappingURL=getTransactionConfirmations.js.map