"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sign = void 0;
const secp256k1_1 = require("@noble/curves/secp256k1");
const toHex_js_1 = require("../../utils/encoding/toHex.js");
async function sign({ hash, privateKey, }) {
    const { r, s, recovery } = secp256k1_1.secp256k1.sign(hash.slice(2), privateKey.slice(2));
    return {
        r: (0, toHex_js_1.toHex)(r),
        s: (0, toHex_js_1.toHex)(s),
        v: recovery ? 28n : 27n,
    };
}
exports.sign = sign;
//# sourceMappingURL=sign.js.map