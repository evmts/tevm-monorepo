import type { Tevm } from '../tevm.js';
import type { Log } from '@ethereumjs/evm';
import type { Abi } from 'abitype';
import { type Address, type DecodeFunctionResultReturnType, type EncodeFunctionDataParameters } from 'viem';
import { z } from 'zod';
export declare const RunContractCallActionValidator: z.ZodObject<{
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
    args: z.ZodOptional<z.ZodArray<z.ZodAny, "many">>;
    functionName: z.ZodOptional<z.ZodString>;
    caller: z.ZodOptional<z.ZodEffects<z.ZodString, `0x${string}`, string>>;
    contractAddress: z.ZodEffects<z.ZodString, `0x${string}`, string>;
    gasLimit: z.ZodOptional<z.ZodBigInt>;
}, "strip", z.ZodTypeAny, {
    contractAddress: `0x${string}`;
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
    args?: any[] | undefined;
    functionName?: string | undefined;
    caller?: `0x${string}` | undefined;
    gasLimit?: bigint | undefined;
}, {
    contractAddress: string;
    abi: unknown[];
    args?: any[] | undefined;
    functionName?: string | undefined;
    caller?: string | undefined;
    gasLimit?: bigint | undefined;
}>;
/**
 * Tevm action to execute a call on a contract
 */
export type RunContractCallAction<TAbi extends Abi | readonly unknown[] = Abi, TFunctionName extends string = string> = EncodeFunctionDataParameters<TAbi, TFunctionName> & {
    contractAddress: Address;
    caller?: Address;
    gasLimit?: bigint;
};
export type RunContractCallError = Error;
export type RunContractCallResult<TAbi extends Abi | readonly unknown[] = Abi, TFunctionName extends string = string> = {
    data: DecodeFunctionResultReturnType<TAbi, TFunctionName>;
    gasUsed: BigInt;
    logs: Log[];
};
export declare const runContractCallHandler: <TAbi extends readonly unknown[] | Abi = Abi, TFunctionName extends string = string>(tevm: Tevm, { abi, args, functionName, caller, contractAddress, gasLimit, }: RunContractCallAction<TAbi, TFunctionName>) => Promise<RunContractCallResult<TAbi, TFunctionName>>;
//# sourceMappingURL=runContractCall.d.ts.map