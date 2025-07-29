export function createScript(client: import("@tevm/node").TevmNode, code?: import("@tevm/utils").Hex, deployedBytecode?: import("@tevm/utils").Hex, to?: import("@tevm/utils").Address): Promise<{
    errors?: never;
    address: import("@tevm/utils").Address;
} | {
    address?: never;
    errors: Array<Error>;
}>;
//# sourceMappingURL=createScript.d.ts.map