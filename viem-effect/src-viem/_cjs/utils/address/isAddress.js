"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAddress = void 0;
const addressRegex = /^0x[a-fA-F0-9]{40}$/;
function isAddress(address) {
    return addressRegex.test(address);
}
exports.isAddress = isAddress;
//# sourceMappingURL=isAddress.js.map