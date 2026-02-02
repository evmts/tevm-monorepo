export function CommonFromFork(options?: CommonFromForkOptions): Layer.Layer<import("effect/Context").Tag<any, any>, never, import("effect/Context").Tag<any, any>>;
export type CommonShape = import("./types.js").CommonShape;
export type Hardfork = import("./types.js").Hardfork;
export type LogLevel = import("./types.js").LogLevel;
/**
 * Configuration options for CommonFromFork layer
 */
export type CommonFromForkOptions = {
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
};
import { Layer } from 'effect';
//# sourceMappingURL=CommonFromFork.d.ts.map