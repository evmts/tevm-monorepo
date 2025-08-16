export function executeCall(client: import("@tevm/node").TevmNode, evmInput: import("@tevm/evm").EvmRunCallOpts, params: import("./CallParams.js").CallParams, events?: import("../common/CallEvents.js").CallEvents): Promise<(ExecuteCallResult & {
    errors?: [ExecuteCallError];
}) | {
    errors: [ExecuteCallError];
}>;
/**
 * The error returned by executeCall
 */
export type ExecuteCallError = import("./handleEvmError.js").HandleRunTxError;
/**
 * The return value of executeCall
 */
export type ExecuteCallResult = {
    runTxResult: import("@tevm/vm").RunTxResult;
    trace: import("../common/TraceResult.js").TraceResult | undefined;
    accessList: undefined | Map<string, Set<string>>;
};
//# sourceMappingURL=executeCall.d.ts.map