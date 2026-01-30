export function toBaseError<T extends TevmError | import("../evm/InsufficientBalanceError.js").InsufficientBalanceError | import("../evm/OutOfGasError.js").OutOfGasError | import("../evm/RevertError.js").RevertError | import("../evm/InvalidOpcodeError.js").InvalidOpcodeError | import("../evm/StackOverflowError.js").StackOverflowError | import("../evm/StackUnderflowError.js").StackUnderflowError>(taggedError: T): BaseErrorLike & Omit<T, "_tag" | "message" | "code" | "docsPath">;
export type BaseErrorLike = {
    /**
     * - Internal tag for the error
     */
    _tag: string;
    /**
     * - The name of the error
     */
    name: string;
    /**
     * - Human-readable error message
     */
    message: string;
    /**
     * - JSON-RPC error code
     */
    code: number;
    /**
     * - Path to documentation
     */
    docsPath: string | undefined;
    /**
     * - Short description of the error
     */
    shortMessage: string;
    /**
     * - Library version
     */
    version: string;
    /**
     * - Error details computed from cause (matches BaseError behavior)
     */
    details: string;
    /**
     * - The underlying cause of the error (for error chaining)
     */
    cause: unknown;
    /**
     * - Additional meta messages for display
     */
    metaMessages: string[] | undefined;
    /**
     * - Walk through error chain to find matching error
     */
    walk: (fn?: (err: unknown) => boolean) => unknown;
};
import { TevmError } from '../TevmError.js';
//# sourceMappingURL=toBaseError.d.ts.map