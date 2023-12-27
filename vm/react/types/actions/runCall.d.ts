import type { Tevm } from '../tevm.js';
import { type Address, type Hex } from 'viem';
import { z } from 'zod';
export declare const CallActionValidator: z.ZodObject<{
    to: z.ZodEffects<z.ZodString, `0x${string}`, string>;
    caller: z.ZodEffects<z.ZodString, `0x${string}`, string>;
    origin: z.ZodOptional<z.ZodEffects<z.ZodString, `0x${string}`, string>>;
    gasLimit: z.ZodOptional<z.ZodBigInt>;
    data: z.ZodEffects<z.ZodString, `0x${string}`, string>;
    value: z.ZodOptional<z.ZodBigInt>;
}, "strip", z.ZodTypeAny, {
    to: `0x${string}`;
    caller: `0x${string}`;
    data: `0x${string}`;
    origin?: `0x${string}` | undefined;
    gasLimit?: bigint | undefined;
    value?: bigint | undefined;
}, {
    to: string;
    caller: string;
    data: string;
    origin?: string | undefined;
    gasLimit?: bigint | undefined;
    value?: bigint | undefined;
}>;
/**
 * Tevm action to execute a call on the vm
 */
export type RunCallAction = {
    to: Address;
    caller: Address;
    origin?: Address | undefined;
    gasLimit?: bigint | undefined;
    data: Hex;
    value?: bigint | undefined;
};
/**
 * Executes a call on the vm
 */
export declare const runCallHandler: (tevm: Tevm, action: RunCallAction) => Promise<import("@ethereumjs/evm").EVMResult>;
//# sourceMappingURL=runCall.d.ts.map