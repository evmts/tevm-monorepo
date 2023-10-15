"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaxFeePerGasTooLowError = exports.Eip1559FeesNotSupportedError = exports.BaseFeeScalarError = void 0;
const formatGwei_js_1 = require("../utils/unit/formatGwei.js");
const base_js_1 = require("./base.js");
class BaseFeeScalarError extends base_js_1.BaseError {
    constructor() {
        super('`baseFeeMultiplier` must be greater than 1.');
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'BaseFeeScalarError'
        });
    }
}
exports.BaseFeeScalarError = BaseFeeScalarError;
class Eip1559FeesNotSupportedError extends base_js_1.BaseError {
    constructor() {
        super('Chain does not support EIP-1559 fees.');
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'Eip1559FeesNotSupportedError'
        });
    }
}
exports.Eip1559FeesNotSupportedError = Eip1559FeesNotSupportedError;
class MaxFeePerGasTooLowError extends base_js_1.BaseError {
    constructor({ maxPriorityFeePerGas }) {
        super(`\`maxFeePerGas\` cannot be less than the \`maxPriorityFeePerGas\` (${(0, formatGwei_js_1.formatGwei)(maxPriorityFeePerGas)} gwei).`);
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'MaxFeePerGasTooLowError'
        });
    }
}
exports.MaxFeePerGasTooLowError = MaxFeePerGasTooLowError;
//# sourceMappingURL=fee.js.map