"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineBlock = exports.formatBlock = void 0;
const formatter_js_1 = require("./formatter.js");
const transaction_js_1 = require("./transaction.js");
function formatBlock(block) {
    const transactions = block.transactions?.map((transaction) => {
        if (typeof transaction === 'string')
            return transaction;
        return (0, transaction_js_1.formatTransaction)(transaction);
    });
    return {
        ...block,
        baseFeePerGas: block.baseFeePerGas ? BigInt(block.baseFeePerGas) : null,
        difficulty: block.difficulty ? BigInt(block.difficulty) : undefined,
        gasLimit: block.gasLimit ? BigInt(block.gasLimit) : undefined,
        gasUsed: block.gasUsed ? BigInt(block.gasUsed) : undefined,
        hash: block.hash ? block.hash : null,
        logsBloom: block.logsBloom ? block.logsBloom : null,
        nonce: block.nonce ? block.nonce : null,
        number: block.number ? BigInt(block.number) : null,
        size: block.size ? BigInt(block.size) : undefined,
        timestamp: block.timestamp ? BigInt(block.timestamp) : undefined,
        transactions,
        totalDifficulty: block.totalDifficulty
            ? BigInt(block.totalDifficulty)
            : null,
    };
}
exports.formatBlock = formatBlock;
exports.defineBlock = (0, formatter_js_1.defineFormatter)('block', formatBlock);
//# sourceMappingURL=block.js.map