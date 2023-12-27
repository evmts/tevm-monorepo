import type { Tevm } from '../tevm.js';
import { Account as EthjsAccount } from '@ethereumjs/util';
import type { Address } from 'abitype';
import { z } from 'zod';
export declare const PutAccountActionValidator: z.ZodObject<{
    account: z.ZodEffects<z.ZodString, `0x${string}`, string>;
    balance: z.ZodDefault<z.ZodOptional<z.ZodBigInt>>;
}, "strip", z.ZodTypeAny, {
    account: `0x${string}`;
    balance: bigint;
}, {
    account: string;
    balance?: bigint | undefined;
}>;
/**
 * Tevm action to put an account into the vm state
 */
export type PutAccountAction = {
    account: Address;
    balance?: bigint;
};
export declare const putAccountHandler: (tevm: Tevm, { account, balance }: PutAccountAction) => Promise<EthjsAccount>;
//# sourceMappingURL=putAccount.d.ts.map