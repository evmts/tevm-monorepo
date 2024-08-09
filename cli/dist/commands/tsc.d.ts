export declare const args: import("zod").ZodTuple<[import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodString>>], null>;
export declare const options: import("zod").ZodObject<{
    preset: import("zod").ZodEffects<import("zod").ZodDefault<import("zod").ZodString>, number, string | undefined>;
    forkUrl: import("zod").ZodOptional<import("zod").ZodString>;
    block: import("zod").ZodEffects<import("zod").ZodUnion<[import("zod").ZodLiteral<"latest">, import("zod").ZodLiteral<"earliest">, import("zod").ZodLiteral<"pending">, import("zod").ZodLiteral<"safe">, import("zod").ZodLiteral<"finalized">, import("zod").ZodBigInt, import("zod").ZodEffects<import("zod").ZodString, `0x${string}`, string>]>, bigint | "pending" | "latest" | "earliest" | "safe" | "finalized" | `0x${string}`, string | bigint>;
    host: import("zod").ZodDefault<import("zod").ZodString>;
    port: import("zod").ZodDefault<import("zod").ZodString>;
    loggingLevel: import("zod").ZodDefault<import("zod").ZodUnion<[import("zod").ZodLiteral<"trace">, import("zod").ZodLiteral<"debug">, import("zod").ZodLiteral<"info">, import("zod").ZodLiteral<"warn">, import("zod").ZodLiteral<"error">]>>;
}, "strict", import("zod").ZodTypeAny, {
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
declare const _default: import("react").FC<{
    options: import("zod").TypeOf<typeof import("../server/options.js").options>;
}>;
export default _default;
//# sourceMappingURL=tsc.d.ts.map