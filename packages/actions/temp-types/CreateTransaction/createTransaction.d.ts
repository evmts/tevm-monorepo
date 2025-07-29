export function createTransaction(client: import("@tevm/node").TevmNode, defaultThrowOnFail?: boolean): ({ evmInput, evmOutput, throwOnFail, ...priorityFeeOpts }: {
    evmInput: import("@tevm/evm").EvmRunCallOpts;
    evmOutput: import("@tevm/evm").EvmResult;
    maxFeePerGas?: bigint | undefined;
    maxPriorityFeePerGas?: bigint | undefined;
    throwOnFail?: boolean | undefined;
}) => Promise<{
    errors: {
        _tag: string;
        name: string;
        message: string;
    }[];
} | {
    errors: {
        name: string;
        _tag: string;
        message: unknown;
    }[];
    executionGasUsed: bigint;
    /**
     * @type {`0x${string}`}
     */
    rawData: `0x${string}`;
} | {
    txHash: `0x${string}`;
}>;
//# sourceMappingURL=createTransaction.d.ts.map