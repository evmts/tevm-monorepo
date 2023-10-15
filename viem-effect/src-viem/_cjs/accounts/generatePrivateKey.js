"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePrivateKey = void 0;
const secp256k1_1 = require("@noble/curves/secp256k1");
const toHex_js_1 = require("../utils/encoding/toHex.js");
function generatePrivateKey() {
    return (0, toHex_js_1.toHex)(secp256k1_1.secp256k1.utils.randomPrivateKey());
}
exports.generatePrivateKey = generatePrivateKey;
//# sourceMappingURL=generatePrivateKey.js.map