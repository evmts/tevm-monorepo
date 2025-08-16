/**
 * Parameters shared across tevm actions
 */
export const zBaseParams: z.ZodObject<{
    throwOnFail: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    throwOnFail?: boolean | undefined;
}, {
    throwOnFail?: boolean | undefined;
}>;
import { z } from 'zod';
//# sourceMappingURL=zBaseParams.d.ts.map