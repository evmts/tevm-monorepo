export class MissingAccountError extends Error {
    /**
     * @type {'MissingAccountError'}
     */
    _tag: "MissingAccountError";
    /**
     * @type {'MissingAccountError'}
     * @override
     */
    override name: "MissingAccountError";
}
export function ethSignHandler({ accounts }: {
    accounts: ReadonlyArray<import("@tevm/utils").HDAccount>;
}): import("./EthHandler.js").EthSignHandler;
//# sourceMappingURL=ethSignHandler.d.ts.map