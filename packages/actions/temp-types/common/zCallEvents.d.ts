/**
 * Zod schema for EVM execution event handlers
 * These are not part of the JSON-RPC interface but are used internally for call handling
 */
export const zCallEvents: z.ZodObject<{
    onStep: z.ZodOptional<z.ZodOptional<z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>>>;
    onNewContract: z.ZodOptional<z.ZodOptional<z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>>>;
    onBeforeMessage: z.ZodOptional<z.ZodOptional<z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>>>;
    onAfterMessage: z.ZodOptional<z.ZodOptional<z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>>>;
}, "strip", z.ZodTypeAny, {
    onStep?: ((...args: unknown[]) => unknown) | undefined;
    onNewContract?: ((...args: unknown[]) => unknown) | undefined;
    onBeforeMessage?: ((...args: unknown[]) => unknown) | undefined;
    onAfterMessage?: ((...args: unknown[]) => unknown) | undefined;
}, {
    onStep?: ((...args: unknown[]) => unknown) | undefined;
    onNewContract?: ((...args: unknown[]) => unknown) | undefined;
    onBeforeMessage?: ((...args: unknown[]) => unknown) | undefined;
    onAfterMessage?: ((...args: unknown[]) => unknown) | undefined;
}>;
import { z } from 'zod';
//# sourceMappingURL=zCallEvents.d.ts.map