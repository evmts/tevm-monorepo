/**
 * Zod validator for a valid setAccount action
 */
export const zSetAccountParams: z.ZodEffects<z.ZodObject<{
    throwOnFail: z.ZodOptional<z.ZodBoolean>;
} & {
    address: z.ZodEffects<z.ZodString, `0x${string}`, string>;
    balance: z.ZodOptional<z.ZodBigInt>;
    nonce: z.ZodOptional<z.ZodBigInt>;
    deployedBytecode: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, `0x${string}`, string>, `0x${string}`, string>>;
    storageRoot: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
    state: z.ZodOptional<z.ZodRecord<z.ZodEffects<z.ZodString, `0x${string}`, string>, z.ZodEffects<z.ZodString, `0x${string}`, string>>>;
    stateDiff: z.ZodOptional<z.ZodRecord<z.ZodEffects<z.ZodString, `0x${string}`, string>, z.ZodEffects<z.ZodString, `0x${string}`, string>>>;
}, "strip", z.ZodTypeAny, {
    address: `0x${string}`;
    throwOnFail?: boolean | undefined;
    deployedBytecode?: `0x${string}` | undefined;
    balance?: bigint | undefined;
    nonce?: bigint | undefined;
    state?: Partial<Record<`0x${string}`, `0x${string}`>> | undefined;
    stateDiff?: Partial<Record<`0x${string}`, `0x${string}`>> | undefined;
    storageRoot?: string | undefined;
}, {
    address: string;
    throwOnFail?: boolean | undefined;
    deployedBytecode?: string | undefined;
    balance?: bigint | undefined;
    nonce?: bigint | undefined;
    state?: Record<string, string> | undefined;
    stateDiff?: Record<string, string> | undefined;
    storageRoot?: string | undefined;
}>, {
    address: `0x${string}`;
    throwOnFail?: boolean | undefined;
    deployedBytecode?: `0x${string}` | undefined;
    balance?: bigint | undefined;
    nonce?: bigint | undefined;
    state?: Partial<Record<`0x${string}`, `0x${string}`>> | undefined;
    stateDiff?: Partial<Record<`0x${string}`, `0x${string}`>> | undefined;
    storageRoot?: string | undefined;
}, {
    address: string;
    throwOnFail?: boolean | undefined;
    deployedBytecode?: string | undefined;
    balance?: bigint | undefined;
    nonce?: bigint | undefined;
    state?: Record<string, string> | undefined;
    stateDiff?: Record<string, string> | undefined;
    storageRoot?: string | undefined;
}>;
import { z } from 'zod';
//# sourceMappingURL=zSetAccountParams.d.ts.map