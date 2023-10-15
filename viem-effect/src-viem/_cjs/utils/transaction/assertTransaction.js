"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertTransactionLegacy = exports.assertTransactionEIP2930 = exports.assertTransactionEIP1559 = void 0;
const address_js_1 = require("../../errors/address.js");
const base_js_1 = require("../../errors/base.js");
const chain_js_1 = require("../../errors/chain.js");
const node_js_1 = require("../../errors/node.js");
const isAddress_js_1 = require("../address/isAddress.js");
function assertTransactionEIP1559(transaction) {
    const { chainId, maxPriorityFeePerGas, gasPrice, maxFeePerGas, to } = transaction;
    if (chainId <= 0)
        throw new chain_js_1.InvalidChainIdError({ chainId });
    if (to && !(0, isAddress_js_1.isAddress)(to))
        throw new address_js_1.InvalidAddressError({ address: to });
    if (gasPrice)
        throw new base_js_1.BaseError('`gasPrice` is not a valid EIP-1559 Transaction attribute.');
    if (maxFeePerGas && maxFeePerGas > 2n ** 256n - 1n)
        throw new node_js_1.FeeCapTooHighError({ maxFeePerGas });
    if (maxPriorityFeePerGas &&
        maxFeePerGas &&
        maxPriorityFeePerGas > maxFeePerGas)
        throw new node_js_1.TipAboveFeeCapError({ maxFeePerGas, maxPriorityFeePerGas });
}
exports.assertTransactionEIP1559 = assertTransactionEIP1559;
function assertTransactionEIP2930(transaction) {
    const { chainId, maxPriorityFeePerGas, gasPrice, maxFeePerGas, to } = transaction;
    if (chainId <= 0)
        throw new chain_js_1.InvalidChainIdError({ chainId });
    if (to && !(0, isAddress_js_1.isAddress)(to))
        throw new address_js_1.InvalidAddressError({ address: to });
    if (maxPriorityFeePerGas || maxFeePerGas)
        throw new base_js_1.BaseError('`maxFeePerGas`/`maxPriorityFeePerGas` is not a valid EIP-2930 Transaction attribute.');
    if (gasPrice && gasPrice > 2n ** 256n - 1n)
        throw new node_js_1.FeeCapTooHighError({ maxFeePerGas: gasPrice });
}
exports.assertTransactionEIP2930 = assertTransactionEIP2930;
function assertTransactionLegacy(transaction) {
    const { chainId, maxPriorityFeePerGas, gasPrice, maxFeePerGas, to, accessList, } = transaction;
    if (to && !(0, isAddress_js_1.isAddress)(to))
        throw new address_js_1.InvalidAddressError({ address: to });
    if (typeof chainId !== 'undefined' && chainId <= 0)
        throw new chain_js_1.InvalidChainIdError({ chainId });
    if (maxPriorityFeePerGas || maxFeePerGas)
        throw new base_js_1.BaseError('`maxFeePerGas`/`maxPriorityFeePerGas` is not a valid Legacy Transaction attribute.');
    if (gasPrice && gasPrice > 2n ** 256n - 1n)
        throw new node_js_1.FeeCapTooHighError({ maxFeePerGas: gasPrice });
    if (accessList)
        throw new base_js_1.BaseError('`accessList` is not a valid Legacy Transaction attribute.');
}
exports.assertTransactionLegacy = assertTransactionLegacy;
//# sourceMappingURL=assertTransaction.js.map