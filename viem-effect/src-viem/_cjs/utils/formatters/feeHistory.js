"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatFeeHistory = void 0;
function formatFeeHistory(feeHistory) {
    return {
        baseFeePerGas: feeHistory.baseFeePerGas.map((value) => BigInt(value)),
        gasUsedRatio: feeHistory.gasUsedRatio,
        oldestBlock: BigInt(feeHistory.oldestBlock),
        reward: feeHistory.reward?.map((reward) => reward.map((value) => BigInt(value))),
    };
}
exports.formatFeeHistory = formatFeeHistory;
//# sourceMappingURL=feeHistory.js.map