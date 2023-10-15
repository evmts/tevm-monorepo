"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertRequest = void 0;
const parseAccount_js_1 = require("../../accounts/utils/parseAccount.js");
const address_js_1 = require("../../errors/address.js");
const node_js_1 = require("../../errors/node.js");
const transaction_js_1 = require("../../errors/transaction.js");
const isAddress_js_1 = require("../address/isAddress.js");
function assertRequest(args) {
    const { account: account_, gasPrice, maxFeePerGas, maxPriorityFeePerGas, to, } = args;
    const account = account_ ? (0, parseAccount_js_1.parseAccount)(account_) : undefined;
    if (account && !(0, isAddress_js_1.isAddress)(account.address))
        throw new address_js_1.InvalidAddressError({ address: account.address });
    if (to && !(0, isAddress_js_1.isAddress)(to))
        throw new address_js_1.InvalidAddressError({ address: to });
    if (typeof gasPrice !== 'undefined' &&
        (typeof maxFeePerGas !== 'undefined' ||
            typeof maxPriorityFeePerGas !== 'undefined'))
        throw new transaction_js_1.FeeConflictError();
    if (maxFeePerGas && maxFeePerGas > 2n ** 256n - 1n)
        throw new node_js_1.FeeCapTooHighError({ maxFeePerGas });
    if (maxPriorityFeePerGas &&
        maxFeePerGas &&
        maxPriorityFeePerGas > maxFeePerGas)
        throw new node_js_1.TipAboveFeeCapError({ maxFeePerGas, maxPriorityFeePerGas });
}
exports.assertRequest = assertRequest;
//# sourceMappingURL=assertRequest.js.map