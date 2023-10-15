"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signMessage = void 0;
const hashMessage_js_1 = require("../../utils/signature/hashMessage.js");
const signatureToHex_js_1 = require("../../utils/signature/signatureToHex.js");
const sign_js_1 = require("./sign.js");
async function signMessage({ message, privateKey, }) {
    const signature = await (0, sign_js_1.sign)({ hash: (0, hashMessage_js_1.hashMessage)(message), privateKey });
    return (0, signatureToHex_js_1.signatureToHex)(signature);
}
exports.signMessage = signMessage;
//# sourceMappingURL=signMessage.js.map