"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recoverPublicKey = void 0;
const isHex_js_1 = require("../data/isHex.js");
const fromHex_js_1 = require("../encoding/fromHex.js");
const toHex_js_1 = require("../encoding/toHex.js");
async function recoverPublicKey({ hash, signature, }) {
    const signatureHex = (0, isHex_js_1.isHex)(signature) ? signature : (0, toHex_js_1.toHex)(signature);
    const hashHex = (0, isHex_js_1.isHex)(hash) ? hash : (0, toHex_js_1.toHex)(hash);
    let v = (0, fromHex_js_1.hexToNumber)(`0x${signatureHex.slice(130)}`);
    if (v === 0 || v === 1)
        v += 27;
    const { secp256k1 } = await Promise.resolve().then(() => require('@noble/curves/secp256k1'));
    const publicKey = secp256k1.Signature.fromCompact(signatureHex.substring(2, 130))
        .addRecoveryBit(v - 27)
        .recoverPublicKey(hashHex.substring(2))
        .toHex(false);
    return `0x${publicKey}`;
}
exports.recoverPublicKey = recoverPublicKey;
//# sourceMappingURL=recoverPublicKey.js.map