"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bytesToString = exports.bytesToNumber = exports.bytesToBool = exports.bytesToBigint = exports.fromBytes = void 0;
const encoding_js_1 = require("../../errors/encoding.js");
const trim_js_1 = require("../data/trim.js");
const fromHex_js_1 = require("./fromHex.js");
const toHex_js_1 = require("./toHex.js");
function fromBytes(bytes, toOrOpts) {
    const opts = typeof toOrOpts === 'string' ? { to: toOrOpts } : toOrOpts;
    const to = opts.to;
    if (to === 'number')
        return bytesToNumber(bytes, opts);
    if (to === 'bigint')
        return bytesToBigint(bytes, opts);
    if (to === 'boolean')
        return bytesToBool(bytes, opts);
    if (to === 'string')
        return bytesToString(bytes, opts);
    return (0, toHex_js_1.bytesToHex)(bytes, opts);
}
exports.fromBytes = fromBytes;
function bytesToBigint(bytes, opts = {}) {
    if (typeof opts.size !== 'undefined')
        (0, fromHex_js_1.assertSize)(bytes, { size: opts.size });
    const hex = (0, toHex_js_1.bytesToHex)(bytes, opts);
    return (0, fromHex_js_1.hexToBigInt)(hex);
}
exports.bytesToBigint = bytesToBigint;
function bytesToBool(bytes_, opts = {}) {
    let bytes = bytes_;
    if (typeof opts.size !== 'undefined') {
        (0, fromHex_js_1.assertSize)(bytes, { size: opts.size });
        bytes = (0, trim_js_1.trim)(bytes);
    }
    if (bytes.length > 1 || bytes[0] > 1)
        throw new encoding_js_1.InvalidBytesBooleanError(bytes);
    return Boolean(bytes[0]);
}
exports.bytesToBool = bytesToBool;
function bytesToNumber(bytes, opts = {}) {
    if (typeof opts.size !== 'undefined')
        (0, fromHex_js_1.assertSize)(bytes, { size: opts.size });
    const hex = (0, toHex_js_1.bytesToHex)(bytes, opts);
    return (0, fromHex_js_1.hexToNumber)(hex);
}
exports.bytesToNumber = bytesToNumber;
function bytesToString(bytes_, opts = {}) {
    let bytes = bytes_;
    if (typeof opts.size !== 'undefined') {
        (0, fromHex_js_1.assertSize)(bytes, { size: opts.size });
        bytes = (0, trim_js_1.trim)(bytes, { dir: 'right' });
    }
    return new TextDecoder().decode(bytes);
}
exports.bytesToString = bytesToString;
//# sourceMappingURL=fromBytes.js.map