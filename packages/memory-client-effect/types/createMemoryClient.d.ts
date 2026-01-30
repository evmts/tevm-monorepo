export function createMemoryClient(options?: import("./types.js").MemoryClientOptions): ViemMemoryClient;
export type ViemMemoryClient = {
    /**
     * - Wait for client to be ready
     */
    ready: () => Promise<boolean>;
    /**
     * - Get current block number
     */
    getBlockNumber: () => Promise<bigint>;
    /**
     * - Get chain ID
     */
    getChainId: () => Promise<bigint>;
    /**
     * - Get account info
     */
    tevmGetAccount: (params: import("@tevm/actions-effect").GetAccountParams) => Promise<import("@tevm/actions-effect").GetAccountSuccess>;
    /**
     * - Set account state
     */
    tevmSetAccount: (params: import("@tevm/actions-effect").SetAccountParams) => Promise<import("@tevm/actions-effect").SetAccountSuccess>;
    /**
     * - Get account balance
     */
    getBalance: (params: import("@tevm/actions-effect").GetBalanceParams) => Promise<bigint>;
    /**
     * - Get account code
     */
    getCode: (params: import("@tevm/actions-effect").GetCodeParams) => Promise<import("./types.js").Hex>;
    /**
     * - Get storage value
     */
    getStorageAt: (params: import("@tevm/actions-effect").GetStorageAtParams) => Promise<import("./types.js").Hex>;
    /**
     * - Take state snapshot
     */
    takeSnapshot: () => Promise<import("./types.js").Hex>;
    /**
     * - Revert to snapshot
     */
    revertToSnapshot: (snapshotId: import("./types.js").Hex) => Promise<void>;
    /**
     * - Create deep copy of client
     */
    deepCopy: () => Promise<ViemMemoryClient>;
    /**
     * - Dispose of client resources
     */
    destroy: () => Promise<void>;
    /**
     * - Effect escape hatch
     */
    effect: {
        runtime: ManagedRuntime.ManagedRuntime<import("effect/Context").Tag<any, any>, never>;
        layer: Layer.Layer<import("effect/Context").Tag<any, any>, never, never>;
    };
};
import { ManagedRuntime } from 'effect';
import { Layer } from 'effect';
//# sourceMappingURL=createMemoryClient.d.ts.map