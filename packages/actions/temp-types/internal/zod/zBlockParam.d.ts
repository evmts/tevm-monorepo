export const zBlockParam: z.ZodUnion<[z.ZodLiteral<"latest">, z.ZodLiteral<"earliest">, z.ZodLiteral<"pending">, z.ZodLiteral<"safe">, z.ZodLiteral<"finalized">, z.ZodBigInt, z.ZodEffects<z.ZodNumber, bigint, number>, z.ZodEffects<z.ZodString, `0x${string}`, string>]>;
import { z } from 'zod';
//# sourceMappingURL=zBlockParam.d.ts.map