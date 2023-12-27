export const PutAccountActionValidator: z.ZodObject<{
    account: z.ZodEffects<z.ZodString, `0x${string}`, string>;
    balance: z.ZodDefault<z.ZodOptional<z.ZodBigInt>>;
}, "strip", z.ZodTypeAny, {
    account: `0x${string}`;
    balance: bigint;
}, {
    account: string;
    balance?: bigint | undefined;
}>;
import { z } from 'zod';
//# sourceMappingURL=PutAccountActionValidator.d.ts.map