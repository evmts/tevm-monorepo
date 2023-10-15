"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMnemonic = void 0;
const bip39_1 = require("@scure/bip39");
function generateMnemonic(wordlist) {
    return (0, bip39_1.generateMnemonic)(wordlist);
}
exports.generateMnemonic = generateMnemonic;
//# sourceMappingURL=generateMnemonic.js.map