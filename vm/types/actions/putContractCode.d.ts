import type { EVMts } from '../evmts.js';
import { type Address, type Hex } from 'viem';
/**
 * EVMts action to put contract code into the vm state
 */
export type PutContractCodeAction = {
    bytecode: Hex;
    contractAddress: Address;
};
export declare const putContractCodeHandler: (evmts: EVMts, action: PutContractCodeAction) => Promise<Uint8Array>;
//# sourceMappingURL=putContractCode.d.ts.map