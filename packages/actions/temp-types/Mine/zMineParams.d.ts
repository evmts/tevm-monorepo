/**
 * Zod validator for a valid mine action invocation
 */
export const zMineParams: z.ZodObject<{
    throwOnFail: z.ZodOptional<z.ZodBoolean>;
} & {
    blockCount: z.ZodOptional<z.ZodNumber>;
    interval: z.ZodOptional<z.ZodNumber>;
    onBlock: z.ZodOptional<z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>>;
    onReceipt: z.ZodOptional<z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>>;
    onLog: z.ZodOptional<z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    throwOnFail?: boolean | undefined;
    onBlock?: ((...args: unknown[]) => unknown) | undefined;
    onReceipt?: ((...args: unknown[]) => unknown) | undefined;
    onLog?: ((...args: unknown[]) => unknown) | undefined;
    blockCount?: number | undefined;
    interval?: number | undefined;
}, {
    throwOnFail?: boolean | undefined;
    onBlock?: ((...args: unknown[]) => unknown) | undefined;
    onReceipt?: ((...args: unknown[]) => unknown) | undefined;
    onLog?: ((...args: unknown[]) => unknown) | undefined;
    blockCount?: number | undefined;
    interval?: number | undefined;
}>;
import { z } from 'zod';
//# sourceMappingURL=zMineParams.d.ts.map