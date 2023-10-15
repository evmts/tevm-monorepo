"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyHash = void 0;
const abis_js_1 = require("../../constants/abis.js");
const contracts_js_1 = require("../../constants/contracts.js");
const contract_js_1 = require("../../errors/contract.js");
const isBytesEqual_js_1 = require("../../utils/data/isBytesEqual.js");
const index_js_1 = require("../../utils/index.js");
const call_js_1 = require("./call.js");
async function verifyHash(client, { address, hash, signature, ...callRequest }) {
    const signatureHex = (0, index_js_1.isHex)(signature) ? signature : (0, index_js_1.toHex)(signature);
    try {
        const { data } = await (0, call_js_1.call)(client, {
            data: (0, index_js_1.encodeDeployData)({
                abi: abis_js_1.universalSignatureValidatorAbi,
                args: [address, hash, signatureHex],
                bytecode: contracts_js_1.universalSignatureValidatorByteCode,
            }),
            ...callRequest,
        });
        return (0, isBytesEqual_js_1.isBytesEqual)(data ?? '0x0', '0x1');
    }
    catch (error) {
        if (error instanceof contract_js_1.CallExecutionError) {
            return false;
        }
        throw error;
    }
}
exports.verifyHash = verifyHash;
//# sourceMappingURL=verifyHash.js.map