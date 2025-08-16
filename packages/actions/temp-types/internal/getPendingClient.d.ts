export function getPendingClient(client: import("@tevm/node").TevmNode): Promise<{
    pendingClient: import("@tevm/node").TevmNode;
    blockHashes: Array<import("../common/Hex.js").Hex>;
    errors?: never;
} | {
    errors: Array<import("../Mine/TevmMineError.js").TevmMineError>;
}>;
//# sourceMappingURL=getPendingClient.d.ts.map