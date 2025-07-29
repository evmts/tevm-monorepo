/**
 * Zod validator for a valid contract action
 */
export const zContractParams: z.ZodEffects<z.ZodEffects<z.ZodIntersection<z.ZodEffects<z.ZodObject<{
    throwOnFail: z.ZodOptional<z.ZodBoolean>;
} & {
    createTrace: z.ZodOptional<z.ZodBoolean>;
    createAccessList: z.ZodOptional<z.ZodBoolean>;
    createTransaction: z.ZodUnion<[z.ZodOptional<z.ZodBoolean>, z.ZodLiteral<"on-success">, z.ZodLiteral<"always">, z.ZodLiteral<"never">]>;
    addToMempool: z.ZodUnion<[z.ZodOptional<z.ZodBoolean>, z.ZodLiteral<"on-success">, z.ZodLiteral<"always">, z.ZodLiteral<"never">]>;
    addToBlockchain: z.ZodUnion<[z.ZodOptional<z.ZodBoolean>, z.ZodLiteral<"on-success">, z.ZodLiteral<"always">, z.ZodLiteral<"never">]>;
    skipBalance: z.ZodOptional<z.ZodBoolean>;
    gasRefund: z.ZodOptional<z.ZodBigInt>;
    blockTag: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"latest">, z.ZodLiteral<"earliest">, z.ZodLiteral<"pending">, z.ZodLiteral<"safe">, z.ZodLiteral<"finalized">, z.ZodBigInt, z.ZodEffects<z.ZodNumber, bigint, number>, z.ZodEffects<z.ZodString, `0x${string}`, string>]>>;
    gasPrice: z.ZodOptional<z.ZodBigInt>;
    origin: z.ZodOptional<z.ZodEffects<z.ZodString, `0x${string}`, string>>;
    caller: z.ZodOptional<z.ZodEffects<z.ZodString, `0x${string}`, string>>;
    gas: z.ZodOptional<z.ZodBigInt>;
    value: z.ZodOptional<z.ZodBigInt>;
    depth: z.ZodOptional<z.ZodNumber>;
    selfdestruct: z.ZodOptional<z.ZodSet<z.ZodEffects<z.ZodString, `0x${string}`, string>>>;
    to: z.ZodOptional<z.ZodEffects<z.ZodString, `0x${string}`, string>>;
    blobVersionedHashes: z.ZodOptional<z.ZodArray<z.ZodEffects<z.ZodString, `0x${string}`, string>, "many">>;
    stateOverrideSet: z.ZodOptional<z.ZodRecord<z.ZodEffects<z.ZodString, `0x${string}`, string>, z.ZodObject<{
        balance: z.ZodOptional<z.ZodBigInt>;
        nonce: z.ZodOptional<z.ZodBigInt>;
        code: z.ZodOptional<z.ZodEffects<z.ZodString, `0x${string}`, string>>;
        state: z.ZodOptional<z.ZodRecord<z.ZodEffects<z.ZodString, `0x${string}`, string>, z.ZodEffects<z.ZodString, `0x${string}`, string>>>;
        stateDiff: z.ZodOptional<z.ZodRecord<z.ZodEffects<z.ZodString, `0x${string}`, string>, z.ZodEffects<z.ZodString, `0x${string}`, string>>>;
    }, "strict", z.ZodTypeAny, {
        code?: `0x${string}` | undefined;
        balance?: bigint | undefined;
        nonce?: bigint | undefined;
        state?: Partial<Record<`0x${string}`, `0x${string}`>> | undefined;
        stateDiff?: Partial<Record<`0x${string}`, `0x${string}`>> | undefined;
    }, {
        code?: string | undefined;
        balance?: bigint | undefined;
        nonce?: bigint | undefined;
        state?: Record<string, string> | undefined;
        stateDiff?: Record<string, string> | undefined;
    }>>>;
    blockOverrideSet: z.ZodOptional<z.ZodObject<{
        number: z.ZodOptional<z.ZodBigInt>;
        time: z.ZodOptional<z.ZodBigInt>;
        gasLimit: z.ZodOptional<z.ZodBigInt>;
        coinbase: z.ZodOptional<z.ZodEffects<z.ZodString, `0x${string}`, string>>;
        baseFee: z.ZodOptional<z.ZodBigInt>;
        blobBaseFee: z.ZodOptional<z.ZodBigInt>;
    }, "strict", z.ZodTypeAny, {
        number?: bigint | undefined;
        time?: bigint | undefined;
        gasLimit?: bigint | undefined;
        coinbase?: `0x${string}` | undefined;
        baseFee?: bigint | undefined;
        blobBaseFee?: bigint | undefined;
    }, {
        number?: bigint | undefined;
        time?: bigint | undefined;
        gasLimit?: bigint | undefined;
        coinbase?: string | undefined;
        baseFee?: bigint | undefined;
        blobBaseFee?: bigint | undefined;
    }>>;
    maxFeePerGas: z.ZodOptional<z.ZodBigInt>;
    maxPriorityFeePerGas: z.ZodOptional<z.ZodBigInt>;
    onStep: z.ZodOptional<z.ZodOptional<z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>>>;
    onNewContract: z.ZodOptional<z.ZodOptional<z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>>>;
    onBeforeMessage: z.ZodOptional<z.ZodOptional<z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>>>;
    onAfterMessage: z.ZodOptional<z.ZodOptional<z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>>>;
}, "strip", z.ZodTypeAny, {
    stateOverrideSet?: Partial<Record<`0x${string}`, {
        code?: `0x${string}` | undefined;
        balance?: bigint | undefined;
        nonce?: bigint | undefined;
        state?: Partial<Record<`0x${string}`, `0x${string}`>> | undefined;
        stateDiff?: Partial<Record<`0x${string}`, `0x${string}`>> | undefined;
    }>> | undefined;
    blockOverrideSet?: {
        number?: bigint | undefined;
        time?: bigint | undefined;
        gasLimit?: bigint | undefined;
        coinbase?: `0x${string}` | undefined;
        baseFee?: bigint | undefined;
        blobBaseFee?: bigint | undefined;
    } | undefined;
    throwOnFail?: boolean | undefined;
    createTrace?: boolean | undefined;
    createAccessList?: boolean | undefined;
    createTransaction?: boolean | "on-success" | "always" | "never" | undefined;
    addToMempool?: boolean | "on-success" | "always" | "never" | undefined;
    addToBlockchain?: boolean | "on-success" | "always" | "never" | undefined;
    blockTag?: bigint | `0x${string}` | "latest" | "earliest" | "pending" | "safe" | "finalized" | undefined;
    skipBalance?: boolean | undefined;
    gas?: bigint | undefined;
    gasPrice?: bigint | undefined;
    maxFeePerGas?: bigint | undefined;
    maxPriorityFeePerGas?: bigint | undefined;
    gasRefund?: bigint | undefined;
    origin?: `0x${string}` | undefined;
    caller?: `0x${string}` | undefined;
    value?: bigint | undefined;
    depth?: number | undefined;
    selfdestruct?: Set<`0x${string}`> | undefined;
    to?: `0x${string}` | undefined;
    blobVersionedHashes?: `0x${string}`[] | undefined;
    onStep?: ((...args: unknown[]) => unknown) | undefined;
    onNewContract?: ((...args: unknown[]) => unknown) | undefined;
    onBeforeMessage?: ((...args: unknown[]) => unknown) | undefined;
    onAfterMessage?: ((...args: unknown[]) => unknown) | undefined;
}, {
    stateOverrideSet?: Record<string, {
        code?: string | undefined;
        balance?: bigint | undefined;
        nonce?: bigint | undefined;
        state?: Record<string, string> | undefined;
        stateDiff?: Record<string, string> | undefined;
    }> | undefined;
    blockOverrideSet?: {
        number?: bigint | undefined;
        time?: bigint | undefined;
        gasLimit?: bigint | undefined;
        coinbase?: string | undefined;
        baseFee?: bigint | undefined;
        blobBaseFee?: bigint | undefined;
    } | undefined;
    throwOnFail?: boolean | undefined;
    createTrace?: boolean | undefined;
    createAccessList?: boolean | undefined;
    createTransaction?: boolean | "on-success" | "always" | "never" | undefined;
    addToMempool?: boolean | "on-success" | "always" | "never" | undefined;
    addToBlockchain?: boolean | "on-success" | "always" | "never" | undefined;
    blockTag?: string | number | bigint | undefined;
    skipBalance?: boolean | undefined;
    gas?: bigint | undefined;
    gasPrice?: bigint | undefined;
    maxFeePerGas?: bigint | undefined;
    maxPriorityFeePerGas?: bigint | undefined;
    gasRefund?: bigint | undefined;
    origin?: string | undefined;
    caller?: string | undefined;
    value?: bigint | undefined;
    depth?: number | undefined;
    selfdestruct?: Set<string> | undefined;
    to?: string | undefined;
    blobVersionedHashes?: string[] | undefined;
    onStep?: ((...args: unknown[]) => unknown) | undefined;
    onNewContract?: ((...args: unknown[]) => unknown) | undefined;
    onBeforeMessage?: ((...args: unknown[]) => unknown) | undefined;
    onAfterMessage?: ((...args: unknown[]) => unknown) | undefined;
}>, {
    stateOverrideSet?: Partial<Record<`0x${string}`, {
        code?: `0x${string}` | undefined;
        balance?: bigint | undefined;
        nonce?: bigint | undefined;
        state?: Partial<Record<`0x${string}`, `0x${string}`>> | undefined;
        stateDiff?: Partial<Record<`0x${string}`, `0x${string}`>> | undefined;
    }>> | undefined;
    blockOverrideSet?: {
        number?: bigint | undefined;
        time?: bigint | undefined;
        gasLimit?: bigint | undefined;
        coinbase?: `0x${string}` | undefined;
        baseFee?: bigint | undefined;
        blobBaseFee?: bigint | undefined;
    } | undefined;
    throwOnFail?: boolean | undefined;
    createTrace?: boolean | undefined;
    createAccessList?: boolean | undefined;
    createTransaction?: boolean | "on-success" | "always" | "never" | undefined;
    addToMempool?: boolean | "on-success" | "always" | "never" | undefined;
    addToBlockchain?: boolean | "on-success" | "always" | "never" | undefined;
    blockTag?: bigint | `0x${string}` | "latest" | "earliest" | "pending" | "safe" | "finalized" | undefined;
    skipBalance?: boolean | undefined;
    gas?: bigint | undefined;
    gasPrice?: bigint | undefined;
    maxFeePerGas?: bigint | undefined;
    maxPriorityFeePerGas?: bigint | undefined;
    gasRefund?: bigint | undefined;
    origin?: `0x${string}` | undefined;
    caller?: `0x${string}` | undefined;
    value?: bigint | undefined;
    depth?: number | undefined;
    selfdestruct?: Set<`0x${string}`> | undefined;
    to?: `0x${string}` | undefined;
    blobVersionedHashes?: `0x${string}`[] | undefined;
    onStep?: ((...args: unknown[]) => unknown) | undefined;
    onNewContract?: ((...args: unknown[]) => unknown) | undefined;
    onBeforeMessage?: ((...args: unknown[]) => unknown) | undefined;
    onAfterMessage?: ((...args: unknown[]) => unknown) | undefined;
}, {
    stateOverrideSet?: Record<string, {
        code?: string | undefined;
        balance?: bigint | undefined;
        nonce?: bigint | undefined;
        state?: Record<string, string> | undefined;
        stateDiff?: Record<string, string> | undefined;
    }> | undefined;
    blockOverrideSet?: {
        number?: bigint | undefined;
        time?: bigint | undefined;
        gasLimit?: bigint | undefined;
        coinbase?: string | undefined;
        baseFee?: bigint | undefined;
        blobBaseFee?: bigint | undefined;
    } | undefined;
    throwOnFail?: boolean | undefined;
    createTrace?: boolean | undefined;
    createAccessList?: boolean | undefined;
    createTransaction?: boolean | "on-success" | "always" | "never" | undefined;
    addToMempool?: boolean | "on-success" | "always" | "never" | undefined;
    addToBlockchain?: boolean | "on-success" | "always" | "never" | undefined;
    blockTag?: string | number | bigint | undefined;
    skipBalance?: boolean | undefined;
    gas?: bigint | undefined;
    gasPrice?: bigint | undefined;
    maxFeePerGas?: bigint | undefined;
    maxPriorityFeePerGas?: bigint | undefined;
    gasRefund?: bigint | undefined;
    origin?: string | undefined;
    caller?: string | undefined;
    value?: bigint | undefined;
    depth?: number | undefined;
    selfdestruct?: Set<string> | undefined;
    to?: string | undefined;
    blobVersionedHashes?: string[] | undefined;
    onStep?: ((...args: unknown[]) => unknown) | undefined;
    onNewContract?: ((...args: unknown[]) => unknown) | undefined;
    onBeforeMessage?: ((...args: unknown[]) => unknown) | undefined;
    onAfterMessage?: ((...args: unknown[]) => unknown) | undefined;
}>, z.ZodObject<{
    to: z.ZodOptional<z.ZodEffects<z.ZodString, `0x${string}`, string>>;
    abi: z.ZodReadonly<z.ZodArray<z.ZodUnion<[z.ZodObject<{
        type: z.ZodLiteral<"error">;
        inputs: z.ZodReadonly<z.ZodArray<z.ZodType<import("abitype").AbiParameter, z.ZodTypeDef, import("abitype").AbiParameter>, "many">>;
        name: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        inputs: readonly import("abitype").AbiParameter[];
        type: "error";
        name: string;
    }, {
        inputs: readonly import("abitype").AbiParameter[];
        type: "error";
        name: string;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"event">;
        anonymous: z.ZodOptional<z.ZodBoolean>;
        inputs: z.ZodReadonly<z.ZodArray<z.ZodType<import("abitype").AbiEventParameter, z.ZodTypeDef, import("abitype").AbiEventParameter>, "many">>;
        name: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        inputs: readonly import("abitype").AbiEventParameter[];
        type: "event";
        name: string;
        anonymous?: boolean | undefined;
    }, {
        inputs: readonly import("abitype").AbiEventParameter[];
        type: "event";
        name: string;
        anonymous?: boolean | undefined;
    }>, z.ZodEffects<z.ZodIntersection<z.ZodObject<{
        constant: z.ZodOptional<z.ZodBoolean>;
        gas: z.ZodOptional<z.ZodNumber>;
        payable: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        payable?: boolean | undefined;
        constant?: boolean | undefined;
        gas?: number | undefined;
    }, {
        payable?: boolean | undefined;
        constant?: boolean | undefined;
        gas?: number | undefined;
    }>, z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
        type: z.ZodLiteral<"function">;
        inputs: z.ZodReadonly<z.ZodArray<z.ZodType<import("abitype").AbiParameter, z.ZodTypeDef, import("abitype").AbiParameter>, "many">>;
        name: z.ZodString;
        outputs: z.ZodReadonly<z.ZodArray<z.ZodType<import("abitype").AbiParameter, z.ZodTypeDef, import("abitype").AbiParameter>, "many">>;
        stateMutability: z.ZodUnion<[z.ZodLiteral<"pure">, z.ZodLiteral<"view">, z.ZodLiteral<"nonpayable">, z.ZodLiteral<"payable">]>;
    }, "strip", z.ZodTypeAny, {
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
    }>, z.ZodObject<{
        type: z.ZodLiteral<"constructor">;
        inputs: z.ZodReadonly<z.ZodArray<z.ZodType<import("abitype").AbiParameter, z.ZodTypeDef, import("abitype").AbiParameter>, "many">>;
        stateMutability: z.ZodUnion<[z.ZodLiteral<"payable">, z.ZodLiteral<"nonpayable">]>;
    }, "strip", z.ZodTypeAny, {
        inputs: readonly import("abitype").AbiParameter[];
        type: "constructor";
        stateMutability: "nonpayable" | "payable";
    }, {
        inputs: readonly import("abitype").AbiParameter[];
        type: "constructor";
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
    args: z.ZodOptional<z.ZodArray<z.ZodAny, "many">>;
    functionName: z.ZodString;
    code: z.ZodOptional<z.ZodEffects<z.ZodString, `0x${string}`, string>>;
    deployedBytecode: z.ZodOptional<z.ZodEffects<z.ZodString, `0x${string}`, string>>;
}, "strip", z.ZodTypeAny, {
    functionName: string;
    abi: readonly ({
        inputs: readonly import("abitype").AbiParameter[];
        type: "error";
        name: string;
    } | {
        inputs: readonly import("abitype").AbiEventParameter[];
        type: "event";
        name: string;
        anonymous?: boolean | undefined;
    } | ({
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
    })))[];
    code?: `0x${string}` | undefined;
    to?: `0x${string}` | undefined;
    deployedBytecode?: `0x${string}` | undefined;
    args?: any[] | undefined;
}, {
    functionName: string;
    abi: readonly unknown[];
    code?: string | undefined;
    to?: string | undefined;
    deployedBytecode?: string | undefined;
    args?: any[] | undefined;
}>>, {
    stateOverrideSet?: Partial<Record<`0x${string}`, {
        code?: `0x${string}` | undefined;
        balance?: bigint | undefined;
        nonce?: bigint | undefined;
        state?: Partial<Record<`0x${string}`, `0x${string}`>> | undefined;
        stateDiff?: Partial<Record<`0x${string}`, `0x${string}`>> | undefined;
    }>> | undefined;
    blockOverrideSet?: {
        number?: bigint | undefined;
        time?: bigint | undefined;
        gasLimit?: bigint | undefined;
        coinbase?: `0x${string}` | undefined;
        baseFee?: bigint | undefined;
        blobBaseFee?: bigint | undefined;
    } | undefined;
    throwOnFail?: boolean | undefined;
    createTrace?: boolean | undefined;
    createAccessList?: boolean | undefined;
    createTransaction?: boolean | "on-success" | "always" | "never" | undefined;
    addToMempool?: boolean | "on-success" | "always" | "never" | undefined;
    addToBlockchain?: boolean | "on-success" | "always" | "never" | undefined;
    blockTag?: bigint | `0x${string}` | "latest" | "earliest" | "pending" | "safe" | "finalized" | undefined;
    skipBalance?: boolean | undefined;
    gas?: bigint | undefined;
    gasPrice?: bigint | undefined;
    maxFeePerGas?: bigint | undefined;
    maxPriorityFeePerGas?: bigint | undefined;
    gasRefund?: bigint | undefined;
    origin?: `0x${string}` | undefined;
    caller?: `0x${string}` | undefined;
    value?: bigint | undefined;
    depth?: number | undefined;
    selfdestruct?: Set<`0x${string}`> | undefined;
    to?: `0x${string}` | undefined;
    blobVersionedHashes?: `0x${string}`[] | undefined;
    onStep?: ((...args: unknown[]) => unknown) | undefined;
    onNewContract?: ((...args: unknown[]) => unknown) | undefined;
    onBeforeMessage?: ((...args: unknown[]) => unknown) | undefined;
    onAfterMessage?: ((...args: unknown[]) => unknown) | undefined;
} & {
    functionName: string;
    abi: readonly ({
        inputs: readonly import("abitype").AbiParameter[];
        type: "error";
        name: string;
    } | {
        inputs: readonly import("abitype").AbiEventParameter[];
        type: "event";
        name: string;
        anonymous?: boolean | undefined;
    } | ({
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
    })))[];
    code?: `0x${string}` | undefined;
    to?: `0x${string}` | undefined;
    deployedBytecode?: `0x${string}` | undefined;
    args?: any[] | undefined;
}, {
    stateOverrideSet?: Record<string, {
        code?: string | undefined;
        balance?: bigint | undefined;
        nonce?: bigint | undefined;
        state?: Record<string, string> | undefined;
        stateDiff?: Record<string, string> | undefined;
    }> | undefined;
    blockOverrideSet?: {
        number?: bigint | undefined;
        time?: bigint | undefined;
        gasLimit?: bigint | undefined;
        coinbase?: string | undefined;
        baseFee?: bigint | undefined;
        blobBaseFee?: bigint | undefined;
    } | undefined;
    throwOnFail?: boolean | undefined;
    createTrace?: boolean | undefined;
    createAccessList?: boolean | undefined;
    createTransaction?: boolean | "on-success" | "always" | "never" | undefined;
    addToMempool?: boolean | "on-success" | "always" | "never" | undefined;
    addToBlockchain?: boolean | "on-success" | "always" | "never" | undefined;
    blockTag?: string | number | bigint | undefined;
    skipBalance?: boolean | undefined;
    gas?: bigint | undefined;
    gasPrice?: bigint | undefined;
    maxFeePerGas?: bigint | undefined;
    maxPriorityFeePerGas?: bigint | undefined;
    gasRefund?: bigint | undefined;
    origin?: string | undefined;
    caller?: string | undefined;
    value?: bigint | undefined;
    depth?: number | undefined;
    selfdestruct?: Set<string> | undefined;
    to?: string | undefined;
    blobVersionedHashes?: string[] | undefined;
    onStep?: ((...args: unknown[]) => unknown) | undefined;
    onNewContract?: ((...args: unknown[]) => unknown) | undefined;
    onBeforeMessage?: ((...args: unknown[]) => unknown) | undefined;
    onAfterMessage?: ((...args: unknown[]) => unknown) | undefined;
} & {
    functionName: string;
    abi: readonly unknown[];
    code?: string | undefined;
    to?: string | undefined;
    deployedBytecode?: string | undefined;
    args?: any[] | undefined;
}>, {
    stateOverrideSet?: Partial<Record<`0x${string}`, {
        code?: `0x${string}` | undefined;
        balance?: bigint | undefined;
        nonce?: bigint | undefined;
        state?: Partial<Record<`0x${string}`, `0x${string}`>> | undefined;
        stateDiff?: Partial<Record<`0x${string}`, `0x${string}`>> | undefined;
    }>> | undefined;
    blockOverrideSet?: {
        number?: bigint | undefined;
        time?: bigint | undefined;
        gasLimit?: bigint | undefined;
        coinbase?: `0x${string}` | undefined;
        baseFee?: bigint | undefined;
        blobBaseFee?: bigint | undefined;
    } | undefined;
    throwOnFail?: boolean | undefined;
    createTrace?: boolean | undefined;
    createAccessList?: boolean | undefined;
    createTransaction?: boolean | "on-success" | "always" | "never" | undefined;
    addToMempool?: boolean | "on-success" | "always" | "never" | undefined;
    addToBlockchain?: boolean | "on-success" | "always" | "never" | undefined;
    blockTag?: bigint | `0x${string}` | "latest" | "earliest" | "pending" | "safe" | "finalized" | undefined;
    skipBalance?: boolean | undefined;
    gas?: bigint | undefined;
    gasPrice?: bigint | undefined;
    maxFeePerGas?: bigint | undefined;
    maxPriorityFeePerGas?: bigint | undefined;
    gasRefund?: bigint | undefined;
    origin?: `0x${string}` | undefined;
    caller?: `0x${string}` | undefined;
    value?: bigint | undefined;
    depth?: number | undefined;
    selfdestruct?: Set<`0x${string}`> | undefined;
    to?: `0x${string}` | undefined;
    blobVersionedHashes?: `0x${string}`[] | undefined;
    onStep?: ((...args: unknown[]) => unknown) | undefined;
    onNewContract?: ((...args: unknown[]) => unknown) | undefined;
    onBeforeMessage?: ((...args: unknown[]) => unknown) | undefined;
    onAfterMessage?: ((...args: unknown[]) => unknown) | undefined;
} & {
    functionName: string;
    abi: readonly ({
        inputs: readonly import("abitype").AbiParameter[];
        type: "error";
        name: string;
    } | {
        inputs: readonly import("abitype").AbiEventParameter[];
        type: "event";
        name: string;
        anonymous?: boolean | undefined;
    } | ({
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
    })))[];
    code?: `0x${string}` | undefined;
    to?: `0x${string}` | undefined;
    deployedBytecode?: `0x${string}` | undefined;
    args?: any[] | undefined;
}, {
    stateOverrideSet?: Record<string, {
        code?: string | undefined;
        balance?: bigint | undefined;
        nonce?: bigint | undefined;
        state?: Record<string, string> | undefined;
        stateDiff?: Record<string, string> | undefined;
    }> | undefined;
    blockOverrideSet?: {
        number?: bigint | undefined;
        time?: bigint | undefined;
        gasLimit?: bigint | undefined;
        coinbase?: string | undefined;
        baseFee?: bigint | undefined;
        blobBaseFee?: bigint | undefined;
    } | undefined;
    throwOnFail?: boolean | undefined;
    createTrace?: boolean | undefined;
    createAccessList?: boolean | undefined;
    createTransaction?: boolean | "on-success" | "always" | "never" | undefined;
    addToMempool?: boolean | "on-success" | "always" | "never" | undefined;
    addToBlockchain?: boolean | "on-success" | "always" | "never" | undefined;
    blockTag?: string | number | bigint | undefined;
    skipBalance?: boolean | undefined;
    gas?: bigint | undefined;
    gasPrice?: bigint | undefined;
    maxFeePerGas?: bigint | undefined;
    maxPriorityFeePerGas?: bigint | undefined;
    gasRefund?: bigint | undefined;
    origin?: string | undefined;
    caller?: string | undefined;
    value?: bigint | undefined;
    depth?: number | undefined;
    selfdestruct?: Set<string> | undefined;
    to?: string | undefined;
    blobVersionedHashes?: string[] | undefined;
    onStep?: ((...args: unknown[]) => unknown) | undefined;
    onNewContract?: ((...args: unknown[]) => unknown) | undefined;
    onBeforeMessage?: ((...args: unknown[]) => unknown) | undefined;
    onAfterMessage?: ((...args: unknown[]) => unknown) | undefined;
} & {
    functionName: string;
    abi: readonly unknown[];
    code?: string | undefined;
    to?: string | undefined;
    deployedBytecode?: string | undefined;
    args?: any[] | undefined;
}>;
import { z } from 'zod';
//# sourceMappingURL=zContractParams.d.ts.map