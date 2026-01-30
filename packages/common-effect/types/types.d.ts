export type Hardfork = import("./CommonShape.js").Hardfork;
export type CommonShape = import("./CommonShape.js").CommonShape;
/**
 * Logging level options
 */
export type LogLevel = "debug" | "info" | "warn" | "error" | "silent";
/**
 * Configuration options for CommonFromConfig layer
 */
export type CommonConfigOptions = {
    /**
     * - Chain ID (default: 900 for tevm-devnet)
     */
    chainId?: number;
    /**
     * - Hardfork to use (default: 'prague')
     */
    hardfork?: Hardfork;
    /**
     * - Additional EIPs to enable
     */
    eips?: readonly number[];
    /**
     * - Logging level (default: 'warn')
     */
    loggingLevel?: LogLevel;
    /**
     * - Custom cryptographic implementations
     */
    customCrypto?: import("@tevm/common").CustomCrypto;
};
//# sourceMappingURL=types.d.ts.map