"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readContract = void 0;
const decodeFunctionResult_js_1 = require("../../utils/abi/decodeFunctionResult.js");
const encodeFunctionData_js_1 = require("../../utils/abi/encodeFunctionData.js");
const getContractError_js_1 = require("../../utils/errors/getContractError.js");
const call_js_1 = require("./call.js");
async function readContract(client, { abi, address, args, functionName, ...callRequest }) {
    const calldata = (0, encodeFunctionData_js_1.encodeFunctionData)({
        abi,
        args,
        functionName,
    });
    try {
        const { data } = await (0, call_js_1.call)(client, {
            data: calldata,
            to: address,
            ...callRequest,
        });
        return (0, decodeFunctionResult_js_1.decodeFunctionResult)({
            abi,
            args,
            functionName,
            data: data || '0x',
        });
    }
    catch (err) {
        throw (0, getContractError_js_1.getContractError)(err, {
            abi: abi,
            address,
            args,
            docsPath: '/docs/contract/readContract',
            functionName,
        });
    }
}
exports.readContract = readContract;
//# sourceMappingURL=readContract.js.map