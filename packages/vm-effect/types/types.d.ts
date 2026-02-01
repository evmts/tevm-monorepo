/**
 * VM execution error type - reuses EvmError from evm-effect
 */
export type VmError = import("@tevm/evm-effect").EvmError;
/**
 * VmShape interface for Effect-based VM operations.
 *
 * This interface provides Effect-wrapped methods for interacting with the
 * Virtual Machine, including transaction and block execution.
 *
 * Note: runTx and runBlock have typed error channels (VmError) for exceptions
 * thrown during VM execution. This uses the same error mapping as EvmService.
 */
export type VmShape = {
    /**
     * - The underlying VM instance
     */
    vm: import("@tevm/vm").Vm;
    /**
     * - Execute a transaction. Typed error channel for exceptions.
     */
    runTx: (opts: import("@tevm/vm").RunTxOpts) => import("effect").Effect.Effect<import("@tevm/vm").RunTxResult, VmError>;
    /**
     * - Execute a block. Typed error channel for exceptions.
     */
    runBlock: (opts: import("@tevm/vm").RunBlockOpts) => import("effect").Effect.Effect<import("@tevm/vm").RunBlockResult, VmError>;
    /**
     * - Build a new block. Typed error channel for exceptions.
     */
    buildBlock: (opts: import("@tevm/vm").BuildBlockOpts) => import("effect").Effect.Effect<Awaited<ReturnType<import("@tevm/vm").Vm["buildBlock"]>>, VmError>;
    /**
     * - Effect that completes when VM is ready
     */
    ready: import("effect").Effect.Effect<void>;
    /**
     * - Create a deep copy of the VM
     */
    deepCopy: () => import("effect").Effect.Effect<VmShape>;
};
/**
 * Configuration options for VmLive layer.
 *
 * Note: VM-level profiling and logging should be configured at the EVM layer
 * using EvmLive({ profiler: true, loggingEnabled: true }). The VM layer wraps
 * an already-configured EVM from EvmService.
 */
export type VmLiveOptions = {};
//# sourceMappingURL=types.d.ts.map