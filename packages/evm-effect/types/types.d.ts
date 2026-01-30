/**
 * EVM execution error type - union of specific EVM errors and general TevmError
 */
export type EvmError = import("@tevm/errors-effect").OutOfGasError | import("@tevm/errors-effect").RevertError | import("@tevm/errors-effect").InvalidOpcodeError | import("@tevm/errors-effect").StackOverflowError | import("@tevm/errors-effect").StackUnderflowError | import("@tevm/errors-effect").InsufficientBalanceError | import("@tevm/errors-effect").InsufficientFundsError | import("@tevm/errors-effect").InvalidJumpError | import("@tevm/errors-effect").TevmError;
/**
 * EvmShape interface for Effect-based EVM operations.
 *
 * This interface provides Effect-wrapped methods for interacting with the
 * Ethereum Virtual Machine, including call execution and precompile management.
 *
 * Note: runCall and runCode return the EVM result in the success channel.
 * The error channel (EvmError) is for exceptions thrown during EVM setup/execution.
 * Execution-level "errors" like reverts and out-of-gas are returned in the
 * execResult.exceptionError property of the success value, as is standard for EVM.
 */
export type EvmShape = {
    /**
     * - The underlying EVM instance
     */
    evm: import("@tevm/evm").Evm;
    /**
     * - Execute a call in the EVM. Typed error channel for exceptions; execution errors in execResult.exceptionError
     */
    runCall: (opts: import("@tevm/evm").EvmRunCallOpts) => import("effect").Effect.Effect<import("@tevm/evm").EvmResult, EvmError>;
    /**
     * - Execute code in the EVM. Typed error channel for exceptions; execution errors in exceptionError property
     */
    runCode: (opts: import("@tevm/evm").EvmRunCallOpts) => import("effect").Effect.Effect<import("@tevm/evm").ExecResult, EvmError>;
    /**
     * - Get all active precompiles
     */
    getActivePrecompiles: () => import("effect").Effect.Effect<import("@tevm/evm").Evm["precompiles"]>;
    /**
     * - Add a custom precompile
     */
    addCustomPrecompile: (precompile: import("@tevm/evm").CustomPrecompile) => import("effect").Effect.Effect<void>;
    /**
     * - Remove a custom precompile
     */
    removeCustomPrecompile: (precompile: import("@tevm/evm").CustomPrecompile) => import("effect").Effect.Effect<void>;
};
/**
 * Configuration options for EvmLive layer
 */
export type EvmLiveOptions = {
    /**
     * - Allow contracts larger than EIP-170 limit
     */
    allowUnlimitedContractSize?: boolean;
    /**
     * - Custom precompiles to add
     */
    customPrecompiles?: import("@tevm/evm").CustomPrecompile[];
    /**
     * - Enable EVM profiler
     */
    profiler?: boolean;
    /**
     * - Enable logging for EVM operations
     */
    loggingEnabled?: boolean;
};
//# sourceMappingURL=types.d.ts.map