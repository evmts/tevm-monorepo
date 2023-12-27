export const CallActionValidator: z.ZodObject<{
    to: z.ZodOptional<z.ZodEffects<z.ZodString, `0x${string}`, string>>;
    caller: z.ZodEffects<z.ZodString, `0x${string}`, string>;
    origin: z.ZodOptional<z.ZodEffects<z.ZodString, `0x${string}`, string>>;
    gasLimit: z.ZodOptional<z.ZodBigInt>;
    data: z.ZodEffects<z.ZodString, `0x${string}`, string>;
    value: z.ZodOptional<z.ZodBigInt>;
}, "strip", z.ZodTypeAny, {
    caller: `0x${string}`;
    data: `0x${string}`;
    to?: `0x${string}` | undefined;
    origin?: `0x${string}` | undefined;
    gasLimit?: bigint | undefined;
    value?: bigint | undefined;
}, {
    caller: string;
    data: string;
    to?: string | undefined;
    origin?: string | undefined;
    gasLimit?: bigint | undefined;
    value?: bigint | undefined;
}>;
import { z } from 'zod';
//# sourceMappingURL=CallActionValidator.d.ts.map