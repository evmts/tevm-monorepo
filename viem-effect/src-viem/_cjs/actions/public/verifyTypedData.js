"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyTypedData = void 0;
const hashTypedData_js_1 = require("../../utils/signature/hashTypedData.js");
const verifyHash_js_1 = require("./verifyHash.js");
async function verifyTypedData(client, { address, signature, message, primaryType, types, domain, ...callRequest }) {
    const hash = (0, hashTypedData_js_1.hashTypedData)({ message, primaryType, types, domain });
    return (0, verifyHash_js_1.verifyHash)(client, {
        address,
        hash,
        signature,
        ...callRequest,
    });
}
exports.verifyTypedData = verifyTypedData;
//# sourceMappingURL=verifyTypedData.js.map