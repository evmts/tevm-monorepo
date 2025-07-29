export function ethSignTransactionHandler({ getChainId, accounts }: {
    accounts: ReadonlyArray<import("@tevm/utils").HDAccount>;
    getChainId: () => Promise<number>;
}): import("./EthHandler.js").EthSignTransactionHandler;
//# sourceMappingURL=ethSignTransactionHandler.d.ts.map