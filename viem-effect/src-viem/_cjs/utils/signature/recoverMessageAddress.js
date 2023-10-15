"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recoverMessageAddress = void 0;
const hashMessage_js_1 = require("./hashMessage.js");
const recoverAddress_js_1 = require("./recoverAddress.js");
async function recoverMessageAddress({ message, signature, }) {
    return (0, recoverAddress_js_1.recoverAddress)({ hash: (0, hashMessage_js_1.hashMessage)(message), signature });
}
exports.recoverMessageAddress = recoverMessageAddress;
//# sourceMappingURL=recoverMessageAddress.js.map