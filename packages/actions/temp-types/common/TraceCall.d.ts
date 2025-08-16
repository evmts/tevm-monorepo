import type { Address } from './Address.js';
import type { Hex } from './Hex.js';
import type { TraceType } from './TraceType.js';
export type TraceCall = {
    type: TraceType;
    from: Address;
    to: Address;
    value?: bigint;
    gas?: bigint;
    gasUsed?: bigint;
    input: Hex;
    output: Hex;
    error?: string;
    revertReason?: string;
    calls?: TraceCall[];
};
//# sourceMappingURL=TraceCall.d.ts.map