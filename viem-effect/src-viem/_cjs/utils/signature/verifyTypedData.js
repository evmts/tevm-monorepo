"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyTypedData = void 0;
const getAddress_js_1 = require("../address/getAddress.js");
const isAddressEqual_js_1 = require("../address/isAddressEqual.js");
const recoverTypedDataAddress_js_1 = require("./recoverTypedDataAddress.js");
async function verifyTypedData({ address, domain, message, primaryType, signature, types, }) {
    return (0, isAddressEqual_js_1.isAddressEqual)((0, getAddress_js_1.getAddress)(address), await (0, recoverTypedDataAddress_js_1.recoverTypedDataAddress)({
        domain,
        message,
        primaryType,
        signature,
        types,
    }));
}
exports.verifyTypedData = verifyTypedData;
//# sourceMappingURL=verifyTypedData.js.map