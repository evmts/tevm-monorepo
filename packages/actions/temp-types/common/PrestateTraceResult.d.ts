import type { AccountState } from './AccountState.js';
import type { Hex } from './Hex.js';
/** Result from `debug_*` with `prestateTracer` */
export type PrestateTraceResult<TDiffMode extends boolean = boolean> = TDiffMode extends true ? {
    readonly pre: Record<Hex, AccountState>;
    readonly post: Record<Hex, Partial<AccountState>>;
} : Record<Hex, AccountState>;
//# sourceMappingURL=PrestateTraceResult.d.ts.map