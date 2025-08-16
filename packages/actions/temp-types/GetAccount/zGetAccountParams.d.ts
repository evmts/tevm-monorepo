/**
 * Zod validator for a valid getAccount action
 */
export const zGetAccountParams: z.ZodObject<{
    throwOnFail: z.ZodOptional<z.ZodBoolean>;
} & {
    address: z.ZodEffects<z.ZodString, `0x${string}`, string>;
    blockTag: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"latest">, z.ZodLiteral<"earliest">, z.ZodLiteral<"pending">, z.ZodLiteral<"safe">, z.ZodLiteral<"finalized">, z.ZodBigInt, z.ZodEffects<z.ZodNumber, bigint, number>, z.ZodEffects<z.ZodString, `0x${string}`, string>]>>;
    returnStorage: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    address: `0x${string}`;
    throwOnFail?: boolean | undefined;
    blockTag?: bigint | `0x${string}` | "latest" | "earliest" | "pending" | "safe" | "finalized" | undefined;
    returnStorage?: boolean | undefined;
}, {
    address: string;
    throwOnFail?: boolean | undefined;
    blockTag?: string | number | bigint | undefined;
    returnStorage?: boolean | undefined;
}>;
import { z } from 'zod';
//# sourceMappingURL=zGetAccountParams.d.ts.map