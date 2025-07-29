export const zLoadStateParams: z.ZodObject<{
    state: z.ZodRecord<z.ZodString, z.ZodObject<{
        throwOnFail: z.ZodOptional<z.ZodBoolean>;
    } & {
        nonce: z.ZodBigInt;
        balance: z.ZodBigInt;
        storageRoot: z.ZodEffects<z.ZodString, `0x${string}`, string>;
        codeHash: z.ZodEffects<z.ZodString, `0x${string}`, string>;
        storage: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodEffects<z.ZodString, `0x${string}`, string>>>;
    }, "strip", z.ZodTypeAny, {
        balance: bigint;
        nonce: bigint;
        storageRoot: `0x${string}`;
        codeHash: `0x${string}`;
        throwOnFail?: boolean | undefined;
        storage?: Record<string, `0x${string}`> | undefined;
    }, {
        balance: bigint;
        nonce: bigint;
        storageRoot: string;
        codeHash: string;
        throwOnFail?: boolean | undefined;
        storage?: Record<string, string> | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    state: Record<string, {
        balance: bigint;
        nonce: bigint;
        storageRoot: `0x${string}`;
        codeHash: `0x${string}`;
        throwOnFail?: boolean | undefined;
        storage?: Record<string, `0x${string}`> | undefined;
    }>;
}, {
    state: Record<string, {
        balance: bigint;
        nonce: bigint;
        storageRoot: string;
        codeHash: string;
        throwOnFail?: boolean | undefined;
        storage?: Record<string, string> | undefined;
    }>;
}>;
import { z } from 'zod';
//# sourceMappingURL=zLoadStateParams.d.ts.map