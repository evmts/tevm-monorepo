/**
 * Zod validator for a valid ABI
 */
export const zAbi: import("zod").ZodReadonly<import("zod").ZodArray<import("zod").ZodUnion<[import("zod").ZodObject<{
    type: import("zod").ZodLiteral<"error">;
    inputs: import("zod").ZodReadonly<import("zod").ZodArray<import("zod").ZodType<import("abitype").AbiParameter, import("zod").ZodTypeDef, import("abitype").AbiParameter>, "many">>;
    name: import("zod").ZodString;
}, "strip", import("zod").ZodTypeAny, {
    inputs: readonly import("abitype").AbiParameter[];
    type: "error";
    name: string;
}, {
    inputs: readonly import("abitype").AbiParameter[];
    type: "error";
    name: string;
}>, import("zod").ZodObject<{
    type: import("zod").ZodLiteral<"event">;
    anonymous: import("zod").ZodOptional<import("zod").ZodBoolean>;
    inputs: import("zod").ZodReadonly<import("zod").ZodArray<import("zod").ZodType<import("abitype").AbiEventParameter, import("zod").ZodTypeDef, import("abitype").AbiEventParameter>, "many">>;
    name: import("zod").ZodString;
}, "strip", import("zod").ZodTypeAny, {
    inputs: readonly import("abitype").AbiEventParameter[];
    type: "event";
    name: string;
    anonymous?: boolean | undefined;
}, {
    inputs: readonly import("abitype").AbiEventParameter[];
    type: "event";
    name: string;
    anonymous?: boolean | undefined;
}>, import("zod").ZodEffects<import("zod").ZodIntersection<import("zod").ZodObject<{
    constant: import("zod").ZodOptional<import("zod").ZodBoolean>;
    gas: import("zod").ZodOptional<import("zod").ZodNumber>;
    payable: import("zod").ZodOptional<import("zod").ZodBoolean>;
}, "strip", import("zod").ZodTypeAny, {
    payable?: boolean | undefined;
    constant?: boolean | undefined;
    gas?: number | undefined;
}, {
    payable?: boolean | undefined;
    constant?: boolean | undefined;
    gas?: number | undefined;
}>, import("zod").ZodDiscriminatedUnion<"type", [import("zod").ZodObject<{
    type: import("zod").ZodLiteral<"function">;
    inputs: import("zod").ZodReadonly<import("zod").ZodArray<import("zod").ZodType<import("abitype").AbiParameter, import("zod").ZodTypeDef, import("abitype").AbiParameter>, "many">>;
    name: import("zod").ZodString;
    outputs: import("zod").ZodReadonly<import("zod").ZodArray<import("zod").ZodType<import("abitype").AbiParameter, import("zod").ZodTypeDef, import("abitype").AbiParameter>, "many">>;
    stateMutability: import("zod").ZodUnion<[import("zod").ZodLiteral<"pure">, import("zod").ZodLiteral<"view">, import("zod").ZodLiteral<"nonpayable">, import("zod").ZodLiteral<"payable">]>;
}, "strip", import("zod").ZodTypeAny, {
    inputs: readonly import("abitype").AbiParameter[];
    outputs: readonly import("abitype").AbiParameter[];
    type: "function";
    name: string;
    stateMutability: "pure" | "view" | "nonpayable" | "payable";
}, {
    inputs: readonly import("abitype").AbiParameter[];
    outputs: readonly import("abitype").AbiParameter[];
    type: "function";
    name: string;
    stateMutability: "pure" | "view" | "nonpayable" | "payable";
}>, import("zod").ZodObject<{
    type: import("zod").ZodLiteral<"constructor">;
    inputs: import("zod").ZodReadonly<import("zod").ZodArray<import("zod").ZodType<import("abitype").AbiParameter, import("zod").ZodTypeDef, import("abitype").AbiParameter>, "many">>;
    stateMutability: import("zod").ZodUnion<[import("zod").ZodLiteral<"payable">, import("zod").ZodLiteral<"nonpayable">]>;
}, "strip", import("zod").ZodTypeAny, {
    inputs: readonly import("abitype").AbiParameter[];
    type: "constructor";
    stateMutability: "nonpayable" | "payable";
}, {
    inputs: readonly import("abitype").AbiParameter[];
    type: "constructor";
    stateMutability: "nonpayable" | "payable";
}>, import("zod").ZodObject<{
    type: import("zod").ZodLiteral<"fallback">;
    inputs: import("zod").ZodOptional<import("zod").ZodTuple<[], null>>;
    stateMutability: import("zod").ZodUnion<[import("zod").ZodLiteral<"payable">, import("zod").ZodLiteral<"nonpayable">]>;
}, "strip", import("zod").ZodTypeAny, {
    type: "fallback";
    stateMutability: "nonpayable" | "payable";
    inputs?: [] | undefined;
}, {
    type: "fallback";
    stateMutability: "nonpayable" | "payable";
    inputs?: [] | undefined;
}>, import("zod").ZodObject<{
    type: import("zod").ZodLiteral<"receive">;
    stateMutability: import("zod").ZodLiteral<"payable">;
}, "strip", import("zod").ZodTypeAny, {
    type: "receive";
    stateMutability: "payable";
}, {
    type: "receive";
    stateMutability: "payable";
}>]>>, {
    payable?: boolean | undefined;
    constant?: boolean | undefined;
    gas?: number | undefined;
} & ({
    inputs: readonly import("abitype").AbiParameter[];
    outputs: readonly import("abitype").AbiParameter[];
    type: "function";
    name: string;
    stateMutability: "pure" | "view" | "nonpayable" | "payable";
} | {
    inputs: readonly import("abitype").AbiParameter[];
    type: "constructor";
    stateMutability: "nonpayable" | "payable";
} | {
    type: "fallback";
    stateMutability: "nonpayable" | "payable";
    inputs?: [] | undefined;
} | {
    type: "receive";
    stateMutability: "payable";
}), unknown>]>, "many">>;
//# sourceMappingURL=zAbi.d.ts.map