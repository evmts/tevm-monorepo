"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeErrorResult = void 0;
const abi_js_1 = require("../../errors/abi.js");
const concat_js_1 = require("../data/concat.js");
const getFunctionSelector_js_1 = require("../hash/getFunctionSelector.js");
const encodeAbiParameters_js_1 = require("./encodeAbiParameters.js");
const formatAbiItem_js_1 = require("./formatAbiItem.js");
const getAbiItem_js_1 = require("./getAbiItem.js");
const docsPath = '/docs/contract/encodeErrorResult';
function encodeErrorResult({ abi, errorName, args }) {
    let abiItem = abi[0];
    if (errorName) {
        abiItem = (0, getAbiItem_js_1.getAbiItem)({
            abi,
            args,
            name: errorName,
        });
        if (!abiItem)
            throw new abi_js_1.AbiErrorNotFoundError(errorName, { docsPath });
    }
    if (abiItem.type !== 'error')
        throw new abi_js_1.AbiErrorNotFoundError(undefined, { docsPath });
    const definition = (0, formatAbiItem_js_1.formatAbiItem)(abiItem);
    const signature = (0, getFunctionSelector_js_1.getFunctionSelector)(definition);
    let data = '0x';
    if (args && args.length > 0) {
        if (!abiItem.inputs)
            throw new abi_js_1.AbiErrorInputsNotFoundError(abiItem.name, { docsPath });
        data = (0, encodeAbiParameters_js_1.encodeAbiParameters)(abiItem.inputs, args);
    }
    return (0, concat_js_1.concatHex)([signature, data]);
}
exports.encodeErrorResult = encodeErrorResult;
//# sourceMappingURL=encodeErrorResult.js.map