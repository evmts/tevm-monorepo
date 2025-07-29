export const zBlockOverrideSet: z.ZodObject<{
    number: z.ZodOptional<z.ZodBigInt>;
    time: z.ZodOptional<z.ZodBigInt>;
    gasLimit: z.ZodOptional<z.ZodBigInt>;
    coinbase: z.ZodOptional<z.ZodEffects<z.ZodString, `0x${string}`, string>>;
    baseFee: z.ZodOptional<z.ZodBigInt>;
    blobBaseFee: z.ZodOptional<z.ZodBigInt>;
}, "strict", z.ZodTypeAny, {
    number?: bigint | undefined;
    time?: bigint | undefined;
    gasLimit?: bigint | undefined;
    coinbase?: `0x${string}` | undefined;
    baseFee?: bigint | undefined;
    blobBaseFee?: bigint | undefined;
}, {
    number?: bigint | undefined;
    time?: bigint | undefined;
    gasLimit?: bigint | undefined;
    coinbase?: string | undefined;
    baseFee?: bigint | undefined;
    blobBaseFee?: bigint | undefined;
}>;
import { z } from 'zod';
//# sourceMappingURL=zBlockOverrideSet.d.ts.map