"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeFunctionData = void 0;
const abi_js_1 = require("../../errors/abi.js");
const concat_js_1 = require("../data/concat.js");
const getFunctionSelector_js_1 = require("../hash/getFunctionSelector.js");
const encodeAbiParameters_js_1 = require("./encodeAbiParameters.js");
const formatAbiItem_js_1 = require("./formatAbiItem.js");
const getAbiItem_js_1 = require("./getAbiItem.js");
function encodeFunctionData({ abi, args, functionName, }) {
    let abiItem = abi[0];
    if (functionName) {
        abiItem = (0, getAbiItem_js_1.getAbiItem)({
            abi,
            args,
            name: functionName,
        });
        if (!abiItem)
            throw new abi_js_1.AbiFunctionNotFoundError(functionName, {
                docsPath: '/docs/contract/encodeFunctionData',
            });
    }
    if (abiItem.type !== 'function')
        throw new abi_js_1.AbiFunctionNotFoundError(undefined, {
            docsPath: '/docs/contract/encodeFunctionData',
        });
    const definition = (0, formatAbiItem_js_1.formatAbiItem)(abiItem);
    const signature = (0, getFunctionSelector_js_1.getFunctionSelector)(definition);
    const data = 'inputs' in abiItem && abiItem.inputs
        ? (0, encodeAbiParameters_js_1.encodeAbiParameters)(abiItem.inputs, (args ?? []))
        : undefined;
    return (0, concat_js_1.concatHex)([signature, data ?? '0x']);
}
exports.encodeFunctionData = encodeFunctionData;
//# sourceMappingURL=encodeFunctionData.js.map