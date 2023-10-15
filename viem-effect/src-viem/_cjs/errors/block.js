"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockNotFoundError = void 0;
const base_js_1 = require("./base.js");
class BlockNotFoundError extends base_js_1.BaseError {
    constructor({ blockHash, blockNumber, }) {
        let identifier = 'Block';
        if (blockHash)
            identifier = `Block at hash "${blockHash}"`;
        if (blockNumber)
            identifier = `Block at number "${blockNumber}"`;
        super(`${identifier} could not be found.`);
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'BlockNotFoundError'
        });
    }
}
exports.BlockNotFoundError = BlockNotFoundError;
//# sourceMappingURL=block.js.map