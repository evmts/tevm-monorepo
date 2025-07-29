/**
 * Zod validator for a block header specification within actions
 */
export const zBlock: z.ZodObject<{
    number: z.ZodBigInt;
    coinbase: z.ZodEffects<z.ZodString, `0x${string}`, string>;
    timestamp: z.ZodBigInt;
    difficulty: z.ZodBigInt;
    gasLimit: z.ZodBigInt;
    baseFeePerGas: z.ZodOptional<z.ZodBigInt>;
    blobGasPrice: z.ZodOptional<z.ZodBigInt>;
}, "strict", z.ZodTypeAny, {
    number: bigint;
    gasLimit: bigint;
    coinbase: `0x${string}`;
    difficulty: bigint;
    timestamp: bigint;
    blobGasPrice?: bigint | undefined;
    baseFeePerGas?: bigint | undefined;
}, {
    number: bigint;
    gasLimit: bigint;
    coinbase: string;
    difficulty: bigint;
    timestamp: bigint;
    blobGasPrice?: bigint | undefined;
    baseFeePerGas?: bigint | undefined;
}>;
import { z } from 'zod';
//# sourceMappingURL=zBlock.d.ts.map