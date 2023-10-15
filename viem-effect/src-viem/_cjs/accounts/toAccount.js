"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toAccount = void 0;
const address_js_1 = require("../errors/address.js");
const isAddress_js_1 = require("../utils/address/isAddress.js");
function toAccount(source) {
    if (typeof source === 'string') {
        if (!(0, isAddress_js_1.isAddress)(source))
            throw new address_js_1.InvalidAddressError({ address: source });
        return {
            address: source,
            type: 'json-rpc',
        };
    }
    if (!(0, isAddress_js_1.isAddress)(source.address))
        throw new address_js_1.InvalidAddressError({ address: source.address });
    return {
        address: source.address,
        signMessage: source.signMessage,
        signTransaction: source.signTransaction,
        signTypedData: source.signTypedData,
        source: 'custom',
        type: 'local',
    };
}
exports.toAccount = toAccount;
//# sourceMappingURL=toAccount.js.map