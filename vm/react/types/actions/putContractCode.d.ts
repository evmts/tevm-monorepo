import type { Tevm } from '../tevm.js';
import { type Address, type Hex } from 'viem';
import { z } from 'zod';
export declare const PutContractCodeActionValidator: z.ZodObject<{
    deployedBytecode: z.ZodEffects<z.ZodString, `0x${string}`, string>;
    contractAddress: z.ZodEffects<z.ZodString, `0x${string}`, string>;
}, "strip", z.ZodTypeAny, {
    deployedBytecode: `0x${string}`;
    contractAddress: `0x${string}`;
}, {
    deployedBytecode: string;
    contractAddress: string;
}>;
/**
 * Tevm action to put contract code into the vm state
 */
export type PutContractCodeAction = {
    deployedBytecode: Hex;
    contractAddress: Address;
};
export declare const putContractCodeHandler: (tevm: Tevm, action: PutContractCodeAction) => Promise<Uint8Array>;
//# sourceMappingURL=putContractCode.d.ts.map