export const PutContractCodeActionValidator: z.ZodObject<{
    deployedBytecode: z.ZodEffects<z.ZodString, `0x${string}`, string>;
    contractAddress: z.ZodEffects<z.ZodString, `0x${string}`, string>;
}, "strip", z.ZodTypeAny, {
    contractAddress: `0x${string}`;
    deployedBytecode: `0x${string}`;
}, {
    contractAddress: string;
    deployedBytecode: string;
}>;
import { z } from 'zod';
//# sourceMappingURL=PutContractCodeActionValidator.d.ts.map