export function runCallWithPrestateTrace<TDiffMode extends boolean>(client: import("@tevm/node").TevmNode, evmInput: import("@tevm/evm").EvmRunCallOpts, diffMode?: TDiffMode): Promise<import("@tevm/evm").EvmResult & {
    trace: import("../common/PrestateTraceResult.js").PrestateTraceResult<TDiffMode>;
}>;
//# sourceMappingURL=runCallWithPrestateTrace.d.ts.map