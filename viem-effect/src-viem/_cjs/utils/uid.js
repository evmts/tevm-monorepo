"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uid = void 0;
const size = 256;
let index = size;
let buffer;
function uid(length = 11) {
    if (!buffer || index + length > size * 2) {
        buffer = '';
        index = 0;
        for (let i = 0; i < size; i++) {
            buffer += ((256 + Math.random() * 256) | 0).toString(16).substring(1);
        }
    }
    return buffer.substring(index, index++ + length);
}
exports.uid = uid;
//# sourceMappingURL=uid.js.map