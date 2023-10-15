"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnsResolver = void 0;
const chain_js_1 = require("../../utils/chain.js");
const toHex_js_1 = require("../../utils/encoding/toHex.js");
const packetToBytes_js_1 = require("../../utils/ens/packetToBytes.js");
const readContract_js_1 = require("../public/readContract.js");
async function getEnsResolver(client, { blockNumber, blockTag, name, universalResolverAddress: universalResolverAddress_, }) {
    let universalResolverAddress = universalResolverAddress_;
    if (!universalResolverAddress) {
        if (!client.chain)
            throw new Error('client chain not configured. universalResolverAddress is required.');
        universalResolverAddress = (0, chain_js_1.getChainContractAddress)({
            blockNumber,
            chain: client.chain,
            contract: 'ensUniversalResolver',
        });
    }
    const [resolverAddress] = await (0, readContract_js_1.readContract)(client, {
        address: universalResolverAddress,
        abi: [
            {
                inputs: [{ type: 'bytes' }],
                name: 'findResolver',
                outputs: [{ type: 'address' }, { type: 'bytes32' }],
                stateMutability: 'view',
                type: 'function',
            },
        ],
        functionName: 'findResolver',
        args: [(0, toHex_js_1.toHex)((0, packetToBytes_js_1.packetToBytes)(name))],
        blockNumber,
        blockTag,
    });
    return resolverAddress;
}
exports.getEnsResolver = getEnsResolver;
//# sourceMappingURL=getEnsResolver.js.map