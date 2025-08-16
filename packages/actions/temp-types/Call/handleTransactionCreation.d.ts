export function handleTransactionCreation(client: import("@tevm/node").TevmNode, params: import("./CallParams.js").CallParams, executedCall: import("./executeCall.js").ExecuteCallResult, evmInput: import("@tevm/evm").EvmRunCallOpts): Promise<{
    hash: import("@tevm/utils").Hex | undefined;
    errors?: never;
} | {
    hash?: never;
    errors: Array<import("./TevmCallError.js").TevmCallError>;
}>;
//# sourceMappingURL=handleTransactionCreation.d.ts.map