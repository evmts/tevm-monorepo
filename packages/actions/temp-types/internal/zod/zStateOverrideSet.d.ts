export const zStateOverrideSet: z.ZodRecord<z.ZodEffects<z.ZodString, `0x${string}`, string>, z.ZodObject<{
    balance: z.ZodOptional<z.ZodBigInt>;
    nonce: z.ZodOptional<z.ZodBigInt>;
    code: z.ZodOptional<z.ZodEffects<z.ZodString, `0x${string}`, string>>;
    state: z.ZodOptional<z.ZodRecord<z.ZodEffects<z.ZodString, `0x${string}`, string>, z.ZodEffects<z.ZodString, `0x${string}`, string>>>;
    stateDiff: z.ZodOptional<z.ZodRecord<z.ZodEffects<z.ZodString, `0x${string}`, string>, z.ZodEffects<z.ZodString, `0x${string}`, string>>>;
}, "strict", z.ZodTypeAny, {
    code?: `0x${string}` | undefined;
    balance?: bigint | undefined;
    nonce?: bigint | undefined;
    state?: Partial<Record<`0x${string}`, `0x${string}`>> | undefined;
    stateDiff?: Partial<Record<`0x${string}`, `0x${string}`>> | undefined;
}, {
    code?: string | undefined;
    balance?: bigint | undefined;
    nonce?: bigint | undefined;
    state?: Record<string, string> | undefined;
    stateDiff?: Record<string, string> | undefined;
}>>;
import { z } from 'zod';
//# sourceMappingURL=zStateOverrideSet.d.ts.map