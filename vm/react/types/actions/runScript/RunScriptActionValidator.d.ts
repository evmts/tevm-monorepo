export const RunScriptActionValidator: z.ZodObject<{
    deployedBytecode: z.ZodEffects<z.ZodString, `0x${string}`, string>;
    caller: z.ZodOptional<z.ZodEffects<z.ZodString, `0x${string}`, string>>;
    args: z.ZodOptional<z.ZodArray<z.ZodAny, "many">>;
    abi: z.ZodReadonly<z.ZodArray<z.ZodUnion<[z.ZodObject<{
        type: z.ZodLiteral<"error">;
        inputs: z.ZodReadonly<z.ZodArray<z.ZodType<import("abitype").AbiParameter, z.ZodTypeDef, import("abitype").AbiParameter>, "many">>;
        name: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: "error";
        name: string;
        inputs: readonly import("abitype").AbiParameter[];
    }, {
        type: "error";
        name: string;
        inputs: import("abitype").AbiParameter[];
    }>, z.ZodObject<{
        type: z.ZodLiteral<"event">;
        anonymous: z.ZodOptional<z.ZodBoolean>;
        inputs: z.ZodReadonly<z.ZodArray<z.ZodType<import("abitype").AbiEventParameter, z.ZodTypeDef, import("abitype").AbiEventParameter>, "many">>;
        name: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: "event";
        name: string;
        inputs: readonly import("abitype").AbiEventParameter[];
        anonymous?: boolean | undefined;
    }, {
        type: "event";
        name: string;
        inputs: import("abitype").AbiEventParameter[];
        anonymous?: boolean | undefined;
    }>, z.ZodEffects<z.ZodIntersection<z.ZodObject<{
        constant: z.ZodOptional<z.ZodBoolean>;
        gas: z.ZodOptional<z.ZodNumber>;
        payable: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        constant?: boolean | undefined;
        gas?: number | undefined;
        payable?: boolean | undefined;
    }, {
        constant?: boolean | undefined;
        gas?: number | undefined;
        payable?: boolean | undefined;
    }>, z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
        type: z.ZodLiteral<"function">;
        inputs: z.ZodReadonly<z.ZodArray<z.ZodType<import("abitype").AbiParameter, z.ZodTypeDef, import("abitype").AbiParameter>, "many">>;
        name: z.ZodString;
        outputs: z.ZodReadonly<z.ZodArray<z.ZodType<import("abitype").AbiParameter, z.ZodTypeDef, import("abitype").AbiParameter>, "many">>;
        stateMutability: z.ZodUnion<[z.ZodLiteral<"pure">, z.ZodLiteral<"view">, z.ZodLiteral<"nonpayable">, z.ZodLiteral<"payable">]>;
    }, "strip", z.ZodTypeAny, {
        type: "function";
        name: string;
        inputs: readonly import("abitype").AbiParameter[];
        outputs: readonly import("abitype").AbiParameter[];
        stateMutability: "pure" | "view" | "nonpayable" | "payable";
    }, {
        type: "function";
        name: string;
        inputs: import("abitype").AbiParameter[];
        outputs: import("abitype").AbiParameter[];
        stateMutability: "pure" | "view" | "nonpayable" | "payable";
    }>, z.ZodObject<{
        type: z.ZodLiteral<"constructor">;
        inputs: z.ZodReadonly<z.ZodArray<z.ZodType<import("abitype").AbiParameter, z.ZodTypeDef, import("abitype").AbiParameter>, "many">>;
        stateMutability: z.ZodUnion<[z.ZodLiteral<"payable">, z.ZodLiteral<"nonpayable">]>;
    }, "strip", z.ZodTypeAny, {
        type: "constructor";
        inputs: readonly import("abitype").AbiParameter[];
        stateMutability: "nonpayable" | "payable";
    }, {
        type: "constructor";
        inputs: import("abitype").AbiParameter[];
        stateMutability: "nonpayable" | "payable";
    }>, z.ZodObject<{
        type: z.ZodLiteral<"fallback">;
        inputs: z.ZodOptional<z.ZodTuple<[], null>>;
        stateMutability: z.ZodUnion<[z.ZodLiteral<"payable">, z.ZodLiteral<"nonpayable">]>;
    }, "strip", z.ZodTypeAny, {
        type: "fallback";
        stateMutability: "nonpayable" | "payable";
        inputs?: [] | undefined;
    }, {
        type: "fallback";
        stateMutability: "nonpayable" | "payable";
        inputs?: [] | undefined;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"receive">;
        stateMutability: z.ZodLiteral<"payable">;
    }, "strip", z.ZodTypeAny, {
        type: "receive";
        stateMutability: "payable";
    }, {
        type: "receive";
        stateMutability: "payable";
    }>]>>, {
        constant?: boolean | undefined;
        gas?: number | undefined;
        payable?: boolean | undefined;
    } & ({
        type: "function";
        name: string;
        inputs: readonly import("abitype").AbiParameter[];
        outputs: readonly import("abitype").AbiParameter[];
        stateMutability: "pure" | "view" | "nonpayable" | "payable";
    } | {
        type: "constructor";
        inputs: readonly import("abitype").AbiParameter[];
        stateMutability: "nonpayable" | "payable";
    } | {
        type: "fallback";
        stateMutability: "nonpayable" | "payable";
        inputs?: [] | undefined;
    } | {
        type: "receive";
        stateMutability: "payable";
    }), unknown>]>, "many">>;
    functionName: z.ZodString;
}, "strip", z.ZodTypeAny, {
    abi: readonly ({
        type: "error";
        name: string;
        inputs: readonly import("abitype").AbiParameter[];
    } | {
        type: "event";
        name: string;
        inputs: readonly import("abitype").AbiEventParameter[];
        anonymous?: boolean | undefined;
    } | ({
        constant?: boolean | undefined;
        gas?: number | undefined;
        payable?: boolean | undefined;
    } & ({
        type: "function";
        name: string;
        inputs: readonly import("abitype").AbiParameter[];
        outputs: readonly import("abitype").AbiParameter[];
        stateMutability: "pure" | "view" | "nonpayable" | "payable";
    } | {
        type: "constructor";
        inputs: readonly import("abitype").AbiParameter[];
        stateMutability: "nonpayable" | "payable";
    } | {
        type: "fallback";
        stateMutability: "nonpayable" | "payable";
        inputs?: [] | undefined;
    } | {
        type: "receive";
        stateMutability: "payable";
    })))[];
    functionName: string;
    deployedBytecode: `0x${string}`;
    caller?: `0x${string}` | undefined;
    args?: any[] | undefined;
}, {
    abi: unknown[];
    functionName: string;
    deployedBytecode: string;
    caller?: string | undefined;
    args?: any[] | undefined;
}>;
import { z } from 'zod';
//# sourceMappingURL=RunScriptActionValidator.d.ts.map