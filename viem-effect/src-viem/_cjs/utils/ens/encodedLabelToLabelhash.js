"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodedLabelToLabelhash = void 0;
const isHex_js_1 = require("../data/isHex.js");
function encodedLabelToLabelhash(label) {
    if (label.length !== 66)
        return null;
    if (label.indexOf('[') !== 0)
        return null;
    if (label.indexOf(']') !== 65)
        return null;
    const hash = `0x${label.slice(1, 65)}`;
    if (!(0, isHex_js_1.isHex)(hash))
        return null;
    return hash;
}
exports.encodedLabelToLabelhash = encodedLabelToLabelhash;
//# sourceMappingURL=encodedLabelToLabelhash.js.map