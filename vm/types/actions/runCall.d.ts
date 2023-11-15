import type { EVMts } from '../evmts.js';
import { type Address, type Hex } from 'viem';
/**
 * EVMts action to execute a call on the vm
 */
export type RunCallAction = {
    to: Address;
    caller: Address;
    origin: Address;
    gasLimit?: bigint;
    data: Hex;
    value?: bigint;
};
/**
 * Executes a call on the vm
 */
export declare const runCallHandler: (evmts: EVMts, action: RunCallAction) => Promise<import("@ethereumjs/evm").EVMResult>;
//# sourceMappingURL=runCall.d.ts.map