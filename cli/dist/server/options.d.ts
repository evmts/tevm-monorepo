import { z } from 'zod';
export declare const options: z.ZodObject<{
    preset: z.ZodEffects<z.ZodDefault<z.ZodString>, number, string | undefined>;
    forkUrl: z.ZodOptional<z.ZodString>;
    block: z.ZodEffects<z.ZodUnion<[z.ZodLiteral<"latest">, z.ZodLiteral<"earliest">, z.ZodLiteral<"pending">, z.ZodLiteral<"safe">, z.ZodLiteral<"finalized">, z.ZodBigInt, z.ZodEffects<z.ZodString, `0x${string}`, string>]>, bigint | "pending" | "latest" | "earliest" | "safe" | "finalized" | `0x${string}`, string | bigint>;
    host: z.ZodDefault<z.ZodString>;
    port: z.ZodDefault<z.ZodString>;
    loggingLevel: z.ZodDefault<z.ZodUnion<[z.ZodLiteral<"trace">, z.ZodLiteral<"debug">, z.ZodLiteral<"info">, z.ZodLiteral<"warn">, z.ZodLiteral<"error">]>>;
}, "strict", z.ZodTypeAny, {
    block: bigint | "pending" | "latest" | "earliest" | "safe" | "finalized" | `0x${string}`;
    preset: number;
    host: string;
    port: string;
    loggingLevel: "error" | "trace" | "debug" | "info" | "warn";
    forkUrl?: string | undefined;
}, {
    block: string | bigint;
    preset?: string | undefined;
    forkUrl?: string | undefined;
    host?: string | undefined;
    port?: string | undefined;
    loggingLevel?: "error" | "trace" | "debug" | "info" | "warn" | undefined;
}>;
//# sourceMappingURL=options.d.ts.map